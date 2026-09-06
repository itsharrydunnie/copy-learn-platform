import mongoose from "mongoose";
import { IResult } from "../../../utils/interfaces.util";
import PaystackService from "../paystack/paystack.service";
import TransactionRepository from "./transaction.repository";
import UserRepository from "@/modules/users/user/user.repository";
import { Currency, NewTransactionDTO, PendingDTO } from "./transaction.dto";
import { ICourse } from "@/modules/core/courses/course.interface";
import {
  TransactionLabel,
  TransactionType,
  TransactionStatus,
  PaymentProvider,
  ITransactionDoc,
} from "./transaction.interface";
import enrollRepository from "@/modules/core/enrollments/enroll.repository";
import {
  EnrollmentStatus,
  EnrollmentTargetType,
  IEnrollment,
} from "@/modules/core/enrollments/enroll.interface";
import courseRepository from "@/modules/core/courses/course.repository";
import { IUserDoc } from "@/modules/users/user/user.interface";
import { IPaystackWebhookEvent } from "../paystack/paystack.interface";
import enrollmentService from "@/modules/core/enrollments/enroll.service";
import enrollActivateService from "@/modules/core/enrollments/enroll.activate.service";
import scholarshipRepository from "@/modules/core/scholarships/scholarship.repository";
import { ScholarshipStatus } from "@/modules/core/scholarships/scholarship.interface";
import EmailService from "@/modules/internals/email.service";

/**
 * Responsible for handling transactions. Paystack-based
 * This service manages: transaction lifecycle, transaction initialization, verification of completed payments, webhook reconciliation
 */
class TransactionService {
  constructor(
    private transactionRepository = TransactionRepository,
    private paystackService = PaystackService,
    private courseRepo = courseRepository,
    private enrollmentRepository = enrollRepository,
    private userRepository = UserRepository,
    private enrollActivation = enrollActivateService,
    private scholarshipRepo = scholarshipRepository,
    private emailService = EmailService,
  ) {}

  /**
   * @name initializePayment
   * @describtion Create a local transaction and initialize it with paystack
   * @param {enrollmentId} - Enrollment Id
   * @param {userId} - User paying for the enrollment
   * @returns {Promise<IResult>}
   *
   */
  public async initializePayment(
    enrollmentId: string,
    userId: string,
  ): Promise<IResult> {
    let result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: {},
    };

    // Find enrollment

    const enrollmentResult =
      await this.enrollmentRepository.getEnrollmentById(enrollmentId);

    if (enrollmentResult.error || !enrollmentResult.data) {
      result.error = true;
      result.message =
        "Enrollment not found. Please restart Enrollment Process";
      result.code = 404;
      return result;
    }

    const enrollment = enrollmentResult.data as IEnrollment;

    // verify enrollment ownership
    if (!enrollment.userId.equals(new mongoose.Types.ObjectId(userId))) {
      result.error = true;
      result.message = "Unauthorized";
      result.code = 403;
      return result;
    }

    const userResult = await this.userRepository.findById(userId);

    const user = userResult.data as IUserDoc;

    if (enrollment.targetType !== EnrollmentTargetType.COURSE) {
      result.error = true;
      result.message = "Payment is only available for course enrollments";
      result.code = 400;
      return result;
    }

    // Validate enrollment State
    if (enrollment.status !== EnrollmentStatus.PENDING) {
      result.error = true;
      result.message = "This enrollment is not awaiting payment";
      result.code = 400;
      return result;
    }

    const courseId = enrollment.targetId;

    // Get course
    const courseResult = await this.courseRepo.getCourseById(String(courseId));

    const course = courseResult.data as ICourse;

    // Existing pending transaction
    const pendingTransaction =
      await this.transactionRepository.getPendingTransactionByEnrollmentId(
        enrollmentId,
      );

    if (!pendingTransaction.error) {
      // A pending transaction was found
      console.log(pendingTransaction);
      result.message = "Payment already initialized";
      result.data = {
        authorizationUrl: pendingTransaction.data?.authorizationUrl,
        reference: pendingTransaction.data?.reference,
      };
      return result;
    }
    const reference = `PCPD-TXN-${Date.now()}`;

    const response = await this.paystackService.intializePayment({
      email: user.email,
      amount: String(course.price),
      reference,

      metadata: {
        enrollmentId,
        courseId,
        userId,
      },
    });

    // Handle response from Paystack and create a local transaction record
    if (!response.status) {
      result = {
        error: true,
        message: "Failed to initialize transaction, please try again later",
        code: 500,
        data: {},
      };
      return result;
    }

    // create transaction locally

    const newTransaction = await this.transactionRepository.createTransaction({
      type: TransactionType.PAYMENT,
      status: TransactionStatus.PENDING,
      label: TransactionLabel.COURSE_PAYMENT,
      description: `Course payment of ${course.price} ${Currency.NGN} for user ${userId}`,
      providerName: PaymentProvider.PAYSTACK,
      reference: reference,
      currency: Currency.NGN,
      amount: course.price,
      userId: new mongoose.Types.ObjectId(userId),
      enrollmentId: new mongoose.Types.ObjectId(enrollmentId),
      courseId: new mongoose.Types.ObjectId(courseId),
      accessCode: response.data?.access_code,
      authorizationUrl: response.data?.authorization_url,
    });

    console.log(newTransaction);

    result.message = "Payment initialized successfully";
    result.data = response.data;
    return result;
  }

  /**
   * @name verifyTransaction
   * @description verify a transaction with paystack after redirect or callback.
   * @param reference Paystack transaction reference
   * @returns
   */
  public async verifyTransaction(reference: string) {
    let result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: {},
    };

    if (reference == null) {
      throw new Error("Reference is required to verify transaction");
    }

    const response = await this.paystackService.verifyTransaction(reference);

    if (!response.status) {
      result.error = true;
      result.code = 400;
      return result;
    }

    result.message = "Verification Successfully";
    result.data = {
      status: response.data?.status,
      amount: response.data.amount,
      currency: response.data.currency,
      reference: response.data.reference,
      paidAt: response.data.paid_at,
      paymentMethod: response.data.channel,
    };
    return result;
  }

  /**
   * @name handleWebhook
   * @description Handle paystack webhook events. This is the final authority for transaction success or failure. Must be idempotent and signature-verified.
   * Expected events:
   * - charge.success
   * - charge.failed
   * @param payload - Raw webhook payload
   * @returns {Promise<void>}
   */
  public async handleWebhook(eventData: IPaystackWebhookEvent) {
    const eventType = eventData.event;
    switch (eventType) {
      case "chargesuccess":
        const email = eventData.data.customer?.email;

        if (email) {
          const scholarshipHandled = await this.handleScholarshipPayment(
            eventData.data,
          );

          if (scholarshipHandled) {
            break;
          }
        }

        await this.markTransactionSuccessful(
          eventData.data.reference,
          eventData.data,
        );

        break;

      case "charge.failed":
        await this.markTransactionFailed(
          eventData.data.reference,
          eventData.reason!,
        );
        break;
      default:
        console.log("webhook event not handled", eventType);
        return;
    }
  }

  /**
   * @name markTransactionSuccessful
   * @description Mark a transaction as successful. Called only after Paystack verification or webhook confirmation.
   * @param {string} reference - Paystack reference.
   * @param {Object} providerData - Full Paystack response.
   *
   * @returns {Promise<Object>} Updated transaction.
   */
  private async markTransactionSuccessful(
    reference: string,
    providerData: IPaystackWebhookEvent["data"],
  ) {
    // find transaction and check status
    const findResult =
      await this.transactionRepository.getTransactionByReference(reference);

    if (findResult.error) {
      throw new Error(`Transaction not found for reference: ${reference}`);
    }

    const transaction = findResult.data as ITransactionDoc;

    // compare amount and currency to avoid fraud
    if (
      transaction.amount !== providerData.amount ||
      transaction.currency !== providerData.currency
    ) {
      throw new Error(
        `Transaction amount or currency mismatch for reference: ${reference}`,
      );
    }

    if (transaction.status === TransactionStatus.SUCCESS) {
      // call enrollment to activate
      await this.enrollActivation.activateEnrollment(
        String(transaction.enrollmentId),
      );

      return;
    }

    // update transaction
    const updateTrans = {
      status: TransactionStatus.SUCCESS,

      metadata: {
        ...transaction.metadata,
        ...providerData.metadata,
      },

      // money
      unitAmount: providerData.amount / 100,
      fee: providerData.fees,
      unitFee: providerData.fees ? providerData.fees / 100 : 0,

      channel: providerData.channel,
      reason: "",
      message: providerData.gateway_response,

      // provider
      providerRef: providerData.id,
      providerData: providerData,

      policed: false,

      webhookProcessed: true,
    };

    const updateTransactResult = await this.transactionRepository.update(
      String(transaction._id),
      updateTrans,
    );

    if (updateTransactResult.error) {
      throw new Error(updateTransactResult.message);
    }
    // Activate the pending enrollment
    const activationResult = await this.enrollActivation.activateEnrollment(
      String(transaction.enrollmentId),
    );

    if (activationResult.error) {
      throw new Error(activationResult.message);
    }

    const courseResult = await this.courseRepo.getCourseById(
      String(transaction.courseId),
    );
    const course = courseResult.data as ICourse;

    const userResult = await this.userRepository.findById(
      String(transaction.userId),
    );

    const user = userResult.data as IUserDoc;
    const emailResult =
      await this.emailService.sendCourseEnrollmentConfirmedEmail(
        user,
        course,
        providerData.amount,
        providerData.currency,
      );

    if (emailResult.error) {
      throw new Error(emailResult.message);
    }

    return;
  }

  /**
   *@name markTransactionFailed
   *@description Mark a transaction as failed. Must be safe to call multiple times.
   * @param {string} reference - Paystack reference.
   * @param {string} reason - Failure reason.
   *
   * @returns {Promise<Object>} Failed transaction.
   */
  async markTransactionFailed(reference: string, reason: string) {
    // find transaction and check status
    const findResult =
      await this.transactionRepository.getTransactionByReference(reference);

    if (findResult.error) {
      throw new Error(`Transaction not found for reference: ${reference}`);
    }

    const transaction = findResult.data as ITransactionDoc;
  }

  private async handleScholarshipPayment(
    providerData: IPaystackWebhookEvent["data"],
  ): Promise<boolean> {
    const email = providerData.customer?.email;

    if (!email) {
      return false;
    }

    const userResult = await this.userRepository.findByEmail(
      email.toLowerCase(),
    );

    if (userResult.error || !userResult.data) {
      return false;
    }

    const user = userResult.data as IUserDoc;

    const transactionResult =
      await this.transactionRepository.getPendingScholarshipTransaction(
        String(user._id),
        providerData.amount,
        providerData.currency,
      );

    if (transactionResult.error || !transactionResult.data) {
      return false;
    }

    const transaction = transactionResult.data as ITransactionDoc;

    // Idempotency
    if (transaction.status === TransactionStatus.SUCCESS) {
      return true;
    }

    // Confirm the transaction actually belongs to a scholarship flow.
    if (transaction.metadata?.paymentSource !== "shop_url") {
      return false;
    }

    // Mark transaction successful
    await this.transactionRepository.update(String(transaction._id), {
      status: TransactionStatus.SUCCESS,

      metadata: {
        ...transaction.metadata,
        paystackReference: providerData.reference,
      },

      unitAmount: providerData.amount / 100,
      fee: providerData.fees,
      unitFee: providerData.fees ? providerData.fees / 100 : 0,

      channel: providerData.channel,
      reason: "",
      message: providerData.gateway_response,

      providerRef: providerData.id,
      providerData,

      policed: false,
      webhookProcessed: true,
    });

    // Activate the pending enrollment
    const activationResult = await this.enrollActivation.activateEnrollment(
      String(transaction.enrollmentId),
    );

    if (activationResult.error) {
      throw new Error(activationResult.message);
    }
    // Scholarship will be marked PAID here in the next step.

    const scholarshipId = transaction.metadata?.scholarshipId;

    if (!scholarshipId) {
      throw new Error(
        `Scholarship transaction ${transaction._id} is missing scholarshipId`,
      );
    }

    const scholarshipResult = await this.scholarshipRepo.getScholarshipById(
      String(scholarshipId),
    );

    if (scholarshipResult.error || !scholarshipResult.data) {
      throw new Error(`Scholarship not found: ${scholarshipId}`);
    }

    const scholarship = scholarshipResult.data;

    if (scholarship.status === ScholarshipStatus.PAID) {
      return true;
    }

    if (scholarship.status !== ScholarshipStatus.APPROVED) {
      throw new Error(
        `Scholarship cannot be marked as paid from status: ${scholarship.status}`,
      );
    }

    await scholarshipRepository.updateScholarship(String(scholarship._id), {
      status: ScholarshipStatus.PAID,
    });

    const courseResult = await this.courseRepo.getCourseById(
      String(transaction.courseId),
    );
    const course = courseResult.data as ICourse;

    const emailResult =
      await this.emailService.sendCourseEnrollmentConfirmedEmail(
        user,
        course,
        providerData.amount,
        providerData.currency,
      );

    if (emailResult.error) {
      throw new Error(emailResult.message);
    }

    return true;
  }
}

export default new TransactionService();

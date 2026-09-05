import Transaction from "./transaction.model";
import { ITransactionDoc, TransactionStatus } from "./transaction.interface";
import { IResult } from "../../../utils/interfaces.util";
import RepositoryService from "@/modules/internals/repository.service";

class TransactionRepository extends RepositoryService<ITransactionDoc> {
  constructor() {
    super(Transaction, "Transaction");
  }
  async createTransaction(data: Partial<ITransactionDoc>): Promise<IResult> {
    return this.create({
      ...data,
      status: TransactionStatus.PENDING,
    });
  }

  async getTransactionByReference(reference: string): Promise<IResult> {
    return this.findOne({ reference });
  }

  async getTransactionByEnrollmentId(enrollmentId: string): Promise<IResult> {
    return this.findOne({ enrollmentId });
  }

  async getPendingTransactionByEnrollmentId(
    enrollmentId: string,
  ): Promise<IResult> {
    return this.findOne({
      enrollmentId,
      status: TransactionStatus.PENDING,
    });
  }

  async markPendingAsSuccessful(
    transactionId: string,
    data: Partial<ITransactionDoc>,
  ): Promise<IResult> {
    return this.update(transactionId, data);
  }

  async markPendingAsFailed(
    transactionId: string,
    data: Partial<ITransactionDoc>,
  ): Promise<IResult> {
    return this.update(transactionId, data);
  }
}

export default new TransactionRepository();

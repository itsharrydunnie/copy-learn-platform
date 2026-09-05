import { Job } from 'bull';
import { IEmailJob, IResult } from '../../utils/interfaces.util';
import emailService from '../../modules/internals/email.service';
import logger from '../../utils/logger.util';

/**
 * @name emailProcessor
 * @description The core function that the Bull worker executes for each 'emails:send' job.
 * It uses the AppEmailService to dispatch the email.
 * Uses pure async/await pattern (no done callback) to avoid promisify deprecation warning.
 * @param job The Bull job object containing the email data
 */
const emailProcessor = async (job: Job<IEmailJob>) => {
    const email = job.data.user?.email;
    const template = job.data.template;

    logger.log({
        data: `Processing Email Job ID: ${job.id}, Recipient: ${email}, Template: ${template}`,
        label: 'email-processor',
        type: 'info',
    });

    try {
        // The data passed to the worker is the IEmailJob structure,
        // which matches the SendEmailDTO structure required by AppEmailService.sendEmail.
        const result: IResult = await emailService.sendEmail(job.data);

        if (result.error) {
            // Log error and throw to signal Bull to retry the job
            // (if attempts are configured in the original addJob call).
            logger.log({
                data: `Failed to process Email Job ID: ${job.id}. Error: ${result.message}`,
                label: 'email-processor',
                type: 'error',
            });

            throw new Error(result.message);
        }

        logger.log({
            data: `Successfully processed Email Job ID: ${job.id} for ${email}`,
            label: 'email-processor',
            type: 'success',
        });

        // Success: Return result (Bull will mark job as completed)
        return result;
    } catch (error) {
        // Catch any critical errors during processing (e.g., connection issue)
        logger.log({
            data: `Critical error during processing of Job ID: ${job.id}. Error: ${error instanceof Error ? error.message : String(error)}`,
            label: 'email-processor-critical',
            type: 'error',
        });

        // Re-throw error to signal Bull that the job failed
        throw error;
    }
};

export default emailProcessor;

import { Job, DoneCallback } from "bull";
import logger from "../../utils/logger.util";
import userRepository from "../../modules/users/user/user.repository";
import emailService from "../../modules/internals/email.service";
import { EmailTemplate, EmailService } from "../../utils/enums.util";
import { SendEmailDTO } from "../../dtos/email.dto";
import { IUserDoc } from "../../modules/users/user/user.interface";

/**
 * Process marketing job for hackathons this week
 * This is the worker function that processes marketing jobs from the queue
 * Follows the Bull pattern with Job and DoneCallback
 */
/**
const processMarketingJob = async (
    job: Job,
    done: DoneCallback,
): Promise<void> => {
    const { type, message } = job.data;

    logger.log({
        data: `Processing marketing job: ${type} - ${message}`,
        label: 'marketing-job',
        type: 'info',
    });

    try {
        if (type === 'hackathons-this-week') {
            // Get the current date and calculate the week range
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setUTCDate(now.getUTCDate() - now.getUTCDay() + 1); // Monday
            startOfWeek.setUTCHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6); // Sunday
            endOfWeek.setUTCHours(23, 59, 59, 999);

            // Query hackathons happening this week
            // Filter by published status and start date within this week
            const hackathonsResult = await hackathonService.getHackathons(
                {
                    status: HackStatusType.PUBLISHED,
                    'settings.startDate': {
                        $gte: startOfWeek.toISOString().split('T')[0],
                        $lte: endOfWeek.toISOString().split('T')[0],
                    },
                },
                {
                    limit: 10, // Limit to top 10 hackathons
                    sort: '-createdAt',
                },
            );

            const hackathons = hackathonsResult.data || [];

            if (hackathons.length === 0) {
                logger.log({
                    data: 'No hackathons found for this week, skipping email send',
                    label: 'marketing-job',
                    type: 'info',
                });
                return done(null, {
                    success: true,
                    type,
                    message,
                    hackathonsCount: 0,
                });
            }

            // Get all users (talents) to send the email to
            // You may want to filter by userType or other criteria
            const usersResult = await userRepository.getUsers(
                {
                    // Add any filters for talents here, e.g., userType: 'talent'
                },
                {
                    limit: 1000, // Adjust based on your needs
                    sort: '-createdAt',
                },
            );

            const users = Array.isArray(usersResult.data)
                ? usersResult.data
                : usersResult.data
                  ? [usersResult.data]
                  : [];

            if (users.length === 0) {
                logger.log({
                    data: 'No users found to send marketing email to',
                    label: 'marketing-job',
                    type: 'info',
                });
                return done(null, {
                    success: true,
                    type,
                    message,
                    usersCount: 0,
                });
            }

            // Prepare email metadata
            const hackathonLink =
                process.env.FRONTEND_URL || 'https://pacepard.com';
            const allHackathonsLink = `${hackathonLink}/hackathons`;

            // Send email to each user
            let successCount = 0;
            let errorCount = 0;

            for (const user of users) {
                try {
                    // Skip users without email
                    if (!user.email) {
                        continue;
                    }

                    const emailData: SendEmailDTO = {
                        user: user as IUserDoc,
                        driver: EmailService.ZEPTOMAIL,
                        template: EmailTemplate.HACKATHONS_THIS_WEEK,
                        options: {
                            subject:
                                "Hackathons Happening This Week - Don't Miss Out!",
                        },
                        metadata: {
                            hackathons: hackathons.map((h: any) => ({
                                id: h._id || h.id,
                                code: h.code,
                                slug: h.slug,
                                name: h.name,
                                description: h.description,
                                type: h.type,
                                settings: h.settings,
                            })),
                            hackathonLink: `${hackathonLink}/hackathons`,
                            allHackathonsLink: allHackathonsLink,
                        },
                    };

                    // Queue the email (this will be processed by the email worker)
                    await emailService.sendEmail(emailData);
                    successCount++;
                } catch (error) {
                    errorCount++;
                    logger.log({
                        data: `Failed to send marketing email to user ${user.email}: ${
                            error instanceof Error
                                ? error.message
                                : String(error)
                        }`,
                        label: 'marketing-job',
                        type: 'error',
                    });
                }
            }

            logger.log({
                data: `Marketing job ${job.id} completed: ${successCount} emails sent, ${errorCount} errors`,
                label: 'marketing-job',
                type: 'success',
            });

            // Success: Call done(null, result) to mark the job as completed successfully
            done(null, {
                success: true,
                type,
                message,
                hackathonsCount: hackathons.length,
                usersCount: users.length,
                emailsSent: successCount,
                errors: errorCount,
            });
        } else {
            logger.log({
                data: `Unknown marketing job type: ${type}`,
                label: 'marketing-job',
                type: 'error',
            });
            done(new Error(`Unknown marketing job type: ${type}`));
        }
    } catch (error) {
        logger.log({
            data: `Marketing job ${job.id} failed: ${
                error instanceof Error ? error.message : String(error)
            }`,
            label: 'marketing-job',
            type: 'error',
        });

        // Signal Bull that the job failed
        done(error as Error);
    }
};

export default processMarketingJob;
 */

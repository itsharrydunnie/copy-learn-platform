import { EmailConfig } from '../utils/interfaces.util';
import { EmailService, ENVType } from '../utils/enums.util';

export function getEmailConfig(): EmailConfig {
    const env = process.env.NODE_ENV;

    const zeptoConfig = {
        zeptoMailUrl: process.env.ZEPTO_HOST_URL as string,
        zeptoApiKey: process.env.ZEPTO_API_KEY as string,
    };

    if (env === ENVType.PRODUCTION) {
        return {
            service: EmailService.ZEPTOMAIL,
            fromEmail: process.env.EMAIL_FROM_EMAIL as string,
            fromName: process.env.EMAIL_FROM_NAME as string,
            replyTo: process.env.EMAIL_REPLY_TO as string,
            sendingDomain: process.env.EMAIL_DOMAIN as string,
            apiKey: process.env.ZEPTO_API_KEY as string,
            clientUrl: process.env.CLIENT_APP_URL as string,
            templateId: process.env.ZEPTO_TEMPLATE_ID as string,
            isTestMode: false,
        };
    }

    if (env === ENVType.STAGING) {
        return {
            service: EmailService.ZEPTOMAIL,
            fromEmail: process.env.EMAIL_FROM_EMAIL as string,
            fromName: process.env.EMAIL_FROM_NAME as string,
            replyTo: process.env.EMAIL_REPLY_TO as string,
            sendingDomain: process.env.EMAIL_DOMAIN as string,
            apiKey: process.env.ZEPTO_API_KEY as string,
            clientUrl: process.env.CLIENT_APP_URL as string,
            templateId: process.env.ZEPTO_TEMPLATE_ID as string,
            isTestMode: false,
        };
    }

    if (env === ENVType.DEVELOPMENT) {
        return {
            service: EmailService.ZEPTOMAIL,
            fromEmail: process.env.EMAIL_FROM_EMAIL as string,
            fromName: process.env.EMAIL_FROM_NAME as string,
            replyTo: process.env.EMAIL_REPLY_TO as string,
            sendingDomain: process.env.EMAIL_DOMAIN as string,
            apiKey: process.env.ZEPTO_API_KEY as string,
            clientUrl: process.env.CLIENT_APP_URL as string,
            templateId: process.env.ZEPTO_TEMPLATE_ID as string,
            isTestMode: true,
        };
    }

    throw new Error('Invalid NODE_ENV. Email config not set.');
}

export const EMAIL_CONFIG = getEmailConfig();

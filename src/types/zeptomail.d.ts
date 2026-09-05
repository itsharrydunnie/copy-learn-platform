declare module 'zeptomail' {
    export interface SendMailOptions {
        from: {
            address: string;
            name: string;
        };
        to: Array<{
            email_address: {
                address: string;
                name: string;
            };
        }>;
        subject: string;
        htmlbody: string;
    }

    export class SendMailClient {
        constructor(config: { url: string; token: string });

        sendMail(options: SendMailOptions): Promise<any>;
    }
}

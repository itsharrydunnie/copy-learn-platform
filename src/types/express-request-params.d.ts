import 'express';

declare module 'express' {
    interface Request {
        /** Narrowed for app handlers (Express 5 types allow string | string[] per param). */
        params: Record<string, string>;
    }
}

export {};

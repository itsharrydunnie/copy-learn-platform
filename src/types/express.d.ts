import type { IUserDoc } from "../modules/users/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
      user?: IUserDoc;
    }
  }
}

export {};

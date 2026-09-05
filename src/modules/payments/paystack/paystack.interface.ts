export interface initializePaymentDTO {
  email: string;
  amount: string; // kobo
  reference?: string;
  metadata?: Record<string, any>;
  callback_url?: string;
}

export interface PaystackResponse {
  /**
   *
   * @type {boolean}
   * @memberof Response
   */
  status?: boolean;
  /**
   *
   * @type {string}
   * @memberof Response
   */
  message?: string;
  /**
   *
   * @type {object}
   * @memberof Response
   */
  data?: IPaystackInitializeResponse | null;
}

export interface verifyWebhookDTO {
  signature: string;
  paystackSecret: string;
  payload: string | Buffer;
}

export interface IPaystackInitializeData {
  email: string;
  amount: number; // minor units
  currency: string;
  reference: string;
  metadata?: Record<string, unknown>;
  callback_url?: string;
}

export interface IPaystackInitializeResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface IPaystackVerifyResponse {
  status: boolean;
  message: string;
  data: any;
}

export interface IPaystackWebhookData {
  id: number;

  status: string;
  reference: string;
  amount: number;
  requested_amount: number;
  currency: string;

  fees: number | null;

  channel: string;

  message: string | null;
  gateway_response: string;

  metadata: Record<string, unknown> | null;
}

export interface IPaystackWebhookEvent {
  event: string;
  data: IPaystackWebhookData;
  reason?: string;
}

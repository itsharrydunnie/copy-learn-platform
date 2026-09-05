import { Model, Document, Types } from 'mongoose';
import {
    EmailType,
    EmailService,
    OAuthProvider,
    FileType,
    FileFormat,
    FileMimeType,
} from './enums.util';
import { FileInfo } from 'busboy';
import { PassThrough } from 'stream';
import { IUserDoc, OtpType } from '../modules/users/user/user.interface';

export type Nullable<T> = T | null;

// Use Mongoose's Types.ObjectId for interface compatibility
export type ObjectId = Types.ObjectId;

export interface IRoleDoc extends Document {
    name: string;
    description: string;
    slug: string;

    // relationships
    permissions: Array<string>;
    users: Array<ObjectId | any>;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IPermissionDoc extends Document {
    action: string;
    description?: string;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IOptions {
    host: string;
    port: number | string;
    password: string;
    user: string;
    family?: number;
}

export interface IData {
    key: string;
    value: any;
}

export interface IResult<T = any> {
    error: boolean;
    errors?: Array<T>;
    report?: IAPIReport;
    pagination?: IPagination;
    message: string;
    code: number;
    data: T;
    token?: string;
    status?: number;
    filters?: any;
}

export interface IPagination {
    total: number;
    count: number;
    pagination: {
        next: { page: number; limit: number };
        prev: { page: number; limit: number };
    };
    data: Array<any>;
}

export interface IAPIReport {
    format: string;
    csv?: string;
    xml?: any;
    pdf?: any;
}

export interface IBulkUser {
    _id: ObjectId | null | string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phoneCode: string;
    userType: string;
}

export interface ILogin {
    email: string;
    password: string;
    code: string;
}

export interface ISearchQuery {
    model: Model<any>;
    ref: Nullable<string> | undefined;
    value: Nullable<any> | undefined;
    data: any;
    query: any;
    queryParam: any;
    populate: Array<any>;
    operator: Nullable<string>;
    fields?: Array<string>;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _id: ObjectId;
    id: ObjectId;
}

export interface IOptions {
    host: string;
    port: number | string;
    password: string;
    user: string;
    family?: number;
}

export interface IData {
    key: string;
    value: any;
}

export interface IBulkUser {
    _id: ObjectId | null | string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phoneCode: string;
    userType: string;
}

export interface ILogin {
    email: string;
    password: string;
    code: string;
}

export interface IAPIKeyUsage {
    keyHash: string;
    timestamp: Date;
    endpoint: string;
    ipAddress: string;
    userAgent: string;
    responseCode: number;
}

export interface IEmailRequest {
    recipient: string;
    subject: string;
    content: any;
    type: EmailType;
    template?: string;
    attachments?: any[];
}

export interface IEmailPreferences {
    marketing: boolean;
    productUpdates: boolean;
    featureAnnouncements: boolean;
    subscriptionStatus: string;
}

// export interface ISensitiveData {
//     card?: IDebitCard;
//     providerRef: string;
//     providerData: Array<Record<string, any>>;
// }

export interface ICustomResponse<T> extends Response {
    customResults?: {
        success: boolean;
        count: number;
        total: number;
        pagination: {
            next?: { page: number; limit: number };
            prev?: { page: number; limit: number };
        };
        data: T[];
    };
    status: any;
}

export interface ICursorResponse<T> extends Response {
    customResults: {
        success: boolean;
        count: number;
        nextCursor: string | null;
        data: T[];
    };
}

export interface IQueryOptions {
    limit?: number;
    skip?: number;
    sort?: string;
    populate?: string;
    recentOnly?: boolean;
}

export interface AWSConfig {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
}

export interface EmailConfig {
    fromEmail: string;
    fromName: string;
    replyTo?: string;
    service: EmailService;
    apiKey?: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;
    templateId?: string;
    isTestMode?: boolean;
    sendingDomain?: string;
    clientUrl?: string;
}

export interface PaymentConfig {
    provider: string;
    secretKey: string;
    publicKey: string;
    webhookSecret?: string;
    isTestMode: boolean;
}

export interface FrontendURLConfig {
    baseUrl: string;
    apiUrl?: string;
    paymentRedirectUrl?: string;
    dashboardUrl?: string;
}

export interface OAuthConfig {
    provider: OAuthProvider;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

export interface OAuthProvidersConfig {
    google: OAuthConfig;
    github: OAuthConfig;
}

export interface IRedisOptions {
    family?: number;
    host: string;
    port: number;
    user: string;
    password: string;
    db: number;
    managed: boolean;
    tls: {
        rejectUnauthorized?: boolean;
        [key: string]: string | boolean | undefined;
    };
}

export interface IEmailJob {
    user: IUserDoc;
    subject: string;
    payload: Record<string, any>;
    driver: EmailService;
    template?: string;
    code?: string;
    metadata?: any;
    options?: {
        subject?: string;
        salute?: string;
        buttonUrl?: string;
        buttonText?: string;
        emailBody?: string;
        emailBodies?: Array<string>;
        bodyOne?: string;
        bodyTwo?: string;
        bodyThree?: string;
        otpType?: OtpType;
        status?: string;
    };
}

export interface IFile {
    stream?: PassThrough;
    metadataStream?: PassThrough;
    info?: FileInfo;
    mimeType?: string;
    fileName?: string;
    fieldname?: string;
    size?: number;
    fileType?: FileType;
    uploadId?: string;
    uploadedBy?: string;
}

export interface IFIleUpload {
    file: IFile;
    format: FileFormat;
    type: FileMimeType;
    name?: string;
    base64?: string;
}

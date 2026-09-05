export enum ENVType {
  PRODUCTION = "production",
  STAGING = "staging",
  DEVELOPMENT = "development",
}

export enum AppChannel {
  WEB = "web",
  MOBILE = "mobile",
  DESKTOP = "desktop",
  TABLET = "tablet",
  WATCH = "watch",
}

export enum DbModels {
  ADMIN = "admin",
  APIKEY = "apikey",

  INVITES = "invites",

  NOTIFICATION = "notification",
  PERMISSION = "permission",

  REFERRAL = "referral",

  RESOURCE = "resource",
  ROLE = "role",
  SHAREABLE_LINK = "shareablelink",

  SUBSCRIPTION = "subscription",
  TALENT = "talent",

  TRANSACTION = "transaction",
  USER = "user",

  PLAN = "plan",
  SUBSCRIPTION_INTENT = "subscription-intent",

  PROGRAM = "program",
  EVENT = "event",

  COURSE = "course",
  MODULE = "module",

  ENROLLMENT = "enrollment",
}

export enum FileType {
  AUDIO = "audio",
  DOCUMENT = "document",
  IMAGE = "image",
  VIDEO = "video",
}
export enum S3Folder {
  IMAGES = "images",
  AUDIO = "audio",
  VIDEOS = "videos",
  DOCUMENTS = "documents",
  OTHERS = "others",
}

// Enum for upload format
export enum FileFormat {
  BASE64 = "base64",
  RAWFILE = "rawfile",
}

// Enum for supported mime types
export enum FileMimeType {
  JPEG = "image/jpeg",
  PNG = "image/png",
  WEBP = "image/webp",
  SVG = "image/svg+xml",
  PDF = "application/pdf",
  MPEG = "audio/mpeg",
  MP3 = "audio/mp3",
  WAV = "audio/wav",
  AAC = "audio/aac",
  OGG = "audio/ogg",
  M4A = "audio/x-m4a",
  MP4 = "video/mp4",
  WEBM = "video/webm",
}

export enum EmailService {
  SENDGRID = "sendgrid",
  AWS_SES = "ses",
  MAILTRAP = "mailtrap",
  MAILGUN = "mailgun",
  MAILSEND = "mailsend",
  SMTP = "smtp",
  ZEPTOMAIL = "zeptomail",
}
export enum EmailTemplate {
  WELCOME = "welcome",
  WELCOME_LISTENER = "welcome-listener",
  WELCOME_PREACHER = "welcome-preacher",
  USER_INVITE = "user-invite",
  PASSWORD_RESET = "password-reset",
  PASSWORD_CHANGED = "password-changed",
  EMAIL_VERIFICATION = "email-verification",
  INVITE = "invite",
  OTP = "otp",
  VERIFY_EMAIL = "verify-email",
  GENERIC = "generic",
  SUBSCRIPTION_CONFIRMED = "subscription-confirmed",
  SUBSCRIPTION_CANCELLED = "subscription-cancelled",
  SUBSCRIPTION_EXPIRED = "subscription-expired",
  SUBSCRIPTION_UPGRADED = "subscription-upgraded",
  SUBSCRIPTION_DOWNGRADED = "subscription-downgraded",
  SUBSCRIPTION_RENEWED = "subscription-renewed",
  TRIAL_STARTED = "trial-started",
  RECOMMENDATION = "recommendation",
  HACKATHONS_THIS_WEEK = "hackathons-this-week",
}
export enum EmailStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  OPENED = "opened",
  CLICKED = "clicked",
  BOUNCED = "bounced",
  SPAM = "spam",
  UNSUBSCRIBED = "unsubscribed",
  FAILED = "failed",
  PENDING = "pending",
  ERROR = "error",
  DELAYED = "delayed",
  QUEUED = "queued",
  REJECTED = "rejected",
  BLOCKED = "blocked",
  INVALID = "invalid",
  BLACKLISTED = "blacklisted",
  COMPLAINED = "complained",
  DEFERRED = "deferred",
  UNDELIVERED = "undelivered",
  TEMPORARY_FAILURE = "temporary-failure",
  PERMANENT_FAILURE = "permanent-failure",
  TIMEOUT = "timeout",
  RETRY = "retry",
  UNKNOWN = "unknown",
  SUCCESS = "success",
  FAILURE = "failure",
}

export enum APIKeyEnvironment {
  LIVE = "live",
  TEST = "test",
}

export enum APIKeyStatus {
  ACTIVE = "active",
  REVOKED = "revoked",
  EXPIRED = "expired",
  SUSPENDED = "suspended",
}

export enum APIKeyType {
  FULL = "full",
  READ = "read",
  WRITE = "write",
}

export enum EmailType {
  TRANSACTIONAL = "transactional",
  MARKETING = "marketing",
  PRODUCT_UPDATE = "product_update",
  FEATURE_ANNOUNCEMENT = "feature_announcement",
}

export enum EmailPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum OAuthProvider {
  GOOGLE = "google",
  GITHUB = "github",
}

export enum UploadStatus {
  PENDING = "pending",
  UPLOADING = "uploading",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  EXPIRED = "expired",
}

export enum ChunkStatus {
  PENDING = "pending",
  UPLOADED = "uploaded",
  FAILED = "failed",
}

export enum ProcessingState {
  QUEUED = "queued",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum ContentType {
  SERMON = "sermon",
  BITE = "bite",
}

export enum ContentState {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
  BROKEN = "broken",
}

export enum ContentStatus {
  PUBLISHED = "published",
  DRAFT = "draft",
  FLAGGED = "flagged",
  DELETED = "deleted",
  ARCHIVED = "archived",
}

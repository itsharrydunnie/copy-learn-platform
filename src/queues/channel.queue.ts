export enum QueueChannel {
    Emails = 'emails',
    UnlockUsers = 'users',
    Reminders = 'reminders',
    Cleanup = 'cleanup',
    Marketing = 'marketing',
    Invitations = 'invitations',
}

export enum JobChannel {
    SendEmail = 'emails:send',
    SendOTPEmail = 'emails:send-otp-email',
    SendPasswordResetEmail = 'emails:send-password-reset-email',
    UnlockUsers = 'user:unlock',
    SendDailyReminder = 'send-daily-reminder',
    SendWeeklyReminder = 'send-weekly-reminder',
    CleanupTempFiles = 'cleanup-temp-files',
    DeepCleanup = 'deep-cleanup',
    SendHackathonsThisWeek = 'send-hackathons-this-week',
    MarkExpiredInvitations = 'mark-expired-invitations',
}

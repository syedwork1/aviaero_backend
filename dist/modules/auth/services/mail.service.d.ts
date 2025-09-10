export declare class MailService {
    private transporter;
    constructor();
    sendPasswordResetEmail(to: string, resetUrl: string): Promise<{
        success: boolean;
        messageId: any;
    }>;
}

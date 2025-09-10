import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port:465,
      // secure: parseInt(process.env.SMTP_PORT, 10) === 465, // true only for 465
      secure:true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // tls: {
      //   rejectUnauthorized: false,
      // },
      // logger: true, // log SMTP convo
      // debug: true,  // extra debug info
      // connectionTimeout: 10_000, // 10 seconds
      // greetingTimeout: 10_000,
      // socketTimeout: 15_000,
    });

    // Immediate connection check
    this.transporter.verify((err, success) => {
      if (err) {
        console.error(' SMTP connection failed:', err.message);
      } else {
        console.log('SMTP server is ready to take messages');
      }
    });
  }

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    try {
      console.log(" Preparing email to:", to);

      const mailOptions = {
        from: `<${process.env.SMTP_USER}>`,
        to,
        subject: 'Password Reset Request',
        html: `
          <p>Hello,</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>If you didn’t request this, you can ignore this email.</p>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);

      return { success: true, messageId: info.messageId };
    } catch (error: any) {
     
      console.error("   Message:", error.message);

      throw new InternalServerErrorException(
        "Failed to send email: " + error.message,
      );
    }
  }
}

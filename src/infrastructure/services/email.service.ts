import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import config from "../config/env.index.js";
import IEmailService from "../../domains/user/Interfaces/iemail.service.js";

class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const transportOptions: SMTPTransport.Options = {
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
      ignoreTLS: true,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    };

    if (config.NODE_ENV === "development") {
      transportOptions.debug = true;
      transportOptions.logger = true;
    }
    this.transporter = nodemailer.createTransport(transportOptions);
  }

  async verify(): Promise<void> {
    await this.transporter.verify();
  }

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: "noreply@baloot.local",
      to,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Thank you for registering. Please use the following code to verify your email address:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; border-radius: 8px;">
            ${code}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 24 hours.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
  }

  async sendPasswordChangeNotification(to: string): Promise<void> {
    await this.transporter.sendMail({
      from: "noreply@baloot.local",
      to,
      subject: "Your Password Has Been Changed",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #d9534f;">⚠️ Security Alert</h2>
        <p>Your password has been successfully changed.</p>
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #d9534f; margin: 20px 0;">
          <p style="margin: 0; font-size: 16px;">
            <strong>If you did not perform this action, please contact our support team immediately.</strong>
          </p>
        </div>
        <p style="color: #666; font-size: 14px;">This is an automated notification. No further action is required if you initiated this change.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
    });
  }
}

export default EmailService;

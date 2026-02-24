import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface SendSuccessEmailPayload {
  customerEmail: string;
  customerName: string;
  orderId: string;
  amount: number; // THB
  paymentMethod: string;
  paidAt: Date;
}


@Injectable()
export class EmailService {
  constructor() { }
  private transporter = nodemailer.createTransport({
    service: 'gmail', // ให้ nodemailer auto-set host/port ให้
    auth: {
      user: process.env.MAIL_USER, // yourshop@gmail.com
      pass: process.env.MAIL_PASS, // Gmail App Password
    },
  });

    async sendSuccessEmail(payload: SendSuccessEmailPayload) {
      console.log('payload:', payload);
    const { customerEmail, customerName, orderId, amount, paymentMethod, paidAt } = payload;

    await this.transporter.sendMail({
      from: `"Aivana Commerce" <${process.env.MAIL_USER}>`,
      to: customerEmail,
      subject: `Payment Successful – Order #${orderId} 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>🎉 Payment Successful</h2>
          <p>Hi ${customerName},</p>

          <p>Your payment has been completed successfully. Thank you for your purchase 💖</p>

          <hr />

          <h3>🧾 Order Details</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Amount Paid:</strong> ${amount.toFixed(2)} THB</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>Paid At:</strong> ${paidAt.toLocaleString()}</p>

          <hr />

          <p>We are now preparing your order and will notify you once it is shipped.</p>

          <br />
          <p>Best regards,<br/>Aivana Commerce Team</p>
        </div>
      `,
    });
  }
}

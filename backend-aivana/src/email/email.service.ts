import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateEmailSuccessDto } from './dto/create-email.dto';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendSuccessEmail(payload: CreateEmailSuccessDto) {
    const { customerEmail, customerName, orderId, items, amount, paymentMethod, paidAt } = payload;

    const itemRows = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0;">${item.product.name}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; text-align: right;">
            ฿${item.price}
          </td>
        </tr>
      `,
      )
      .join('');

    const paidAtFormatted = paidAt.toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      dateStyle: 'long',
      timeStyle: 'short',
    });

    await this.transporter.sendMail({
      from: `"Aivana Commerce" <${process.env.MAIL_USER}>`,
      to: customerEmail,
      subject: `ชำระเงินสำเร็จ #${orderId} – Aivana Commerce`,
      html: `
        <!DOCTYPE html>
        <html lang="th">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 32px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; letter-spacing: 1px;">Aivana Commerce</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding: 36px 40px;">
                      <p style="margin: 0 0 8px; font-size: 18px; color: #1a1a1a; font-weight: 600;">สวัสดีคุณ ${customerName} 👋</p>
                      <p style="margin: 0 0 28px; font-size: 15px; color: #555555; line-height: 1.7;">
                        การชำระเงินของคุณสำเร็จเรียบร้อยแล้ว ขอบคุณที่ไว้วางใจ Aivana Commerce นะคะ 💜
                      </p>

                      <!-- Items Table -->
                      <p style="margin: 0 0 12px; font-size: 15px; font-weight: 600; color: #1a1a1a;">🛍️ รายการสินค้า</p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eeeeee; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                        <thead>
                          <tr style="background-color: #f0eeff;">
                            <th style="padding: 10px 12px; text-align: left; font-size: 13px; color: #555; font-weight: 600;">สินค้า</th>
                            <th style="padding: 10px 12px; text-align: right; font-size: 13px; color: #555; font-weight: 600;">ราคา</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemRows}
                        </tbody>
                      </table>

                      <!-- Summary -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #555;">วิธีชำระเงิน</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; text-align: right; font-weight: 500;">${paymentMethod}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #555;">วันและเวลาที่ชำระ</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; text-align: right;">${paidAtFormatted}</td>
                        </tr>
                        <tr>
                          <td colspan="2" style="border-top: 2px solid #eeeeee; padding-top: 12px;"></td>
                        </tr>
                        <tr>
                          <td style="font-size: 16px; font-weight: 700; color: #1a1a1a;">ยอดรวมทั้งหมด</td>
                          <td style="font-size: 20px; font-weight: 700; color: #764ba2; text-align: right;">฿${amount.toFixed(2)}</td>
                        </tr>
                      </table>

                      <!-- CTA Button -->
                      <div style="text-align: center; margin-bottom: 12px;">
                        <a href="${process.env.NEXT_PUBLIC_FRONTEND_URL}/collections" 
                           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 36px; border-radius: 50px; letter-spacing: 0.5px;">
                          ดูสินค้าของฉัน
                        </a>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #fafafa; border-top: 1px solid #eeeeee; padding: 24px 40px; text-align: center;">
                      <p style="margin: 0 0 4px; font-size: 13px; color: #999;">หากมีคำถามหรือปัญหาใด ๆ สามารถติดต่อเราได้ที่</p>
                      <a href="mailto:${process.env.MAIL_USER}" style="font-size: 13px; color: #764ba2; text-decoration: none;">${process.env.MAIL_USER}</a>
                      <p style="margin: 16px 0 0; font-size: 12px; color: #bbbbbb;">© ${new Date().getFullYear()} Aivana Commerce · ขอบคุณที่ช้อปกับเรา 💜</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
  }
}
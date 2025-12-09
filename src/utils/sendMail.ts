import * as path from "path";

import { ENV_CONFIG } from "@config/envConfig";
import logger from "@utils/logger";
import ejs from "ejs";
import nodemailer from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: ENV_CONFIG.MAIL_CONFIG.HOST,
  port: ENV_CONFIG.MAIL_CONFIG.PORT,
  secure: false,
  requireTLS: true,
  pool: true, // Enable connection pooling
  maxConnections: 5, // Limit simultaneous connections
  maxMessages: 100, // Max emails per connection
  auth: {
    user: ENV_CONFIG.MAIL_CONFIG.USER,
    pass: ENV_CONFIG.MAIL_CONFIG.PASSWORD,
  },
} as SMTPTransport.Options);

export const sendMail = async ({
  to,
  subject,
  templateName,
  replacement = {},
  cc,
  bcc,
  attachments,
}: {
  to: string[];
  subject: string;
  templateName: string;
  replacement?: object;
  cc?: string[];
  bcc?: string[];
  attachments?: Attachment[];
}) => {
  const mail_from = "PWA Support";
  const filePath = path.join(__dirname, "../templates", `${templateName}.ejs`);

  const result = await ejs.renderFile(filePath, replacement);
  const mailOptions = {
    from: {
      name: mail_from,
      address: ENV_CONFIG.MAIL_CONFIG.FROM_EMAIL || "",
    },
    to: to.join(),
    subject,
    cc: (cc || []).join(),
    bcc: (bcc || []).join(),
    html: result,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info("✉️ Mail Sent Successfully");
    return "Email Sent Successful";
  } catch (error) {
    logger.error("❌ Send mail error", error);
    return "Email Failed";
  }
};

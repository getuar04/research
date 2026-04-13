import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter = null;

if (env.mailHost && env.mailUser && env.mailPass && env.mailFrom) {
  transporter = nodemailer.createTransport({
    host: env.mailHost,
    port: env.mailPort,
    secure: false,
    auth: {
      user: env.mailUser,
      pass: env.mailPass,
    },
  });
}

export const sendMail = async ({ to, subject, text }) => {
  if (!transporter) {
    console.log("MAIL FALLBACK");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Text:", text);
    return;
  }

  await transporter.sendMail({
    from: env.mailFrom,
    to,
    subject,
    text,
  });
};
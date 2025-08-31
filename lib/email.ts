import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  await transporter.sendMail({
    to,
    subject,
    html: `
    <p>Verify your email address.</p>
    <p>${text}</p>
    
    <p>If you did not request this, please ignore this email.</p>
  `,
  });
}

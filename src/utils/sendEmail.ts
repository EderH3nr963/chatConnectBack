import  nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL_MAILER,
    pass: process.env.PASS_MAILER,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  return await transporter.sendMail({
    from: `"Chat Connect" <${process.env.EMAIL_MAILER}>`,
    to: to,
    subject: subject,
    html: html,
  });
};
import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // 465 = secure, 587 = TLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

/**
 * Надсилає email.
 * @param {object} options - опції для sendMail (to, subject, html, text, тощо)
 * @returns {Promise<object>} результат transporter.sendMail
 */
export const sendEmail = async (options) => {
  if (!SMTP_FROM) {
    throw new Error('SMTP_FROM env variable is required');
  }

  const mailOptions = {
    from: SMTP_FROM,
    ...options,
  };


  return transporter.sendMail(mailOptions);
};

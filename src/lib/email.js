import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: process.env.EMAIL_USER,   
    pass: process.env.EMAIL_PASS,   
  },
});

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

  try {
    await transporter.sendMail({
      from: `GuideMeLK <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

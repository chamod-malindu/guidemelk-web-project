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

  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">Welcome to GuideMeLK!</h1>
        <p style="color: #666; font-size: 16px;">Thank you for signing up. Please verify your email address.</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
        <p style="color: #333; margin-bottom: 25px;">Click the button below to verify your email address:</p>
        
        <a href="${verificationUrl}" 
           style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          Verify Email Address
        </a>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #888; font-size: 14px; line-height: 1.5;">
          <strong>Having trouble?</strong><br>
          If the button doesn't work, copy and paste this URL into your browser:<br>
          <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">${verificationUrl}</a>
        </p>
        
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          This verification link will expire in 24 hours. If you didn't create an account with GuideMeLK, please ignore this email.
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"GuideMeLK" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address - GuideMeLK',
      html: emailTemplate,
    });
    console.log(`Verification email sent to: ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}


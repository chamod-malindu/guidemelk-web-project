import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  port: 587,
  secure: false,
  requireTLS: true,
  tls: {
    ciphers: 'SSLv3'
  }
});

// Test the transporter connection
export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ Email transporter is ready');
    return true;
  } catch (error) {
    console.error('❌ Email transporter error:', error);
    return false;
  }
}

// Send verification email
export async function sendVerificationEmail(email, token) {
  console.log('📧 Attempting to send verification email to:', email);
  
  // Test connection first
  const isReady = await testEmailConnection();
  if (!isReady) {
    throw new Error('Email service is not configured correctly');
  }

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
  
  console.log('🔗 Verification URL:', verificationUrl);

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
    console.log('Sending email from:', process.env.EMAIL_USER, 'to:', email);

    console.log('📤 Sending email...');
    
    const info = await transporter.sendMail({
      from: `"GuideMeLK" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address - GuideMeLK',
      html: emailTemplate,
    });
    
    console.log('✅ Email sent successfully:', info.messageId);
    console.log('📧 Email info:', info);
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

// send OTP email
export async function sendOTPEmail(email, otp) {
  console.log('📧 Attempting to send OTP email to:', email);
  
  const isReady = await testEmailConnection();
  if (!isReady) {
    throw new Error('Email service is not configured correctly');
  }

  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">Password Reset Request</h1>
        <p style="color: #666; font-size: 16px;">You requested to reset your password for GuideMeLK</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
        <p style="color: #333; margin-bottom: 15px;">Your One-Time Password (OTP) is:</p>
        
        <div style="background-color: #007bff; color: white; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; display: inline-block; margin: 10px 0;">
          ${otp}
        </div>
        
        <p style="color: #666; margin-top: 20px; font-size: 14px;">
          This OTP will expire in <strong>10 minutes</strong>
        </p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #888; font-size: 14px; line-height: 1.5;">
          <strong>Security Notice:</strong><br>
          • Do not share this OTP with anyone<br>
          • If you didn't request this password reset, please ignore this email<br>
          • Your password will remain unchanged if you don't use this OTP
        </p>
        
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          This is an automated email from GuideMeLK. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  try {
    console.log('📤 Sending OTP email...');
    
    const info = await transporter.sendMail({
      from: `"GuideMeLK" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - GuideMeLK',
      html: emailTemplate,
    });
    
    console.log('✅ OTP email sent successfully:', info.messageId);
    
  } catch (error) {
    console.error('❌ OTP email sending failed:', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
}
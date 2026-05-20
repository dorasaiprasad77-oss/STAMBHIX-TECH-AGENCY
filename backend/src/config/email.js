const nodemailer = require('nodemailer');

let transporter = null;

/**
 * Get or create a nodemailer transporter based on environment config.
 * Supports two modes:
 *   1. Production/Gmail: using EMAIL_USER + EMAIL_PASS (app password)
 *   2. Dev/Mailtrap: using EMAIL_HOST + EMAIL_PORT + EMAIL_USER + EMAIL_PASS
 *   3. Fallback: logs to console if no email config is set
 */
const getTransporter = () => {
  if (transporter) return transporter;

  // Check if email is configured
  const hasEmailConfig = process.env.EMAIL_HOST || (process.env.EMAIL_USER && process.env.EMAIL_PASS);

  if (!hasEmailConfig) {
    return null;
  }

  if (process.env.EMAIL_HOST) {
    // Custom SMTP (Mailtrap, SendGrid, etc.)
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Default: Gmail SMTP
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return transporter;
};

/**
 * Send a password reset email
 */
const sendPasswordResetEmail = async (to, resetUrl, userName) => {
  const transport = getTransporter();

  const emailContent = {
    to,
    from: process.env.EMAIL_FROM || '"Stambhix" <noreply@stambhix.com>',
    subject: 'Reset Your Stambhix Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; margin: 0; padding: 0; }
          .container { max-width: 480px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 32px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .body { padding: 32px; }
          .body p { color: #4b5563; line-height: 1.6; margin: 0 0 16px; }
          .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 8px 0; }
          .footer { padding: 24px 32px; background: #f9fafb; text-align: center; }
          .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧠 MemoryChain</h1>
          </div>
          <div class="body">
            <p>Hi${userName ? ` ${userName}` : ' there'},</p>
            <p>We received a request to reset your MemoryChain password. Click the button below to set a new password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p style="margin-top: 24px;">This link will expire in <strong>1 hour</strong>.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>Stambhix Tech Agency — Your Trusted Marketplace For Every Service</p>
            <p style="margin-top: 4px;">If the button doesn't work, copy this URL into your browser:<br><a href="${resetUrl}" style="color: #4F46E5; word-break: break-all;">${resetUrl}</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  if (transport) {
    await transport.sendMail(emailContent);
  } else {
    // Fallback: log to console (useful in development)
    console.log('📧 Email not sent — no email provider configured.');
    console.log(`   To: ${to}`);
    console.log(`   Reset URL: ${resetUrl}`);
    console.log('   Configure EMAIL_HOST/EMAIL_USER/EMAIL_PASS env vars to send real emails.');
  }
};

module.exports = { getTransporter, sendPasswordResetEmail };

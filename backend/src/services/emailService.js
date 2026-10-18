import { Resend } from 'resend';

class EmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  }

  /**
   * Helper to render header logo with fallback
   */
  getHeaderBrandHtml() {
    const logoUrl = process.env.INTERVAI_LOGO_URL ? process.env.INTERVAI_LOGO_URL.trim() : '';
    if (logoUrl) {
      return `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="vertical-align: middle;">
              <img src="${logoUrl}" alt="intervAI" width="44" height="44" style="display: block; border-radius: 10px; border: 0; outline: none; text-decoration: none; max-width: 44px; max-height: 44px; margin-bottom: 8px;" />
              <div style="font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">interv<span style="color: #10b981;">AI</span></div>
            </td>
          </tr>
        </table>
      `;
    }

    return `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
        <tr>
          <td align="center">
            <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); background-color: #10b981; border-radius: 12px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 800; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
              i
            </div>
            <div style="font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin-top: 10px;">interv<span style="color: #10b981;">AI</span></div>
          </td>
        </tr>
      </table>
    `;
  }

  /**
   * Send OTP verification email
   * @param {string} email - Recipient email
   * @param {string} otp - OTP code
   * @param {string} username - User's name
   * @returns {Promise<boolean>} - Success status
   */
  async sendOTPEmail(email, otp, username) {
    try {
      const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10);
      const displayName = username ? username.trim() : 'there';
      const headerHtml = this.getHeaderBrandHtml();

      const otpDigitsHtml = otp.split('').map(digit => `
        <td align="center" style="width: 44px; height: 52px; background-color: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; font-family: 'SF Pro Mono', 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 26px; font-weight: 700; color: #0f172a; line-height: 52px;">
          ${digit}
        </td>
      `).join('<td style="width: 8px;"></td>');

      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `${otp} is your intervAI verification code`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05); overflow: hidden;">
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #10b981 0%, #34d399 100%); background-color: #10b981;"></td>
          </tr>
          
          <!-- Card Header & Branding -->
          <tr>
            <td align="center" style="padding: 36px 32px 16px 32px;">
              ${headerHtml}
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding: 0 32px 12px 32px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">Verify your email address</h1>
            </td>
          </tr>

          <!-- Intro copy -->
          <tr>
            <td align="center" style="padding: 0 32px 24px 32px;">
              <p style="margin: 0; font-size: 15px; line-height: 24px; color: #475569;">
                Hi <strong style="color: #0f172a;">${displayName}</strong>, welcome to intervAI! Use the verification code below to confirm your account and get started.
              </p>
            </td>
          </tr>

          <!-- OTP Digits Container -->
          <tr>
            <td align="center" style="padding: 8px 32px 24px 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  ${otpDigitsHtml}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Expiry Notice -->
          <tr>
            <td align="center" style="padding: 0 32px 24px 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px 18px;">
                <tr>
                  <td style="font-size: 13px; font-weight: 500; color: #065f46; text-align: center;">
                    ⏱️ Code expires in <strong>${expiryMinutes} minutes</strong>. Single use only.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding: 0 36px 32px 36px;">
              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b; text-align: center;">
                If you did not create an intervAI account with <strong style="color: #334155;">${email}</strong>, please disregard this email. Your email remains safe.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 36px;">
              <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 36px 30px 36px; background-color: #fafafa;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #94a3b8;">
                © ${new Date().getFullYear()} intervAI. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                AI-Powered Mock Interviews & Smart Candidate Evaluations
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `
      });

      return true;
    } catch (error) {
      console.error('Error sending OTP email:', error.message || error);
      return false;
    }
  }

  /**
   * Send registration success email after verification
   * @param {string} email - Recipient email
   * @param {string} username - User's name
   * @returns {Promise<boolean>} - Success status
   */
  async sendRegistrationSuccessEmail(email, username) {
    try {
      const displayName = username ? username.trim() : 'there';
      const headerHtml = this.getHeaderBrandHtml();

      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `Welcome to intervAI, ${displayName}! Your account is ready`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to intervAI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05); overflow: hidden;">
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #10b981 0%, #34d399 100%); background-color: #10b981;"></td>
          </tr>

          <!-- Card Header & Branding -->
          <tr>
            <td align="center" style="padding: 36px 32px 16px 32px;">
              ${headerHtml}
            </td>
          </tr>

          <!-- Success Badge -->
          <tr>
            <td align="center" style="padding: 0 32px 16px 32px;">
              <span style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 9999px; padding: 4px 14px; font-size: 12px; font-weight: 600; color: #059669; text-transform: uppercase; letter-spacing: 0.5px;">
                ✓ Email Verified & Account Ready
              </span>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding: 0 32px 12px 32px;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
                Welcome aboard, ${displayName}!
              </h1>
            </td>
          </tr>

          <!-- Intro copy -->
          <tr>
            <td align="center" style="padding: 0 32px 24px 32px;">
              <p style="margin: 0; font-size: 15px; line-height: 24px; color: #475569;">
                Your email has been verified and your intervAI account is active. You are now equipped to master real-world technical and behavioral interviews with AI-guided practice.
              </p>
            </td>
          </tr>

          <!-- Value / Feature Highlights -->
          <tr>
            <td style="padding: 0 32px 28px 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px;">
                <tr>
                  <td style="padding-bottom: 14px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="width: 32px; vertical-align: top; font-size: 18px;">🎯</td>
                        <td style="vertical-align: top; font-size: 14px; line-height: 20px; color: #334155;">
                          <strong style="color: #0f172a;">Tailored Mock Interviews:</strong> Generate dynamic interview sessions crafted around your target role, seniority level, and resume.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 14px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="width: 32px; vertical-align: top; font-size: 18px;">⚡</td>
                        <td style="vertical-align: top; font-size: 14px; line-height: 20px; color: #334155;">
                          <strong style="color: #0f172a;">Real-Time AI Feedback:</strong> Receive actionable critiques on technical accuracy, structure, delivery tone, and clarity.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="width: 32px; vertical-align: top; font-size: 18px;">📊</td>
                        <td style="vertical-align: top; font-size: 14px; line-height: 20px; color: #334155;">
                          <strong style="color: #0f172a;">In-Depth Evaluation Reports:</strong> Track your readiness score, key strengths, and clear areas for improvement before interview day.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security confirmation -->
          <tr>
            <td style="padding: 0 36px 30px 36px;">
              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #64748b; text-align: center;">
                Good luck with your interview preparation! We're thrilled to have you with us.<br>
                — <strong style="color: #334155;">Team intervAI</strong>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 36px;">
              <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 36px 30px 36px; background-color: #fafafa;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #94a3b8;">
                © ${new Date().getFullYear()} intervAI. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                You received this email because you signed up for an account on intervAI with ${email}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `
      });

      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error.message || error);
      return false;
    }
  }
}

export default new EmailService();
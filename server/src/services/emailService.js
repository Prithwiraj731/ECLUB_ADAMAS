const nodemailer = require('nodemailer');
require('dotenv').config();

const DEFAULT_RECIPIENT = 'adamaseclub@gmail.com';
const RECIPIENT_EMAIL = process.env.NOTIFICATION_EMAIL || process.env.CONTACT_EMAIL || DEFAULT_RECIPIENT;

// Configure nodemailer transporter
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send an email notification whenever a user submits a message via the Contact Us form
 */
exports.sendContactInquiryNotification = async ({ name, email, subject, message }) => {
  try {
    const formattedDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const cleanSubject = subject ? subject.trim() : 'General Inquiry';

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #FAF8F5; border: 1px solid #E2DDD5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: #0B0B0B; padding: 24px; text-align: center; border-bottom: 3px solid #8B0D1A;">
          <h2 style="color: #F5F2ED; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1.5px;">Adamas University E-Club</h2>
          <p style="color: #E63946; font-weight: 700; margin: 6px 0 0 0; font-size: 13px; letter-spacing: 2px;">NEW WEBSITE CONTACT INQUIRY</p>
        </div>

        <div style="padding: 28px 24px; color: #0B0B0B;">
          <div style="background: #FFFFFF; border: 1px solid #E2DDD5; border-left: 4px solid #8B0D1A; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #7D7872; text-transform: uppercase; font-weight: 700;">Subject</p>
            <h3 style="margin: 0; font-size: 18px; color: #0B0B0B;">${cleanSubject}</h3>
          </div>

          <div style="background: #FFFFFF; border: 1px solid #E2DDD5; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #7D7872; font-size: 13px; width: 120px;"><strong>Sender Name:</strong></td>
                <td style="padding: 8px 0; color: #0B0B0B; font-size: 14px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7D7872; font-size: 13px;"><strong>Sender Email:</strong></td>
                <td style="padding: 8px 0; font-size: 14px;">
                  <a href="mailto:${email}" style="color: #8B0D1A; text-decoration: none; font-weight: 600;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7D7872; font-size: 13px;"><strong>Submitted At:</strong></td>
                <td style="padding: 8px 0; color: #0B0B0B; font-size: 13px;">${formattedDate} IST</td>
              </tr>
            </table>
          </div>

          <div style="background: #FFFFFF; border: 1px solid #E2DDD5; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #7D7872; text-transform: uppercase; font-weight: 700;">Message Content</p>
            <div style="margin: 0; color: #2D2A26; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
          </div>

          <div style="background: #FFF1F2; border: 1px solid #FECDD3; border-radius: 8px; padding: 14px; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #9F1239;">
              💡 <strong>Tip:</strong> Simply hit <strong>Reply</strong> in your email client to respond directly to <strong>${name}</strong> (${email}).
            </p>
          </div>
        </div>

        <div style="background: #0B0B0B; padding: 14px; text-align: center; color: #A8A39D; font-size: 11px;">
          Adamas University Entrepreneurship Club • Website Communication System
        </div>
      </div>
    `;

    if (transporter) {
      const info = await transporter.sendMail({
        from: `"E-Club Website Contact" <${process.env.EMAIL_USER}>`,
        to: RECIPIENT_EMAIL,
        replyTo: `"${name}" <${email}>`,
        subject: `📩 [Website Inquiry] ${cleanSubject} — from ${name}`,
        html: emailHtml,
      });
      console.log(`📧 Contact message successfully forwarded to ${RECIPIENT_EMAIL}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`ℹ️ [Email Dispatch (Dev/Offline)] Contact message from "${name}" <${email}> received:`);
      console.log(`   Subject: ${cleanSubject}`);
      console.log(`   Recipient: ${RECIPIENT_EMAIL}`);
      console.log(`   Message: ${message}`);
      return { success: false, reason: 'Transporter not configured (EMAIL_USER / EMAIL_PASS missing)' };
    }
  } catch (err) {
    console.error('⚠️ Error sending contact inquiry email:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send an email notification whenever a visitor submits a review for a stall
 * (Optional / can be toggled via ENABLE_RATING_EMAILS=true)
 */
exports.sendReviewNotification = async ({ stallName, stallNumber, rating, reviewerName, reviewerContact, reviewText }) => {
  // Only send rating emails if explicitly enabled via environment variable to prevent inbox overflow during high-traffic events
  const enableRatingEmails = process.env.ENABLE_RATING_EMAILS === 'true';
  if (!enableRatingEmails) {
    return;
  }

  try {
    const starString = '★'.repeat(rating) + '☆'.repeat(5 - rating);

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF8F5; border: 1px solid #E2DDD5; border-radius: 12px; overflow: hidden;">
        <div style="background: #0B0B0B; padding: 24px; text-align: center; border-bottom: 3px solid #8B0D1A;">
          <h2 style="color: #F5F2ED; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Adamas E-Club • Rakhi Startup Bazaar</h2>
          <p style="color: #8B0D1A; font-weight: 700; margin: 6px 0 0 0; font-size: 13px; letter-spacing: 2px;">NEW STALL RATING &amp; FEEDBACK</p>
        </div>

        <div style="padding: 28px 24px; color: #0B0B0B;">
          <div style="background: #FFFFFF; border: 1px solid #E2DDD5; border-left: 4px solid #8B0D1A; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <p style="margin: 0 0 6px 0; font-size: 12px; color: #7D7872; text-transform: uppercase; font-weight: 700;">Rated Stall</p>
            <h3 style="margin: 0; font-size: 20px; color: #0B0B0B;">${stallName} <span style="font-size: 14px; color: #8B0D1A; font-weight: 700;">(#${stallNumber || 'N/A'})</span></h3>
          </div>

          <div style="background: #FFFFFF; border: 1px solid #E2DDD5; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #7D7872; font-size: 13px; width: 120px;"><strong>Rating Given:</strong></td>
                <td style="padding: 8px 0; color: #8B0D1A; font-size: 18px; font-weight: bold;">${starString} (${rating} / 5)</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7D7872; font-size: 13px;"><strong>Reviewer Name:</strong></td>
                <td style="padding: 8px 0; color: #0B0B0B; font-size: 14px; font-weight: 600;">${reviewerName || 'Anonymous Visitor'}</td>
              </tr>
              ${reviewerContact ? `
              <tr>
                <td style="padding: 8px 0; color: #7D7872; font-size: 13px;"><strong>Contact / ID:</strong></td>
                <td style="padding: 8px 0; color: #0B0B0B; font-size: 14px;">${reviewerContact}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #7D7872; font-size: 13px;"><strong>Time:</strong></td>
                <td style="padding: 8px 0; color: #0B0B0B; font-size: 14px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
              </tr>
            </table>
          </div>

          <div style="background: #FFFFFF; border: 1px solid #E2DDD5; border-radius: 8px; padding: 18px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #7D7872; text-transform: uppercase; font-weight: 700;">Feedback / Review Notes</p>
            <p style="margin: 0; color: #2D2A26; font-size: 14px; line-height: 1.6; font-style: italic;">
              "${reviewText || 'No additional written comments provided.'}"
            </p>
          </div>
        </div>

        <div style="background: #0B0B0B; padding: 14px; text-align: center; color: #A8A39D; font-size: 11px;">
          Adamas University Entrepreneurship Club • Powered by E-Club Platform
        </div>
      </div>
    `;

    if (transporter) {
      const info = await transporter.sendMail({
        from: `"Adamas E-Club Ratings" <${process.env.EMAIL_USER}>`,
        to: RECIPIENT_EMAIL,
        subject: `★ [${rating}/5 Stars] New Stall Review: ${stallName} (#${stallNumber || 'Stall'})`,
        html: emailHtml,
      });
      console.log(`📧 Review notification email sent to ${RECIPIENT_EMAIL}: ${info.messageId}`);
    }
  } catch (err) {
    console.error('⚠️ Could not send review email notification:', err.message);
  }
};


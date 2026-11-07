/**
 * Brevo (Sendinblue) Transactional Email Service
 * Sends customer inquiries directly from the website to the business owner
 */

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY || '';
const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || 'yakshbarot597@gmail.com';
const SENDER_EMAIL = import.meta.env.VITE_BREVO_SENDER_EMAIL || 'yakshbarot597@gmail.com';
const SENDER_NAME = import.meta.env.VITE_BREVO_SENDER_NAME || 'Tap Card Studio';

export const brevoService = {
  /**
   * Send an inquiry notification email to the owner
   */
  sendInquiryEmail: async (inquiryData) => {
    if (!BREVO_API_KEY) {
      console.warn('Brevo API key is not configured in .env');
      return { success: false, error: 'Brevo API key missing' };
    }

    const {
      customerName,
      email,
      phone,
      company,
      cardType,
      material,
      quantity,
      targetUrl,
      customNotes
    } = inquiryData;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #0369a1; padding: 16px 20px; border-radius: 8px; color: #ffffff; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px;">⚡ New Card Inquiry Received</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Via Tap Card Contactless Platform</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold; width: 35%;">Customer Name:</td>
            <td style="padding: 10px 0; color: #0f172a;">${customerName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold;">Customer Email:</td>
            <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0284c7;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold;">Phone / WhatsApp:</td>
            <td style="padding: 10px 0;">${phone || 'Not provided'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold;">Business / Company:</td>
            <td style="padding: 10px 0;">${company || 'Individual / Creator'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold;">Selected Card Plan:</td>
            <td style="padding: 10px 0; font-weight: bold; color: #0369a1;">${cardType}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold;">Physical Material:</td>
            <td style="padding: 10px 0;">${material || 'Matte Velvet Black'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold;">Quantity Required:</td>
            <td style="padding: 10px 0; font-weight: bold;">${quantity} units</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; font-weight: bold;">Destination Link to Encode:</td>
            <td style="padding: 10px 0;">
              ${targetUrl ? `<a href="${targetUrl}" target="_blank" style="color: #0284c7;">${targetUrl}</a>` : 'To be provided with proof'}
            </td>
          </tr>
        </table>

        ${customNotes ? `
          <div style="margin-top: 20px; padding: 14px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #64748b;">Customer Special Instructions:</p>
            <p style="margin: 0; font-size: 13px; color: #1e293b; line-height: 1.5;">${customNotes}</p>
          </div>
        ` : ''}

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
          <p style="margin: 0;">Sent directly via Brevo Transactional API from Tap Card Platform.</p>
          ${phone ? `<p style="margin: 6px 0 0 0;"><a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="color: #16a34a; font-weight: bold; text-decoration: none;">💬 Click to reply via WhatsApp</a></p>` : ''}
        </div>
      </div>
    `;

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: SENDER_NAME,
            email: SENDER_EMAIL
          },
          to: [
            {
              email: OWNER_EMAIL,
              name: 'Tap Card Business Owner'
            }
          ],
          replyTo: {
            email: email,
            name: customerName
          },
          subject: `⚡ New Card Inquiry: ${quantity}x ${cardType} from ${customerName}`,
          htmlContent: emailHtml
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Brevo API Error:', errorData);
        return { 
          success: false, 
          error: errorData.message || `Failed to send email (${response.status})` 
        };
      }

      const result = await response.json();
      return { success: true, messageId: result.messageId };
    } catch (err) {
      console.error('Brevo network exception:', err);
      return { success: false, error: err.message };
    }
  }
};

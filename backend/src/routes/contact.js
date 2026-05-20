const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { getTransporter } = require('../config/email');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * Send notification email to the Stambhix team about a new contact submission.
 */
const sendContactNotification = async (contactData) => {
  const transport = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'hello@stambhix.com';

  const serviceLabels = {
    web: 'Web Development',
    app: 'App Development',
    design: 'UI/UX Design',
    seo: 'SEO',
    home: 'Home Services',
    other: 'Other',
  };

  const emailContent = {
    to: adminEmail,
    from: process.env.EMAIL_FROM || '"Stambhix Website" <noreply@stambhix.com>',
    subject: `🆕 New Contact Inquiry from ${contactData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0A0A0A; margin: 0; padding: 0; }
          .container { max-width: 520px; margin: 40px auto; background: #111; border-radius: 16px; overflow: hidden; border: 1px solid rgba(212, 168, 83, 0.15); }
          .header { background: linear-gradient(135deg, #D4A853, #B8922E); padding: 28px 32px; text-align: center; }
          .header h1 { color: #0A0A0A; margin: 0; font-size: 22px; font-weight: 700; }
          .header p { color: rgba(10, 10, 10, 0.7); margin: 4px 0 0; font-size: 14px; }
          .body { padding: 32px; }
          .field { margin-bottom: 20px; }
          .field-label { color: #D4A853; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .field-value { color: #e0e0e0; font-size: 15px; line-height: 1.5; margin: 0; }
          .message-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 16px; margin-top: 4px; }
          .divider { height: 1px; background: linear-gradient(to right, transparent, rgba(212, 168, 83, 0.2), transparent); margin: 24px 0; }
          .footer { padding: 20px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
          .footer p { color: #666; font-size: 12px; margin: 0; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(212, 168, 83, 0.1); color: #D4A853; font-size: 12px; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✦ New Contact</h1>
            <p>Stambhix Tech Agency — Website Inquiry</p>
          </div>
          <div class="body">
            <div class="field">
              <div class="field-label">Name</div>
              <p class="field-value">${contactData.name}</p>
            </div>
            <div class="field">
              <div class="field-label">Email</div>
              <p class="field-value"><a href="mailto:${contactData.email}" style="color: #D4A853; text-decoration: none;">${contactData.email}</a></p>
            </div>
            <div class="field">
              <div class="field-label">Service Interested In</div>
              <p class="field-value"><span class="badge">${serviceLabels[contactData.service] || 'Not specified'}</span></p>
            </div>
            <div class="divider"></div>
            <div class="field">
              <div class="field-label">Message</div>
              <div class="message-box">
                <p class="field-value" style="white-space: pre-wrap;">${contactData.message}</p>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>Stambhix Tech Agency — Your Trusted Marketplace For Every Service</p>
            <p style="margin-top: 4px;">Received ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })} IST</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  if (transport) {
    try {
      await transport.sendMail(emailContent);
      console.log(`📧 Contact notification sent for ${contactData.email}`);
    } catch (err) {
      console.error(`⚠ Failed to send contact notification email: ${err.message}`);
    }
  } else {
    console.log('📧 Contact notification email not sent — no email provider configured.');
    console.log(`   From: ${contactData.name} <${contactData.email}>`);
    console.log(`   Service: ${contactData.service}`);
    console.log(`   Message: ${contactData.message.substring(0, 100)}...`);
    console.log('   Configure EMAIL_HOST/EMAIL_USER/EMAIL_PASS env vars to send real emails.');
  }
};

/**
 * Send an auto-reply to the person who submitted the contact form.
 */
const sendAutoReply = async (contactData) => {
  const transport = getTransporter();
  if (!transport) return;

  try {
    await transport.sendMail({
      to: contactData.email,
      from: process.env.EMAIL_FROM || '"Stambhix Tech Agency" <noreply@stambhix.com>',
      subject: 'Thank you for contacting Stambhix!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 480px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
            .header { background: linear-gradient(135deg, #D4A853, #B8922E); padding: 32px; text-align: center; }
            .header h1 { color: #0A0A0A; margin: 0; font-size: 24px; }
            .header p { color: rgba(10,10,10,0.7); margin: 4px 0 0; }
            .body { padding: 32px; }
            .body p { color: #4b5563; line-height: 1.7; margin: 0 0 16px; font-size: 15px; }
            .footer { padding: 24px 32px; background: #f9fafb; text-align: center; }
            .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
            .signature { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
            .signature p { margin: 2px 0; color: #6b7280; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✦ Stambhix</h1>
              <p>Tech Agency</p>
            </div>
            <div class="body">
              <p>Hi ${contactData.name},</p>
              <p>Thank you for reaching out to Stambhix! We've received your inquiry and our team will review it shortly.</p>
              <p>We typically respond within <strong>24 hours</strong> during business days. If your matter is urgent, feel free to call us directly.</p>
              <p>In the meantime, feel free to browse our services on our website.</p>
              <div class="signature">
                <p><strong>Best regards,</strong></p>
                <p>The Stambhix Team</p>
                <p style="color: #D4A853;">hello@stambhix.com</p>
              </div>
            </div>
            <div class="footer">
              <p>Stambhix Tech Agency — Your Trusted Marketplace For Every Service</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log(`📧 Auto-reply sent to ${contactData.email}`);
  } catch (err) {
    console.error(`⚠ Failed to send auto-reply: ${err.message}`);
  }
};

// POST /api/contact
router.post('/', [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('service')
    .optional()
    .trim()
    .isIn(['web', 'app', 'design', 'seo', 'home', 'other', '']).withMessage('Invalid service selection'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters'),
], async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
      });
    }

    const { name, email, service, message } = req.body;

    // Store in database
    const contact = await Contact.create({
      name,
      email,
      service: service || 'other',
      message,
    });

    // Send notification to admin (non-blocking)
    sendContactNotification({ name, email, service, message }).catch(() => {});

    // Send auto-reply to the user (non-blocking)
    sendAutoReply({ name, email }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! We\'ll get back to you within 24 hours.',
      id: contact._id,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/contact — list all contacts (admin only)
router.get('/', auth, async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Contact.countDocuments(query),
    ]);

    res.json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/contact/:id — update contact status (admin only)
router.patch('/:id', auth, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'read') updateData.readAt = new Date();
    if (status === 'replied') updateData.repliedAt = new Date();

    const contact = await Contact.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

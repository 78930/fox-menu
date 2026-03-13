const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// POST /api/book
app.post('/api/book', async (req, res) => {
  const { name, phone, person, reservation_date, reservation_time, message } = req.body || {};

  if (!name || !phone || !reservation_date || !reservation_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const bookingMessage = `Name: ${name}\nPhone: ${phone}\nNumber of Persons: ${person || 'N/A'}\nReservation Date: ${reservation_date}\nTime: ${reservation_time}\nMessage: ${message || 'No message'}`;

  // If SMTP is configured, send an email; otherwise just log
  const smtpHost = process.env.SMTP_HOST;
  if (smtpHost) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
    });

    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || 'no-reply@example.com',
        to: process.env.DEST_EMAIL || 'booking@foxstoriescafe.com',
        subject: `New booking from ${name}`,
        text: bookingMessage
      });

      return res.status(200).json({ ok: true, message: 'Booking received and emailed.' });
    } catch (err) {
      console.error('Error sending email:', err);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }

  // Fallback when SMTP not configured
  console.log('Booking received (no SMTP):', bookingMessage);
  return res.status(202).json({ ok: true, message: 'Booking received (no SMTP configured).' });
});

app.listen(PORT, () => {
  console.log(`Example backend listening on http://localhost:${PORT}`);
});

const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { name, phone, person, reservation_date, reservation_time, message } = req.body || {};
  if (!name || !phone || !reservation_date || !reservation_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const bookingMessage = `Name: ${name}\nPhone: ${phone}\nNumber of Persons: ${person || 'N/A'}\nReservation Date: ${reservation_date}\nTime: ${reservation_time}\nMessage: ${message || 'No message'}`;

  if (process.env.SMTP_HOST) {
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

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }

  console.log('Booking (no SMTP):', bookingMessage);
  return res.status(202).json({ ok: true, message: 'Received (no SMTP configured)' });
};

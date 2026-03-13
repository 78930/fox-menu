const nodemailer = require('nodemailer');

// Netlify Function: POST handler for booking
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { name, phone, person, reservation_date, reservation_time, message } = payload;
  if (!name || !phone || !reservation_date || !reservation_time) {
    return { statusCode: 400, body: 'Missing required fields' };
  }

  const bookingMessage = `Name: ${name}\nPhone: ${phone}\nNumber of Persons: ${person || 'N/A'}\nReservation Date: ${reservation_date}\nTime: ${reservation_time}\nMessage: ${message || 'No message'}`;

  // Use SMTP credentials stored as environment variables in Netlify UI
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

      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } catch (err) {
      console.error(err);
      return { statusCode: 500, body: 'Failed to send email' };
    }
  }

  console.log('Booking (no SMTP):', bookingMessage);
  return { statusCode: 202, body: JSON.stringify({ ok: true, message: 'Received (no SMTP configured)' }) };
};

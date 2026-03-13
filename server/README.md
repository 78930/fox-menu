# Example Express Backend

This folder contains a minimal Express example that exposes a POST endpoint at `/api/book`.

Environment variables (optional, for sending email via SMTP):

- `SMTP_HOST` - SMTP host (e.g. smtp.sendgrid.net)
- `SMTP_PORT` - SMTP port (default 587)
- `SMTP_SECURE` - `true` if using secure connection
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `FROM_EMAIL` - From address used for outgoing mails
- `DEST_EMAIL` - Destination email address for bookings (defaults to booking@foxstoriescafe.com)

Install and run:

```bash
cd server
npm install
npm start
```

Then POST JSON to `http://localhost:3000/api/book` with fields `name`, `phone`, `person`, `reservation_date`, `reservation_time`, and optional `message`.

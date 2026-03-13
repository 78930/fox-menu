# Backend options for Grilli

This repository is a static site. The existing booking flow is handled client-side using EmailJS and a redirect to WhatsApp.

Three approaches are provided here:

- A) Client-side EmailJS (existing): set your EmailJS keys in `index.html` meta tags or in `window.APP_CONFIG`.
- B) Example Express backend: `server/index.js` exposes `POST /api/book` and can send email via SMTP (configure `SMTP_*` env vars).
- C) Serverless examples: `netlify/functions/book.js` and `api/book.js` (for Vercel) — use platform environment variables for SMTP.

Where to set EmailJS keys (Option A):

- In `index.html` (head) replace the placeholder values:

  <meta name="emailjs-public" content="YOUR_PUBLIC_KEY">
  <meta name="emailjs-service" content="YOUR_SERVICE_ID">
  <meta name="emailjs-template" content="YOUR_TEMPLATE_ID">

  Or, set `window.APP_CONFIG` before the main script, for example in `index.html`:

  <script>
    window.APP_CONFIG = {
      EMAILJS_PUBLIC_KEY: 'your_public_key',
      EMAILJS_SERVICE_ID: 'your_service_id',
      EMAILJS_TEMPLATE_ID: 'your_template_id'
    };
  </script>

How to switch the client to use a backend (Option B/C):

1. Deploy the Express server or serverless function.
2. Update `assets/js/script.js` to POST form data to your endpoint instead of calling `emailjs.send` (or keep both and choose behavior based on a flag).

Example client POST (fetch):

```js
fetch('https://your-backend.example.com/api/book', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, phone, person, reservation_date: date, reservation_time: time, message })
});
```

If you want, I can:

- Wire the client to POST to the example server by default (update `script.js`).
- Add environment-specific notes (SendGrid example, security tips).

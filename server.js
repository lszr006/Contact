const express = require('express');
const { Resend } = require('resend');
const path = require('path');

const app = express();
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'ls0096196@gmail.com';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/contact', async (req, res) => {
  if (!resend) {
    console.error('RESEND_API_KEY is not set.');
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    await resend.emails.send({
      from: `Contact Form <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `[${subject}] New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

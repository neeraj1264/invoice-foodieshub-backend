const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { name, email, phone, business_name, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // EMAIL TO YOU (ADMIN NOTIFICATION)

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New enquiry from ${name} | Barclays Accounting Website`,
      html: `
        <h2>New Contact Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Business:</b> ${business_name}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    // AUTO REPLY TO CLIENT

    await transporter.sendMail({
      from: `"Barclays Accounting" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your enquiry | Barclays Accounting & Bookkeeping",
      html: `
        <h3>Hi ${name},</h3>

        <p>Thank you for contacting <b>Barclays Accounting & Bookkeeping</b>.</p>

        <p>We have received your enquiry and one of our team members will contact you <b>Shortly</b>.</p>

        <p>If your request is urgent, please call us on <b>+61 411 873 522</b> or simply reply to this email</p>

        <br/>

        <p>Best regards,<br/>
        Barclays Accounting & Bookkeeping<br/>
        📞 +61 411 873 522<br/>
        📧 info@barclayspartners.com.au</p>
      `,
    });

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;

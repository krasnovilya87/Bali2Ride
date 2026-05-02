import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Booking Notifications
  app.post("/api/notify-booking", async (req, res) => {
    const { bike, bookingDetails, customerDetails } = req.body;

    const emailHtml = `
      <h1>New Booking Request</h1>
      <p><strong>Bike:</strong> ${bike.name}</p>
      <p><strong>Period:</strong> ${bookingDetails.days} days (${bookingDetails.from} to ${bookingDetails.to})</p>
      <p><strong>Total Price:</strong> ${bookingDetails.totalPrice} IDR</p>
      <p><strong>Location:</strong> ${bookingDetails.location}</p>
      <p><strong>Delivery Time:</strong> ${bookingDetails.deliveryTime}</p>
      <hr />
      <h3>Customer Details:</h3>
      <p><strong>Name:</strong> ${customerDetails.name}</p>
      <p><strong>Phone:</strong> ${customerDetails.phone}</p>
      <p><strong>Email:</strong> ${customerDetails.email || 'Not provided'}</p>
    `;

    // 1. Send Email to Operator
    try {
      const transporter = nodemailer.createTransport({
        // For production, the user would provide these via .env
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, 
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail({
          from: `"Bali Moto Booking" <${process.env.SMTP_USER}>`,
          to: "m001008009@gmail.com",
          subject: `New Booking: ${bike.name} by ${customerDetails.name}`,
          html: emailHtml,
        });
        console.log("Email sent to operator");
      } else {
        console.warn("SMTP credentials missing. Email not sent, but logged to console.");
        console.log("--- EMAIL CONTENT ---\n", emailHtml);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }

    // 2. WhatsApp Notification (Theoretical / Logged)
    // Note: Automated WhatsApp messages require a paid API like Twilio or Meta WhatsApp Business API.
    // Here we log the intention and return a success status so the client can show the UI.
    console.log(`[WhatsApp Simulation] Sending booking confirmation to ${customerDetails.phone}...`);

    res.json({ success: true, message: "Notifications processed" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

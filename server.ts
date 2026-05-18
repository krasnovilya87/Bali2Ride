import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Booking Notifications
  app.post("/api/notify-booking", async (req, res) => {
    const { bike, selectedColor, bookingDetails, customerDetails } = req.body;

    console.log(`[New Order]:
    - Bike: ${bike.name} (${selectedColor || 'N/A'})
    - District: ${bookingDetails.selectedDistrict || 'N/A'}
    - Address: ${bookingDetails.location}
    - Phone: ${customerDetails.phone}
    - Customer: ${customerDetails.name}
    - Period: ${bookingDetails.from} - ${bookingDetails.to} (${bookingDetails.days} days)
    - Total: ${bookingDetails.totalPrice} IDR`);

    // 1. WhatsApp Notification
    const whatsappMsg = `🔔 *New Booking Request*
    
🏍 *Bike:* ${bike.name} (${selectedColor || 'N/A'})
📅 *Period:* ${bookingDetails.days} days
🗓 *Dates:* ${bookingDetails.from} - ${bookingDetails.to}
💰 *Total:* ${bookingDetails.totalPrice.toLocaleString()} IDR
📍 *District:* ${bookingDetails.selectedDistrict || 'N/A'}
🏠 *Address:* ${bookingDetails.location}
⏰ *Delivery:* ${bookingDetails.deliveryTime}

👤 *Customer:* ${customerDetails.name}
📱 *Phone:* ${customerDetails.phone}
📧 *Email:* ${customerDetails.email || 'Not provided'}`;

    const waToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
    const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
    const waRecipientRaw = process.env.WHATSAPP_RECIPIENT_PHONE?.trim();
    const waTemplateName = process.env.WHATSAPP_TEMPLATE_NAME?.trim() || "hello_world";
    
    // Check if we should use a template (e.g. if we have any template-specific data or just a template name)
    // For this implementation, we check if the recipient is set and we have the credentials
    if (waToken && waPhoneId && waRecipientRaw) {
      // Clean recipient phone number (strip everything except digits)
      const waRecipient = waRecipientRaw.replace(/\D/g, "");

      try {
        const url = `https://graph.facebook.com/v20.0/${waPhoneId}/messages`;
        
        let body: any;
        
        // Use the template name from env or fallback to hello_world
        body = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: waRecipient,
          type: "template",
          template: {
            name: waTemplateName,
            language: { code: "en" }, 
            components: waTemplateName === "hello_world" ? [] : [
              {
                type: "body",
                parameters: [
                  { type: "text", text: customerDetails.name }, // {{1}} - Customer Name
                  { type: "text", text: bike.name }, // {{2}} - Bike Name
                  { type: "text", text: selectedColor || 'N/A' }, // {{3}} - Color
                  { type: "text", text: `${bookingDetails.from} - ${bookingDetails.to}` }, // {{4}} - Dates
                  { type: "text", text: bookingDetails.helmet1Size || 'N/A' }, // {{5}} - Helmet 1
                  { type: "text", text: bookingDetails.helmet2Size || 'N/A' }, // {{6}} - Helmet 2
                  { type: "text", text: bookingDetails.surfRack ? 'Yes' : 'No' }, // {{7}} - Surf Rack
                  { type: "text", text: bookingDetails.selectedDistrict || 'N/A' }, // {{8}} - District
                  { type: "text", text: bookingDetails.location || 'N/A' }, // {{9}} - Address
                  { type: "text", text: bookingDetails.deliveryTime || 'N/A' }, // {{10}} - Time
                  { type: "text", text: bookingDetails.totalPriceDisplay || `${bookingDetails.totalPrice.toLocaleString()} IDR` }, // {{11}} - Total Price
                  { type: "text", text: bookingDetails.paymentMethod || 'N/A' }, // {{12}} - Method
                  { type: "text", text: bookingDetails.paymentStatus || 'N/A' } // {{13}} - Status
                ]
              }
            ]
          }
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${waToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const waData = await response.json();
        if (!response.ok) {
          console.error("WhatsApp API Error:", JSON.stringify(waData, null, 2));
        } else {
          console.log("WhatsApp message sent successfully");
        }
      } catch (waError) {
        console.error("Error sending WhatsApp message:", waError);
      }
    } else {
      console.warn("WhatsApp credentials missing (Token, Phone ID, or Recipient). Skipping WhatsApp notification.");
    }

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

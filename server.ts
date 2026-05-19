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

    // 1. Telegram Notification
    const tgToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const tgChatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (tgToken && tgChatId) {
      try {
        const tgUrl = `https://api.telegram.org/bot${tgToken}/sendMessage`;
        
        // Helper to escape HTML special characters
        const esc = (str: any) => {
          if (!str) return 'N/A';
          return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        };

        const paymentTime = bookingDetails.paymentTiming === 'delivery' || 
                            bookingDetails.paymentMethod === 'cash' ||
                            bookingDetails.paymentMethod?.toLowerCase().includes('delivery')
          ? 'On delivery' 
          : 'Now';

        const cleanPhone = customerDetails.phone.replace(/\D/g, "");
        const tgMsg = `<b>🔔 New Booking Request</b>\n\n` +
          `🛵 <b>Bike:</b> ${esc(bike.name)}\n` +
          `🔘 <b>Color:</b> ${esc(selectedColor)}\n` +
          `📅 <b>Period:</b> ${bookingDetails.days} days\n` +
          `📅 <b>Rental dates:</b> ${esc(bookingDetails.from)} - ${esc(bookingDetails.to)}\n` +
          `🛡️ <b>Helmet 1:</b> ${esc(bookingDetails.helmet1Size)}\n` +
          `🛡️ <b>Helmet 2:</b> ${esc(bookingDetails.helmet2Size)}\n` +
          `🏄 <b>Surf rack:</b> ${bookingDetails.surfRack ? 'Yes' : 'No'}\n` +
          `🗺️ <b>Location:</b> ${esc(bookingDetails.selectedDistrict)}\n` +
          `⏰ <b>Delivery time:</b> ${esc(bookingDetails.deliveryTime)}\n` +
          `📍 <b>Address:</b> <a href="https://www.google.com/maps?q=${bookingDetails.lat},${bookingDetails.lng}">Google Maps</a> (${esc(bookingDetails.location)})\n\n` +
          `💵 <b>Total price:</b> ${bookingDetails.totalPrice.toLocaleString()} IDR\n` +
          (bookingDetails.totalPriceDisplay && !bookingDetails.totalPriceDisplay.includes('IDR') ? `💵 <b>Total price:</b> ${esc(bookingDetails.totalPriceDisplay)}\n` : '') +
          `____________________________________\n` +
          `💳 <b>Payment method:</b> ${esc(bookingDetails.paymentMethod)}${bookingDetails.totalPriceDisplay && !bookingDetails.totalPriceDisplay.includes('IDR') ? ` ${esc(bookingDetails.totalPriceDisplay)}` : ''}\n` +
          `🪙 <b>Payment time:</b> ${paymentTime}\n` +
          `⚙️ <b>Payment status:</b> ${esc(bookingDetails.paymentStatus)}\n` +
          `____________________________________\n` +
          `👤 <b>Client:</b> ${esc(customerDetails.name)}\n` +
          `📱 <b>Phone:</b> <a href="https://wa.me/${cleanPhone}">${esc(customerDetails.phone)}</a>`;

        const tgResponse = await fetch(tgUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: tgMsg,
            parse_mode: "HTML",
          }),
        });

        const tgData = await tgResponse.json();
        if (!tgResponse.ok) {
          console.error("Telegram API Error:", JSON.stringify(tgData, null, 2));
        } else {
          console.log("Telegram message sent successfully");

          // Send second message (localized confirmation)
          const isRussian = customerDetails.phone.startsWith('+7') || 
                            customerDetails.phone.startsWith('7') || 
                            customerDetails.phone.startsWith('8');

          let confirmMsg = "";
          if (isRussian) {
            confirmMsg = `Привет, <b>${esc(customerDetails.name)}</b>!\n\n` +
              `🥥 Спасибо, что выбрали <b>CocoDrive!</b>\n\n` +
              `🔶 <b>Ваш заказ:</b>\n\n` +
              `🛵 <b>Байк:</b> ${esc(bike.name)}\n` +
              `🔘 <b>Цвет:</b> ${esc(selectedColor)}\n` +
              `📅 <b>Период:</b> ${bookingDetails.days} дн.\n` +
              `📅 <b>Даты:</b> ${esc(bookingDetails.from)} - ${esc(bookingDetails.to)}\n` +
              `🛡️ <b>Шлем 1:</b> ${esc(bookingDetails.helmet1Size)}\n` +
              `🛡️ <b>Шлем 2:</b> ${esc(bookingDetails.helmet2Size)}\n` +
              `🏄 <b>Серф-рэк:</b> ${bookingDetails.surfRack ? 'Да' : 'Нет'}\n` +
              `🗺️ <b>Район:</b> ${esc(bookingDetails.selectedDistrict)}\n` +
              `⏰ <b>Время доставки:</b> ${esc(bookingDetails.deliveryTime)}\n` +
              `📍 <b>Адрес:</b> <a href="https://www.google.com/maps?q=${bookingDetails.lat},${bookingDetails.lng}">Google Maps</a> (${esc(bookingDetails.location)})\n\n` +
              `💵 <b>Итого:</b> ${bookingDetails.totalPrice.toLocaleString()} IDR\n` +
              `____________________________________\n` +
              `💳 <b>Метод оплаты:</b> ${esc(bookingDetails.paymentMethod)}${bookingDetails.totalPriceDisplay && !bookingDetails.totalPriceDisplay.includes('IDR') ? ` - <b>${esc(bookingDetails.totalPriceDisplay)}</b>` : ''}\n` +
              `🪙 <b>Время оплаты:</b> ${paymentTime === 'On delivery' ? 'при получении' : 'сейчас'}\n` +
              `⚙️ <b>Статус оплаты:</b> ${esc(bookingDetails.paymentStatus)}\n` +
              `____________________________________\n\n` +
              `Ваш заказ принят в работу!\n\n` +
              `В ближайшее время вы получите фотографии байка и контакты курьера!\n` +
              `Ожидание информации не более 4 часов.\n\n` +
              `Если у вас есть вопросы или нужно изменить заказ, пожалуйста, напишите нам прямо в этом чате!\n\n` +
              `<b>Приятного путешествия!</b>`;
          } else {
            confirmMsg = `Hello <b>${esc(customerDetails.name)}</b>!\n\n` +
              `🥥 Thank you for choosing <b>CocoDrive!</b>\n\n` +
              `🔶 <b>Your order:</b>\n\n` +
              `🛵 <b>Bike:</b> ${esc(bike.name)}\n` +
              `🔘 <b>Color:</b> ${esc(selectedColor)}\n` +
              `📅 <b>Period:</b> ${bookingDetails.days} days\n` +
              `📅 <b>Rental dates:</b> ${esc(bookingDetails.from)} - ${esc(bookingDetails.to)}\n` +
              `🛡️ <b>Helmet 1:</b> ${esc(bookingDetails.helmet1Size)}\n` +
              `🛡️ <b>Helmet 2:</b> ${esc(bookingDetails.helmet2Size)}\n` +
              `🏄 <b>Surf rack:</b> ${bookingDetails.surfRack ? 'Yes' : 'No'}\n` +
              `🗺️ <b>Location:</b> ${esc(bookingDetails.selectedDistrict)}\n` +
              `⏰ <b>Delivery time:</b> ${esc(bookingDetails.deliveryTime)}\n` +
              `📍 <b>Address:</b> <a href="https://www.google.com/maps?q=${bookingDetails.lat},${bookingDetails.lng}">Google Maps</a> (${esc(bookingDetails.location)})\n\n` +
              `💵 <b>Total price:</b> ${bookingDetails.totalPrice.toLocaleString()} IDR\n` +
              `____________________________________\n` +
              `💳 <b>Payment method:</b> ${esc(bookingDetails.paymentMethod)}${bookingDetails.totalPriceDisplay && !bookingDetails.totalPriceDisplay.includes('IDR') ? ` - <b>${esc(bookingDetails.totalPriceDisplay)}</b>` : ''}\n` +
              `🪙 <b>Payment time:</b> ${paymentTime}\n` +
              `⚙️ <b>Payment status:</b> ${esc(bookingDetails.paymentStatus)}\n` +
              `____________________________________\n\n` +
              `Your order has been processed!\n\n` +
              `You'll receive photos of the bike and the courier's contact information shortly!\n` +
              `Expect delivery in no more than 4 hours.\n\n` +
              `If you have any questions or need to change your order, please contact us directly in this chat!\n\n` +
              `<b>Enjoy your trip!</b>`;
          }

          await fetch(tgUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: tgChatId,
              text: confirmMsg,
              parse_mode: "HTML",
            }),
          });

          // Send third message (internal search format)
          const thirdMsg = `I'm looking for ${bike.name} ${selectedColor || ""} color. No older than 3 years.\n` +
            `From ${bookingDetails.from} to ${bookingDetails.to} (${bookingDetails.days} days)\n` +
            `Location ${bookingDetails.selectedDistrict || bookingDetails.location}\n` +
            `Price: ${bookingDetails.totalPrice.toLocaleString()} IDR`;

          await fetch(tgUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: tgChatId,
              text: thirdMsg,
            }),
          });
        }
      } catch (tgError) {
        console.error("Error sending Telegram message:", tgError);
      }
    } else {
      console.warn("Telegram credentials missing (Token or Chat ID). Skipping Telegram notification.");
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

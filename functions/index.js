const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const TelegramBot = require("node-telegram-bot-api");

const cors = require("cors")({
    origin: ["https://metrage.pro", "http://localhost:5173"]
});

admin.initializeApp();

const gmailConfig = functions.config().gmail;
const telegramConfig = functions.config().telegram;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: gmailConfig.email,
    pass: gmailConfig.password,
  },
});

const bot = new TelegramBot(telegramConfig.token, { polling: false });
const chatId = telegramConfig.chatid;

exports.sendEmailAndTelegram = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send({ error: "Method Not Allowed" });
        }

        console.log("Request Body:", req.body);

        try {
            const {
                city, address, selectedType, date, urgent,
                selectedTimeInterval, distance, area, selectedOptions,
                clientName, clientPhone, clientEmail, managerEmail, comment, totalSum, firmName, managerPhone, selectedTime
            } = req.body;


            if (!city || !address || !selectedType || !date || !clientName || !clientPhone) {
                return res.status(400).send({ error: "Missing required fields" });
            }
            if (selectedType === 'Обмер' && (!area || area <= 0)) {
                return res.status(400).send({error: 'Area is required for "Обмер" type'});
            }
            if (city === "МО" && (!distance || distance <= 0)) {
                return res.status(400).send({ error: "Distance is required for city MO" })
            }
            if (urgent && !selectedTimeInterval) {
                return res.status(400).send({error: 'Time interval is required when "urgent" is true'})
            }
            if (['Квартира', 'Дом', 'Офис'].includes(selectedType)) {
                if (!selectedOptions || typeof selectedOptions !== 'object' || Object.keys(selectedOptions).length === 0 || !Object.values(selectedOptions).some(val => val > 0))
                {
                  return res.status(400).send({error: 'You must select at least one option!'})
                }
            }

            const orderNumber = `${new Date().getTime().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;
            const formattedDate = new Date(date || new Date()).toLocaleDateString('ru-RU');
            const selectedOptionsText =  Object.entries(selectedOptions)
                  .filter(([_, value]) => value > 0)
                  .map(([key, value]) => `${key}: ${value} шт.`)
                  .join('<br>');

            const timeIntervalText = urgent
                ? `Срочный выезд: Да<br>Тип интервала: ${
                    selectedTimeInterval === 'exact' ? 'Точно ко времени' :
                    selectedTimeInterval === '1h' ? 'Интервал 1 час' :
                    selectedTimeInterval === '4h' ? 'Интервал 4 часа' : 'К половине дня'
                  }<br>Выбранное время: ${selectedTimeInterval === 'exact' ? selectedTime : selectedTimeInterval}`
                : 'Нет';

            const adminMailOptions = {
                from: gmailConfig.email,
                to: 'dronikov93@gmail.com',  //  <-- USE YOUR ADMIN/NOTIFICATION EMAIL HERE
                subject: `Новая заявка #${orderNumber}: ${city}, ${address}`,
                html: `
                    <h2>Новая заявка на замер #${orderNumber}</h2>
                    <table style="border-collapse: collapse; width: 100%;">
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Город:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${city}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Адрес:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${address}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Тип замера:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${selectedType}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Дата:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${formattedDate}</td>
                      </tr>
                      ${selectedType === 'Обмер' ? `
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Площадь:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${area} м²</td>
                      </tr>
                      ` : `
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Выбранные помещения:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${selectedOptionsText}</td>
                      </tr>
                      `}
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Имя клиента:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${clientName || 'Не указано'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Телефон клиента:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${clientPhone || 'Не указан'}</td>
                      </tr>
                       <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email клиента:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${clientEmail || 'Не указан'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Удаленность от МКАД:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${distance || 'Не указано'} км</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Срочный выезд:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${timeIntervalText}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Название фирмы:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${firmName || 'Не указано'}</td>
                      </tr>
                       <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email менеджера:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${managerEmail|| 'Не указан'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Телефон менеджера:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${managerPhone || 'Не указан'}</td>
                      </tr>
                       ${comment ? `
                        <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Комментарий:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${comment}</td>
                      </tr>
                      `: ''}
                      <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Итоговая сумма:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${totalSum} ₽</td>
                      </tr>
                    </table>
                  `
            };

            const managerMailOptions = {
                from: gmailConfig.email,
                to: managerEmail,  // Send to manager's email
                subject: `Заявка #${orderNumber} назначена`,
                html: `<p>Здравствуйте!</p>
                    <p>Мы получили вашу заявку #${orderNumber} на замер.</p>
                    <p>Город: ${city}</p>
                    <p>Адрес: ${address}</p>
                    <p>Дата: ${formattedDate}</p>
                    <p>Тип замера: ${selectedType}</p>
                     ${selectedType === 'Обмер' ?
                      `<p>Площадь: ${area} м²</p>` :
                      `<p>Выбранные помещения:</p><p>${selectedOptionsText}</p>`
                      }
                      ${urgent ? `
                      <p>Срочный выезд</p>
                      <p>Интервал: ${selectedTimeInterval}</p>
                      ` : ''}
                    <p><strong>С клиентом свяжутся до 20:00 по МСК. Результаты замера будут отправлены на указанный email до 12:00 следующего дня после замера. Спасибо за ваш выбор, хорошего дня!</strong></p>`
              };
            const telegramMessage = `*New Order Request:*\n
                City: ${city}\n
                Address: ${address}\n
                Type: ${selectedType}\n
                Date: ${formattedDate}\n
                Urgent: ${urgent ? 'Да' : 'Нет'}\n
                Time Interval: ${urgent ? selectedTimeInterval : 'N/A'}\n
                Distance: ${distance}\n
                Area: ${area}\n
                Selected Options: ${JSON.stringify(selectedOptions)}\n
                Client Name: ${clientName}\n
                Client Phone: ${clientPhone}\n
                Client Email: ${clientEmail}\n
                Manager Email: ${managerEmail}\n
                Firm Name: ${firmName}\n
                Manager Phone: ${managerPhone}\n
                Comment: ${comment}\n
                Total Sum: ${totalSum}
            `;

            await Promise.all([
                transporter.sendMail(adminMailOptions)
                    .then(info => console.log("Admin email sent:", info.response))
                    .catch(error => console.error("Error sending admin email:", error)),
                transporter.sendMail(managerMailOptions)
                    .then(info => console.log("Manager email sent:", info.response))
                    .catch(error => console.error("Error sending manager email:", error)),
                bot.sendMessage(chatId, telegramMessage, { parse_mode: "Markdown" })
                    .then(message => console.log("Telegram message sent:", message.message_id))
                    .catch(error => console.error("Error sending Telegram message:", error))
            ]);

            res.status(200).send({ success: true, orderNumber });

        } catch (error) {
            console.error("Error sending email/telegram:", error);
            res.status(500).send({ success: false, error: error.message });
        }
    });
});
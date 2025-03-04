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


            if (!city || !address || !selectedType || !date || !clientPhone) {
                return res.status(400).send({ error: "Отсутствуют обязательные поля" });
            }
            if (selectedType === 'Обмер' && (!area || area <= 0)) {
                return res.status(400).send({error: 'Для типа "Обмер" требуется указать площадь'});
            }
            if (city === "МО" && (!distance || distance <= 0)) {
                return res.status(400).send({ error: "Для Московской области необходимо указать расстояние от МКАД" })
            }
            if (urgent && !selectedTimeInterval) {
                return res.status(400).send({error: 'При срочном выезде необходимо указать временной интервал'})
            }
            if (['Квартира', 'Дом', 'Офис'].includes(selectedType)) {
                if (!selectedOptions || typeof selectedOptions !== 'object' || Object.keys(selectedOptions).length === 0 || !Object.values(selectedOptions).some(val => val > 0))
                {
                  return res.status(400).send({error: 'Необходимо выбрать хотя бы одно помещение'})
                }
            }

            const orderNumber = `${new Date().getTime().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;
            const formattedDate = new Date(date || new Date()).toLocaleDateString('ru-RU');
            
            const selectedOptionsText = Object.entries(selectedOptions)
                  .filter(([_, value]) => value > 0)
                  .map(([key, value]) => `${key}: ${value} шт.`)
                  .join('<br>');
            
            const selectedOptionsTelegram = Object.entries(selectedOptions)
                  .filter(([_, value]) => value > 0)
                  .map(([key, value]) => `- ${key}: ${value} шт.`)
                  .join('\n');

            let timeIntervalText = 'Нет';
            
            if (urgent) {
                const intervalTypes = {
                    'exact': 'Точно ко времени',
                    '1h': 'Интервал 1 час',
                    '4h': 'Интервал 4 часа',
                    'half_day': 'К половине дня'
                };
                
                timeIntervalText = `Срочный выезд: Да<br>
                Тип интервала: ${intervalTypes[selectedTimeInterval] || selectedTimeInterval}<br>
                Выбранное время: ${selectedTime || 'Не указано'}`;
            }
            
            // Создаем универсальный HTML-шаблон, который будем использовать для всех писем
            const emailTemplate = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <div style="background-color: #06b6d4; padding: 20px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
                        <h2 style="margin: 0;">Заявка на замер #${orderNumber}</h2>
                    </div>
                    
                    <div style="padding: 20px; background-color: #f8fafc;">
                        <table style="border-collapse: collapse; width: 100%;">
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Город:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${city}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Адрес:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${address}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Тип замера:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${selectedType}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Дата:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${formattedDate}</td>
                            </tr>
                            ${selectedType === 'Обмер' ? `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Площадь:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${area} м²</td>
                            </tr>
                            ` : `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Выбранные помещения:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${selectedOptionsText}</td>
                            </tr>
                            `}
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Имя клиента:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${clientName || 'Не указано'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Телефон клиента:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${clientPhone || 'Не указан'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Email клиента:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${clientEmail || 'Не указан'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Удаленность от МКАД:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${distance || 'Не указано'} км</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Срочный выезд:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${timeIntervalText}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Название фирмы:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${firmName || 'Не указано'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Email менеджера:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${managerEmail || 'Не указан'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Телефон менеджера:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${managerPhone || 'Не указан'}</td>
                            </tr>
                            ${comment ? `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Комментарий:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${comment}</td>
                            </tr>
                            `: ''}
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd; background-color: #f1f5f9;"><strong>Итоговая сумма:</strong></td>
                                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #06b6d4;">${totalSum} ₽</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="padding: 20px; text-align: center; background-color: #e0f2fe; border-radius: 0 0 10px 10px;">
                        <p style="margin: 0; color: #0284c7;">С клиентом свяжутся до 20:00 по МСК. Результаты замера будут отправлены 
                        на указанный email до 12:00 следующего дня после замера.</p>
                    </div>
                </div>
            `;

            const adminMailOptions = {
                from: gmailConfig.email,
                to: 'dronikov93@gmail.com',
                subject: `Новая заявка #${orderNumber}: ${city}, ${address}`,
                html: emailTemplate
            };

            const managerMailOptions = {
                from: gmailConfig.email,
                to: managerEmail,
                subject: `Заявка #${orderNumber} назначена`,
                html: emailTemplate
            };
            
            // Создаем текст для Telegram на русском языке
            const telegramMessage = `
*НОВАЯ ЗАЯВКА #${orderNumber}*

📍 *ИНФОРМАЦИЯ О ЗАКАЗЕ:*
🏙️ Город: ${city}
🏠 Адрес: ${address}
📋 Тип замера: ${selectedType}
📅 Дата: ${formattedDate}
${urgent ? `⏱️ *Срочный выезд:* Да
⌚ Тип интервала: ${selectedTimeInterval === 'exact' ? 'Точно ко времени' :
                  selectedTimeInterval === '1h' ? 'Интервал 1 час' :
                  selectedTimeInterval === '4h' ? 'Интервал 4 часа' : 'К половине дня'}
🕒 Выбранное время: ${selectedTime || 'Не указано'}` : '⏱️ Срочный выезд: Нет'}
${distance ? `🚗 Расстояние от МКАД: ${distance} км` : ''}

${selectedType === 'Обмер' ? 
`📐 *Площадь:* ${area} м²` : 
`🚪 *Выбранные помещения:*
${selectedOptionsTelegram}`}

👤 *ИНФОРМАЦИЯ О КЛИЕНТЕ:*
👤 Имя: ${clientName || 'Не указано'}
📞 Телефон: ${clientPhone || 'Не указан'}
📧 Email: ${clientEmail || 'Не указан'}

🏢 *ИНФОРМАЦИЯ О МЕНЕДЖЕРЕ:*
🏢 Название фирмы: ${firmName || 'Не указано'}
📞 Телефон: ${managerPhone || 'Не указан'}
📧 Email: ${managerEmail || 'Не указан'}

${comment ? `💬 *Комментарий:* ${comment}` : ''}

💰 *Итого:* ${totalSum} ₽
`;

            await Promise.all([
                transporter.sendMail(adminMailOptions)
                    .then(info => console.log("Admin email sent:", info.response))
                    .catch(error => console.error("Error sending admin email:", error)),
                
                managerEmail ? transporter.sendMail(managerMailOptions)
                    .then(info => console.log("Manager email sent:", info.response))
                    .catch(error => console.error("Error sending manager email:", error)) : Promise.resolve(),
                
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
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require('cors')({ origin: 'https://metrage.pro' });

exports.sendOrderEmail = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
      try {
        const { 
          city, 
          address, 
          selectedType, 
          date,
          selectedOptions,
          area,
          clientName, 
          clientPhone,
          distance,
          urgent,
          selectedTimeInterval,
          selectedTime,
          managerEmail,
          managerPhone,
          comment,
          firmName,
          totalSum 
        } = req.body;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: functions.config().gmail.email,
            pass: functions.config().gmail.password
          },
        });

        const orderNumber = `${new Date().getTime().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;
        const formattedDate = new Date(date).toLocaleDateString('ru-RU');

        
        const selectedOptionsText = Object.entries(selectedOptions)
          .filter(([_, value]) => value > 0)
          .map(([key, value]) => `${key}: ${value} шт.`)
          .join('\n                <td style="padding: 8px; border: 1px solid #ddd;">');

        const timeIntervalText = urgent ? `
          Срочный выезд: Да
          Тип интервала: ${selectedTimeInterval === 'exact' ? 'Точно ко времени' : 
                          selectedTimeInterval === '1h' ? 'Интервал 1 час' :
                          selectedTimeInterval === '4h' ? 'Интервал 4 часа' : 'К половине дня'}
          Выбранное время: ${selectedTime}` : 'Нет';

        const adminMailOptions = {
          from: functions.config().gmail.email,
          to: 'dronikov93@gmail.com',
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
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Удаленность от МКАД:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${distance} км</td>
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
                <td style="padding: 8px; border: 1px solid #ddd;">${managerEmail}</td>
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
              ` : ''}
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Итоговая сумма:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${totalSum} ₽</td>
              </tr>
            </table>
          `
        };

        const managerMailOptions = {
          from: functions.config().gmail.email,
          to: managerEmail,
          subject: `Заявка #${orderNumber} назначена`,
          html: `
            <p>Здравствуйте!</p>
            <p>Мы получили вашу заявку #${orderNumber} на замер.</p>
            <p>Город: ${city}</p>
            <p>Адрес: ${address}</p>
            <p>Дата: ${formattedDate}</p>
            <p>Тип замера: ${selectedType}</p>
            ${selectedType === 'Обмер' ? 
              `<p>Площадь: ${area} м²</p>` : 
              `<p>Выбранные помещения:</p><p>${selectedOptionsText.replace(/\n/g, '<br>')}</p>`
            }
            ${urgent ? `
            <p>Срочный выезд</p>
            <p>Интервал: ${selectedTime}</p>
            ` : ''}
            <p><strong>С клиентом свяжутся до 20:00 по МСК.Результаты замера будут отправлены на указанный email до 12:00 следующего дня после замера. Спасибо за ваш выбор, хорошего дня!</strong></p>
          `
        };

        await Promise.all([
          transporter.sendMail(adminMailOptions),
          transporter.sendMail(managerMailOptions)
        ]);
        
        res.status(200).json({ 
          success: true, 
          message: "Заявка успешно отправлена",
          orderNumber
        });

      } catch (error) {
        console.error("Ошибка:", error);
        res.status(500).json({ 
          success: false, 
          error: error.message
        });
      }
    });
});
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const fs = require('fs');


// eslint-disable-next-line no-unused-vars

async function getQr(text) {
  return QRCode.toDataURL(text)
    .then(url => {
      return url;
    })
    .catch(err => {
      return err;
    });
}

module.exports = () => {
  return async context => {
    const qr = await getQr('https://danogips.ru/roadshow/admin#/members/' + context.result._id);
    console.log(qr);
    const base64Data = qr.replace(/^data:image\/png;base64,/, "");
    fs.writeFile('./public/qr/' + context.result._id + ".png", base64Data, 'base64', function(err) {
      console.log(err);
    });
    const region = await context.app.service('regions').get(context.result.region);
    console.log(region);

    const transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'Danogips.marketing@yandex.ru',
        pass: 'SuperDano16'
      }
    });

    const mailOptions = {
      from: 'Danogips.marketing@yandex.ru',
      to: context.result.email,
      subject: 'Road Show',
      // html: '<img src="' + qr + '" alt="" />'
      html: '<h2>Благодарим за регистрацию.</h2>' +
        '<p>Ваш билет на мероприятие:</p> <img src="https://roadshow.danogips.ru/qr/' + context.result._id + '.png" alt="" />' +
        '<p>Дата проведения: ' + region.date + '</p>' +
        '<p>'+ region.time +'</p>' +
        '<p>Место проведения: город '+ region.label +'</p>' +
        '<p>'+region.address+'</p>' +
        '<h2>Программа:</h2>' +
        '<p>09:30-10:00 – Сбор гостей</p>' +
        '<p>10:00-10:20 – Вступление</p>' +
        '<p>10:20-11:30 – Обзор продуктов Danogips Grunt и Danogips ProFinish Grey</p>' +
        '<p>11:30-12:10 – Нанесение валиком Danogips Jet9, выведение углов</p>' +
        '<p>12:10-12:50 – Приклеивание стеклохолста на Danogips SuperFinish</p>' +
        '<p>12:50-13:20 – Кофе-брейк</p>' +
        '<p>13:20-14:20 – Обзор продуктов Danogips Top и Danogips Jet5</p>' +
        '<p>14:20-14:40 – Презентация новинки Danogips UltraFinish</p>' +
        '<p>14:40-15:20 – Danogips ProSpray. Механизация строительных процессов</p>' +
        '<p>15:20 – Розыгрыш призов</p>' +
        '<img src="' + qr + '" alt="" />' +
        '<p>предьявите QR-код организаторам.</p>',

    };
    const mailOptions2 = {
      from: 'Danogips.marketing@yandex.ru',
      to: 'Chukhlantseva.Kseniia@danogips.ru',
      // html: '<img src="' + qr + '" alt="" />'
      subject: 'email from site',
      html: '<p>Новый участник</p>'+
            '<p>'+context.result.name+'</p>'+
            '<p>'+context.result.email+'</p>'+
            '<p>'+context.result.phone+'</p>'+
            '<p>город '+ region.label +'</p>',
    };
    transporter.sendMail(mailOptions2);
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return context;
  };
};

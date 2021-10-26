// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

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
    const qr = await getQr('https://danogips.ru/roadshow/admin/members/' + context.result._id);
    console.log(qr);

    const transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: {
        user: 'danoroadshow@yandex.ru',
        pass: 'sCZx$GdkvA#5b)#'
      }
    });

    const mailOptions = {
      from: 'danoroadshow@yandex.ru',
      to: context.result.email,
      subject: 'email from site',
      // html: '<img src="' + qr + '" alt="" />'
      html: '<p>Ваш билет на мероприятие</p> <img src="' + qr + '" alt="" />',

    };
    const mailOptions2 = {
      from: 'danoroadshow@yandex.ru',
      to: 'Chukhlantseva.Kseniia@danogips.ru',
      // html: '<img src="' + qr + '" alt="" />'
      subject: 'email from site',
      html: `<p>Новый участник</p>
            <p>context.result.name</p>
            <p>context.result.email</p>
            <p>context.result.phone</p>
            <p>context.result.region</p>`,
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

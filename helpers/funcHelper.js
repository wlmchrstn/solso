const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function token(n) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for(var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

const mail = (to, from, subject, html) => {
    const msg = {
        to: to,
        from: from,
        subject: subject,
        html: html
      };
    return sgMail.send(msg);
}

module.exports = { mail, token };

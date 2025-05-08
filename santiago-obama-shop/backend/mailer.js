const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sallashiobama@gmail.com',
    pass: 'TU_CONTRASEÑA_DE_APP'
  }
});

function sendOrderEmail(order) {
  const itemsText = order.items.map(i => `${i.name} - ${i.price} FCFA`).join('\n');
  const message = `
New order received:

Customer: ${order.name}
Phone: ${order.phone}
Address: ${order.address}

Items:
${itemsText}

Total: ${order.total} FCFA
`;

  const mailOptions = {
    from: 'sallashiobama@gmail.com',
    to: 'sallashiobama@gmail.com',
    subject: 'New Order from Santiago Obama Shop',
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.error('Email failed:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = sendOrderEmail;

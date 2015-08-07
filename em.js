var nodemailer = require("nodemailer");

var generator = require('xoauth2').createXOAuth2Generator({
    user: "sjb1970@gmail.com", // Your gmail address.

    clientId: "720736642590-gkluvm004jenimtoa50gi0t4660e34nq.apps.googleusercontent.com",
    clientSecret: "",
    refreshToken: "",
});



// listen for token updates
// you probably want to store these to a db
generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});


// login
var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        xoauth2: generator
    }
});


var mailOptions = {
    to: "sjb1970@gmail.com",
    subject: 'Hello ', // Subject line
    text: 'Hello world ', // plaintext body
    html: '<b>Hello world </b>' // html body
};


smtpTransport.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Message sent: ' + info.response);
  }
  smtpTransport.close();
});
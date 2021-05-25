const cors = require("cors");
const nodemailer = require('nodemailer');
const port = process.env.PORT || 700;
const express = require("express");
const app = express();

// Middleware
app.use(cors());

// Webhook handler
app.post("/", (req, res) => {
let body="";
req.on("data", (chunk) => {
body+=chunk;
});

// payload from Stream
req.on("end", async () => {
let parsedBody = JSON.parse(body);
if(parsedBody.message==undefined){ 
    return
}
// Here you can send an email, integrate an SMS service,
// or perform any other desired actions based on your Webhook events data
try {
    
    let email = parsedBody.message.text
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ryankavanaugh@getstream.io',
        // app password
        pass: 'gyna daem asst daek'
      }
    });

    let mailOptions = {
      from: 'ryankavanaugh@getstream.io',
      to: 'ryankavanaugh@getstream.io',
      subject: 'test',
      text: "Hi!" + "\n" + "You missed this message." + "\n \n"+ JSON.stringify(email)
    }
transporter.sendMail(mailOptions, function(error, info){
if (error) {
console.log(error);
} else {
console.log('Email sent: '+info.response);
}
});
} catch (error) {
console.log(error);
}
res.status(200).send("OK");
});
});

app.listen(port, () => {
console.log(`server running on port ${port}`);
});
const nodemailer = require('nodemailer');
async function sendEmail (email, otp,subject,text){
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port:465,
            secure:false,
            auth: {
               user:process.env.email,
               pass:process.env.email_password
            }
        });
        const mailOptions = {
            from: process.env.email,
            to: email,
            subject: subject || 'User details',
            text: text || `Share the use details`
        };

        await transport.sendMail(mailOptions);
        return true;
        } 

module.exports = sendEmail;
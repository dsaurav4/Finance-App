import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a nodemailer transporter using the Gmail SMTP server.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_EMAIL_PASSWORD,
  },
});

/**/
/*

NAME

        sendMail - Sends an email using the nodemailer transporter.

SYNOPSIS

        sendMail(to, subject, text, html)
              to --> The recipient's email address.
              subject --> The subject of the email.
              text --> The text content of the email.
              html --> The HTML content of the email.

DESCRIPTION

        The sendMail function sends an email using the nodemailer transporter by specifying the 
        recipient's email address, the subject of the email, the text content of the email, and 
        the HTML content of the email.

RETURNS

        Returns nothing.

*/
/**/
const sendMail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: " + error);
  }
};

export default sendMail;

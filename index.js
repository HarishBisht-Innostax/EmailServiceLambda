const amqp = require("amqplib");
const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async () => {
  const emailMessage_3bc4d90f_b1ba_407c_8210_43e0c0ec2b26 = {
    from: "hb20156@gmail.com",
    to: "hb20190@gmail.com",
    subject: "IMPORTANT!",
    html: `"<h1>Harish Bisht Tesing Lambda function</h1>"`,
  };

  const SendEmailMessage = {
    emailMessage: emailMessage_3bc4d90f_b1ba_407c_8210_43e0c0ec2b26,
  };

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const success = await transporter.sendMail(SendEmailMessage.emailMessage);
    console.log("success", success);

    return success?.response
      ? "Successfully sent email: Response: " + success?.response
      : "Unable to sent email";
  } catch (err) {
    return `Unable to sent email ${err}`;
  }
};

exports.handler = async (event) => {
  try {
    const bufferObj = Buffer.from(
      event.rmqMessagesByQueue["demo-queue::/"][0].data,
      "base64"
    );

    const messageData = JSON.parse(bufferObj.toString("utf8"));

    let result = {};

    const { num1, num2, operation } = messageData;

    switch (operation) {
      case "multiply":
        result = num1 * num2;
        break;

      case "sum":
        result = num1 + num2;
        break;

      default:
        result = 0;
        break;
    }

    const emailResponse = await sendEmail();

    const replyBackTo =
      event.rmqMessagesByQueue["demo-queue::/"][0].basicProperties.replyTo;
    const correlationId =
      event.rmqMessagesByQueue["demo-queue::/"][0].basicProperties
        .correlationId;

    const connection = await amqp.connect(process.env.RABBIT_URL);
    const channel = await connection.createChannel();

    channel.sendToQueue(
      replyBackTo,
      Buffer.from(JSON.stringify({ result, emailResponse })),
      { correlationId }
    );

    const response = {
      statusCode: 200,
      body: JSON.stringify({ result, emailResponse }),
    };
    return response;
  } catch (err) {
    console.log("Error sending email", err);
    throw new Error("Error sending email", err);
  }
};

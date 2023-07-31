const amqp = require("amqplib");
const nodemailer = require("nodemailer");
require("dotenv").config();

const EMAIL_QUEUE_KEY = "demo-queue::/";

const sendEmail = async (messageData) => {
  const { from, to, subject, html } = messageData;
  const emailMessage = { from, to, subject, html };

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const success = await transporter.sendMail(emailMessage);
    return success?.response
      ? "Successfully sent email: Response: " + success?.response
      : "Unable to sent email";
  } catch (err) {
    console.log("Unable to sent email", err);
    return `Unable to sent email ${err}`;
  }
};

exports.handler = async (event) => {
  try {
    const bufferObj = Buffer.from(
      event.rmqMessagesByQueue[EMAIL_QUEUE_KEY][0].data,
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

    const emailResponse = await sendEmail(messageData);

    const replyBackTo =
      event.rmqMessagesByQueue[EMAIL_QUEUE_KEY][0].basicProperties.replyTo;
    const correlationId =
      event.rmqMessagesByQueue[EMAIL_QUEUE_KEY][0].basicProperties
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
    console.log("Error executing Lambda", err);
    throw new Error("Error executing Lambda", err);
  }
};

const amqp = require("amqplib");
const nodemailer = require("nodemailer");
require("dotenv").config();

const EMAIL_QUEUE_KEY = "demo-queue::/";
const BASE_64 = "base64";

const sendEmail = async (messageData) => {
  const { from, to, subject, html } = messageData;
  const emailMessage = { from, to, subject, html };

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } =
    process.env;

  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      auth: { user: EMAIL_USERNAME, pass: EMAIL_PASSWORD },
    });

    const success = await transporter.sendMail(emailMessage);

    if (success?.response) return "Successfully sent email.";
    else throw new Error("Unable to send email.");
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Unable to send email.");
  }
};

exports.handler = async (event) => {
  try {
    const queueData = event.rmqMessagesByQueue[EMAIL_QUEUE_KEY][0];
    const bufferObj = Buffer.from(queueData.data, BASE_64);

    const messageData = JSON.parse(bufferObj.toString("utf8"));

    const emailResponse = await sendEmail(messageData);

    const basicProperties = queueData.basicProperties;

    const { correlationId, replyTo: replyBackTo } = basicProperties;

    const connection = await amqp.connect(process.env.RABBIT_URL);
    const channel = await connection.createChannel();

    channel.sendToQueue(
      replyBackTo,
      Buffer.from(JSON.stringify({ emailResponse })),
      { correlationId }
    );

    const response = {
      statusCode: 200,
      body: JSON.stringify({ emailResponse }),
    };
    return response;
  } catch (err) {
    console.log("Error executing Lambda", err);
    throw new Error("Error executing Lambda", err);
  }
};

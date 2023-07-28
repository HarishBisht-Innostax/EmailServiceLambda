const { Channel } = require("amqplib");
const MessageHandler = require("../messageHandler");

class Consumer {
  constructor(channel, rpcQueue) {
    this.channel = channel;
    this.rpcQueue = rpcQueue;
  }

  async consumeMessages(RabbitMQClient) {
    console.log("Ready to consume messages...");

    this.channel.consume(
      this.rpcQueue,
      async (message) => {
        const { correlationId, replyTo } = message.properties;
        const operation = message.properties.headers.function;
        if (!correlationId || !replyTo) {
          console.log("Missing some properties...");
        }
        console.log("Consumed", JSON.parse(message.content.toString()));
        await MessageHandler.handle(
          RabbitMQClient,
          operation,
          JSON.parse(message.content.toString()),
          correlationId,
          replyTo
        );
      },
      {
        noAck: true,
      }
    );
  }
}

module.exports = Consumer;

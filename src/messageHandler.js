// const RabbitMQClient = require("./rabbitmq/client");

class MessageHandler {
  static async handle(RabbitMQClient, operation, data, correlationId, replyTo) {
    let response = {};

    const { num1, num2 } = data;

    console.log("The operation is", operation);

    switch (operation) {
      case "multiply":
        response = num1 * num2;
        break;

      case "sum":
        response = num1 + num2;
        break;

      default:
        response = 0;
        break;
    }

    console.log("Response", response);

    // Produce the response back to the client
    await RabbitMQClient.produce(response, correlationId, replyTo);
  }
}

module.exports = MessageHandler;

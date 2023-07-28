const { Channel, Connection, connect } = require("amqplib");
const config = require("../config");
const Consumer = require("./consumer");
const Producer = require("./producer");

class RabbitMQClient {
  constructor() {
    this.isInitialized = false;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQClient();
    }
    return this.instance;
  }

  async initialize() {
    console.log("Rabbit Mq Initializing");
    if (this.isInitialized) {
      return;
    }
    try {
      this.connection = await connect(config.rabbitMQ.url);

      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      const { queue: rpcQueue } = await this.consumerChannel.assertQueue(
        config.rabbitMQ.queues.rpcQueue,
        { exclusive: true }
      );

      this.producer = new Producer(this.producerChannel);
      this.consumer = new Consumer(this.consumerChannel, rpcQueue);

      this.consumer.consumeMessages(this);

      this.isInitialized = true;
    } catch (error) {
      console.log("rabbitmq error...", error);
    }
  }

  async produce(data, correlationId, replyToQueue) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.producer.produceMessages(
      data,
      correlationId,
      replyToQueue
    );
  }
}

module.exports = RabbitMQClient.getInstance();

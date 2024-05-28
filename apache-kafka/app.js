const { Kafka } = require('kafkajs');
const orders = require('../orders');
const { pause } = require('../helpers');

const kafka = new Kafka({
  clientId: 'order-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'order-group' });

const topic = 'orderTopic';

(async () => {
  await producer.connect();
  console.info('Producer connected successfully!');

  await consumer.connect();
  console.info('Consumer connected successfully!');

  await consumer.subscribe({ topic, fromBeginning: true });
  console.info(`Subscribed to ${topic}`);
  await createOrders();

  await processOrders();
})();

const createOrders = async () => {
  for (const order of orders) {
    console.log(` [x] ${order.product} order received from ${order.customer}`);
    await producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(order) }],
    });
    await pause(1000);
  }
};

const processOrders = async () => {
  await consumer
    .run({
      eachMessage: async ({ topic, partition, message }) => {
        const parsedOrder = JSON.parse(message.value.toString());
        console.log(` [x] The order was completed and delivered to ${parsedOrder.customer}`);
        await pause(3000);
      },
    })
    .then(async () => {
      await producer.disconnect();
      await consumer.disconnect();
      console.info('Kafka connection closed, all tasks completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error processing orders', err);
      process.exit(1);
    });
};

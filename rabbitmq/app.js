const amqp = require('amqplib');
const orders = require('../orders');
const {pause} = require('../helpers');

const queueName = 'orderQueue';
const amqpUrl = 'amqp://localhost';

let channel;

amqp.connect(amqpUrl).then(async (connection) => {
    channel = await connection.createChannel();
    await channel.assertQueue(queueName, {durable: true});

    console.info('RabbitMQ connected successfully!');
    await createOrders();
    await processOrders();

    await channel.close();
    await connection.close();
    console.info('RabbitMQ connection closed, all tasks completed.');
    process.exit(0);
}).catch((err) => {
    console.error('RabbitMQ connection error', err);
    if (channel) channel.close();
    process.exit(1);
});

const createOrders = async () => {
    for (const order of orders) {
        console.log(` [x] ${order.product} order received from ${order.customer}`);
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(order)), {persistent: true});
        await pause(1000);
    }
};

const processOrders = async () => {
    while (true) {
        const msg = await channel.get(queueName, {noAck: false});
        if (msg) {
            const parsedOrder = JSON.parse(msg.content.toString());
            console.log(` [x] The order was completed and delivered to ${parsedOrder.customer}`);
            channel.ack(msg);
            await pause(3000);
        } else {
            console.log('No orders left');
            break;
        }
    }
};
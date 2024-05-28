const redis = require('redis');
const orders = require('../orders');
const { pause } = require('../helpers');

const queueName = 'orderQueue';

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

(async () => {
  await redisClient.connect();
  console.info('Redis connected successfully!');
  await createOrders();
  await processOrders();
  await redisClient.quit();
  process.exit(0);
})().catch((err) => {
  console.error('Redis connection error', err);
  redisClient.quit();
  process.exit(1);
});

const createOrders = async () => {
  for (const order of orders) {
    console.log(` [x] ${order.product} order received from ${order.customer}`);
    await redisClient.rPush(queueName, JSON.stringify(order));
    await pause(1000);
  }
};

const processOrders = async () => {
  while (true) {
    const order = await redisClient.lPop(queueName);
    if (order) {
      const parsedOrder = JSON.parse(order);
      console.log(` [x] The order was completed and delivered to ${parsedOrder.customer}`);
      await pause(3000);
    } else {
      console.log('No orders left');
      break;
    }
  }
};

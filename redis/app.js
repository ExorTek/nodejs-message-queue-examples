const express = require('express');
const app = express();
const redis = require('redis');

const queueName = 'redisQueue';

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

redisClient.connect().then(() => {
    console.log('Redis connected');
}).catch((err) => {
    console.error('Redis connection error', err);

});


app.get('/send', async (req, res) => {
    const message = 'Hello Redis! This is a message from the sender!';
    await redisClient.rPush(queueName, message);
    console.log(' [x] Sent message: ', message);
    res.send('Message sent')
});

app.get('/receive', async (req, res) => {
    const message = await redisClient.lPop(queueName);
    if (message) {
        console.log(' [x] Received message: ', message);
        res.send('Message received');
    } else {
        console.log('No messages available');
        res.send('No messages available');
    }
});

app.listen(5001, () => {
    console.info(`Server started http://localhost:5001`)
});
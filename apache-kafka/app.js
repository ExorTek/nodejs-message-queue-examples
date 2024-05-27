const express = require('express');
const app = express();
const {
    Kafka
} = require('kafkajs');

const config = {
    groupId: 'my-group',
    topic: 'test-topic',
    brokers: ['localhost:9092'],
    clientId: 'my-app'
}

const kafka = new Kafka({
    clientId: config.clientId,
    brokers: config.brokers
});

const producer = kafka.producer();

const consumer = kafka.consumer({
    groupId: config.groupId
});

const run = async () => {
    await producer.connect().then(() => {
        console.log('Producer connected');
    });
    await consumer.connect().then(() => {
        console.log('Consumer connected');
    });
    await consumer.subscribe({
        topic: config.topic,
        fromBeginning: true
    }).then(() => {
        console.log('Consumer subscribed');
    });

    await consumer.run({
        eachMessage: async ({
                                topic,
                                partition,
                                message
                            }) => {
            console.log(' [x] Received message: ', message.value.toString());
        },
    });
}

run()

app.get('/send', async (req, res) => {
    const message = 'Hello Apache Kafka! This is a message from the sender!';
    await producer.send({
        topic: config.topic,
        messages: [{
            value: message
        }],
    });
    console.log(' [x] Sent message: ', message);
    res.send('Message sent');
});


app.listen(5001, () => {
    console.info(`Server started http://localhost:5001`)
});
const express = require('express');
const app = express();
const amqp = require('amqplib/callback_api');

let channel = null;
const queue = 'hello';
amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, ch) => {
        if (error1) {
            throw error1;
        }
        channel = ch;
        channel.assertQueue(queue, {
            durable: false
        }, (error2, ok) => {
            if (error2) {
                throw error2;
            }
            console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
            channel.consume(queue, (msg) => {
                    console.log(" [x] Received %s", msg.content.toString());
                }, {
                    noAck: true
                }
            );
        });
    });
});


app.get('/send', (req, res) => {
    const msg = 'Hello World! This is a message from the sender!';
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
    res.send('Message sent');
});


app.listen(5001, () => {
    console.info(`Server started http://localhost:5001`)
});
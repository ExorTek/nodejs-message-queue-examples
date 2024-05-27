const express = require('express');
const app = express();
const {SQSClient, SendMessageCommand, ReceiveMessageCommand} = require('@aws-sdk/client-sqs');


const config = {
    region: 'eu-west-1',
    accessKeyId: 'accessKeyId',
    secretAccessKey:'secretAccessKey',
    queueUrl: 'https://sqs.eu-west-1.amazonaws.com/123456789012/MyQueue'
}


const sqsClient = new SQSClient({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

app.get('/send', async (req, res) => {
    const message = 'Hello AWS SQS! This is a message from the sender!';
    const params = {
        QueueUrl: config.queueUrl,
        MessageBody: message
    };
    await sqsClient.send(new SendMessageCommand(params));
    console.log(' [x] Sent message: ', message);
    res.send('Message sent');
});

app.get('/receive', async (req, res) => {
        const params = {
            QueueUrl: config.queueUrl,
            MaxNumberOfMessages: 1
        };
        const data = await sqsClient.send(new ReceiveMessageCommand(params));
        if (data.Messages) {
            console.log(' [x] Received message: ', data.Messages[0].Body);
            res.send(data.Messages[0].Body);
        } else {
            console.log('No messages available');
            res.send('No messages available');
        }
    }
);

app.listen(5001, () => {
    console.info(`Server started http://localhost:5001`)
});
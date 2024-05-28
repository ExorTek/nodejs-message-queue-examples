const {SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand} = require('@aws-sdk/client-sqs');
const orders = require('../orders');
const {pause} = require('../helpers');

const region = 'YOUR_REGION';
const config = {
    region: region,
    credentials: {
        accessKeyId: 'YOUR_ACCESS_KEY_ID',
        secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
    },
    messageGroupId: 'ORDER_GROUP_ID',
    queueUrl: `https://sqs.${region}.amazonaws.com/ACCOUNT_ID/ORDER_QUEUE_NAME`
}

const sqsClient = new SQSClient({
    region: config.region,
    credentials: config.credentials
});

const createOrders = async () => {
    for (const order of orders) {
        console.log(` [x] ${order.product} order received from ${order.customer}`);

        const params = {
            QueueUrl: config.queueUrl,
            MessageBody: JSON.stringify(order),
            DelaySeconds: 0,
            MessageDeduplicationId: order.id.toString(),
            MessageGroupId: config.messageGroupId
        };

        await sqsClient.send(new SendMessageCommand(params));

        await pause(1000);
    }
};

const processOrders = async () => {
    while (true) {
        const params = {
            QueueUrl: config.queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 10
        };

        const data = await sqsClient.send(new ReceiveMessageCommand(params));

        if (data.Messages && data.Messages.length > 0) {
            const message = data.Messages[0];
            const parsedOrder = JSON.parse(message.Body);
            console.log(` [x] The order was completed and delivered to ${parsedOrder.customer}`);

            const deleteParams = {
                QueueUrl: config.queueUrl,
                ReceiptHandle: message.ReceiptHandle
            };
            await sqsClient.send(new DeleteMessageCommand(deleteParams));

            await pause(3000);
        } else {
            console.log('No orders left');
            break;
        }
    }
};

(async () => {
    console.info('AWS SQS connected successfully!');
    await createOrders();
    await processOrders();
    console.info('AWS SQS tasks completed.');
    process.exit(0);
})();
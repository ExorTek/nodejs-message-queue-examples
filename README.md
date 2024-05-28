## Node.js Message Queue Examples

This repository provides simple examples of using message queues in Node.js with various message brokers, including
RabbitMQ, Apache Kafka, AWS SQS, and Redis.

### How to Run the Examples

Follow these steps to run the examples:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ExorTek/nodejs-message-queue-examples.git
   cd nodejs-message-queue-examples
   ```
2. **Install the dependencies:**
   ```bash
    npm install
    ```
   OR
    ```bash
     yarn install
     ```
3. **Run the examples:**
    ```bash
    npm run start:rabbitmq
    ```
    ```bash
    npm run start:kafka
    ```
    ```bash
    npm run start:sqs
    ```
    ```bash
    npm run start:redis
    ```
   OR
    ```bash
    yarn start:rabbitmq
    ```
    ```bash
    yarn start:kafka
    ```
    ```bash
    yarn start:sqs
    ```
    ```bash
    yarn start:redis
    ```

### Using Docker Compose

#### RabbitMQ

1. Navigate to the `rabbitmq` directory:
   ```bash
   cd rabbitmq
   ```
2. Start the RabbitMQ container:
   ```bash
    docker-compose up
    ```

#### Apache Kafka

1. Navigate to the `kafka` directory:
   ```bash
   cd apache-kafka
   ```
2. Start the Apache Kafka container:
   ```bash
    docker-compose up
    ```

#### Redis

1. Navigate to the `redis` directory:
   ```bash
   cd redis
   ```
2. Start the Redis container:
   ```bash
    docker-compose up
    ```

### AWS SQS Setup
For AWS SQS, ensure that you have your AWS credentials configured. You can use the AWS CLI to configure your credentials:
```bash
aws configure
```
The `aws configure` command will prompt you to enter your AWS Access Key ID, Secret Access Key, region, and output format. Make sure to use the same region where your SQS queue is located.

### Creating the SQS Queue
To create an SQS queue, you can use the AWS Management Console or the AWS CLI. For example, to create a FIFO queue using the AWS CLI, run:
```bash
aws sqs create-queue --queue-name orderQueue.fifo --attributes FifoQueue=true
```

### Notes
- Ensure that you have Docker and Docker Compose installed on your machine to use the Docker setup.
- The examples assume that you have the necessary permissions and resources configured for each message broker.
- If you encounter any issues, please check the respective message broker's documentation or raise an issue in this repository.

const { Consumer } = require('sqs-consumer');
const { SQSClient } = require('@aws-sdk/client-sqs');
require('dotenv').config();

const scrapePage = require('./cluster.js');

const app = Consumer.create({
  queueUrl: process.env.SQS_URL,
  handleMessage: async (message) => {
    console.log('Message', message);
    scrapePage(message.Body);
  },
  sqs: new SQSClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  })
});

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.on('timeout_error', (err) => {
  console.error(err.message);
});

app.start();
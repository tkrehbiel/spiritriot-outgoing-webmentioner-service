import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

async function deleteMessage(queueName, receipt) {
  if (!queueName) return;
  const command = new DeleteMessageCommand({
    QueueUrl: queueName,
    ReceiptHandle: receipt,
  });
  return sqsClient.send(command);
}

async function process(message) {
  console.log("outgoing webmentions for:", JSON.stringify(message, body));
  deleteMessage(process.env.INCOMING_QUEUE, message.receiptHandle);
}

export async function handler(event, context) {
  for (const message of event.Records) {
    await process(message);
  }
}

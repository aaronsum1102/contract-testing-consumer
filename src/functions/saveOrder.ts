import { SQSHandler } from "aws-lambda";
import lambdaLog from "lambda-log";

interface Order {
  order_id: string;
  status: string;
}

export const saveOrder = (order: Order): Order => {
  const { order_id, status } = order;

  if (!order_id) {
    throw Error('The parameter "order_id" is required.');
  }

  if (!status) {
    throw Error('The parameter "status" is required.');
  }

  return order;
};

export const handler: SQSHandler = async (event) => {
  lambdaLog.info("Save order event", { event });

  try {
    for (const record of event.Records) {
      const recordBody = JSON.parse(record.body);
      const order = saveOrder(JSON.parse(recordBody.Message));
      lambdaLog.info("OrderSaved", { order });
    }
  } catch (error) {
    lambdaLog.error("Failed to handle save order event", { error });
  }
};

import lambdaLog from "lambda-log";

interface Person {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

export const processEvent = (data: Person): Person => {
  const { firstName, lastName } = data;

  if (!firstName) {
    throw Error('The parameter "firstName" is required.');
  }

  if (!lastName) {
    throw Error('The parameter "lastName" is required.');
  }

  return data;
};

export const handler = async (event) => {
  lambdaLog.info("lambda handler", { event });

  try {
    const message = JSON.parse(event.Records[0].Sns.Message);
    lambdaLog.debug("Handle message", { message });
    const result = processEvent(message);
    lambdaLog.info("Person created", { result });
  } catch (error) {
    const e = error as Error;
    lambdaLog.error("Fail to create Person", {
      error: {
        ...e,
        name: e.name,
        message: e.message,
        stack: e.stack,
      },
    });
  }
};

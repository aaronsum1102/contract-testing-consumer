import { SQSHandler } from "aws-lambda";
import lambdaLog from "lambda-log";

interface Person {
  firstName: string;
  lastName: string;
  fullName: string;
  age: number;
}

export const savePerson = (data: Person): Person => {
  const { firstName, lastName, age } = data;

  if (!firstName) {
    throw Error('The parameter "firstName" is required.');
  }

  if (!lastName) {
    throw Error('The parameter "lastName" is required.');
  }

  if (!age) {
    throw Error('The parameter "age" is required.');
  }

  return {
    ...data,
    fullName: `${firstName} ${lastName}`,
  };
};

export const handler: SQSHandler = async (event) => {
  lambdaLog.info("Save person event", { event });

  try {
    for (const record of event.Records) {
      const recordBody = JSON.parse(record.body);
      const person = savePerson(JSON.parse(recordBody.Message));
      lambdaLog.info("Person ", { person });
    }
  } catch (error) {
    lambdaLog.error("Failed to handle save person event", { error });
  }
};

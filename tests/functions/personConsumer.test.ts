import { processEvent } from "../../src/functions/personConsumer";
import {
  MessageConsumerPact,
  synchronousBodyHandler,
} from "@pact-foundation/pact";
import { like, email } from "@pact-foundation/pact/src/dsl/matchers";
import path from "path";

describe("Consumer event handler test", () => {
  const messagePact = new MessageConsumerPact({
    consumer: "person-consumer",
    dir: path.resolve(process.cwd(), "pacts"),
    pactfileWriteMode: "update",
    provider: "person-provider",
    logLevel: "info",
  });

  it("Accep a valid person", async () => {
    await expect(
      messagePact
        .expectsToReceive("A request for person")
        .withContent({
          firstName: like("Test"),
          lastName: like("Testsson"),
          fullName: like("Test Testsson"),
          age: like(21),
          email: email("test.testsson@test.com"),
        })
        .withMetadata({
          "content-type": "application/json",
        })
        .verify(synchronousBodyHandler(processEvent))
    ).resolves.not.toThrow();
  });

  it("Expect to throw error", async () => {
    const expectedError = 'The parameter "lastName" is required.';
    await expect(
      messagePact
        .expectsToReceive("A request for person")
        .withContent({
          firstName: like("Test"),
        })
        .withMetadata({
          "content-type": "application/json",
        })
        .verify(synchronousBodyHandler(processEvent))
    ).rejects.toThrow(expectedError);
  });
});

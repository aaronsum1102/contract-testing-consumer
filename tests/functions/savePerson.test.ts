import { savePerson } from "../../src/functions/savePerson";
import {
  MessageConsumerPact,
  synchronousBodyHandler,
} from "@pact-foundation/pact";
import { like, term } from "@pact-foundation/pact/src/dsl/matchers";
import path from "path";

describe("Consumer event handler test", () => {
  const messagePact = new MessageConsumerPact({
    consumer: "contract-testing-save-person",
    provider: "person-provider",
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "info",
  });

  it("Save valid Person data", async () => {
    await expect(
      messagePact
        .expectsToReceive("A request for person")
        .withContent({
          firstName: like("Test"),
          lastName: like("Testsson"),
          age: like(21),
        })
        .withMetadata({
          "content-type": "application/json",
        })
        .verify(synchronousBodyHandler(savePerson))
    ).resolves.not.toThrow();
  });
});

import { saveOrder } from "../../src/functions/saveOrder";
import {
  MessageConsumerPact,
  synchronousBodyHandler,
} from "@pact-foundation/pact";
import { like, term } from "@pact-foundation/pact/src/dsl/matchers";
import path from "path";

describe("Consumer event handler test", () => {
  const messagePact = new MessageConsumerPact({
    consumer: "contract-testing-save-order",
    provider: "order-event-provider",
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "info",
  });

  it("Save valid order", async () => {
    await expect(
      messagePact
        .expectsToReceive("A valid order")
        .withContent({
          order_id: like("12344"),
          status: term({
            generate: "pending",
            matcher: "^(pending|delivery_planning)$",
          }),
        })
        .withMetadata({
          "content-type": "application/json",
        })
        .verify(synchronousBodyHandler(saveOrder))
    ).resolves.not.toThrow();
  });
});

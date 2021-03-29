PACTICIPANT := "person-consumer"
PACT_CLI="docker run --rm -v ${PWD}:${PWD} -e PACT_BROKER_BASE_URL -e PACT_BROKER_TOKEN pactfoundation/pact-cli:latest"

ci: test can_i_deploy

fake_ci: .env
		@CI=true \
		COMMIT_HASH=`git rev-parse --short HEAD` \
		make ci

publish_pacts: .env
	@echo "\n========== STAGE: publish pacts ==========\n"
	@"${PACT_CLI}" publish ${PWD}/pacts --consumer-app-version ${COMMIT_HASH} --tag ${DEPLOY_TARGET}

test: .env
		@echo "\n========== STAGE: test (pact) ==========\n"
		yarn run test

can_i_deploy: .env
		@echo "\n========== STAGE: can-i-deploy? ==========\n"
		@"${PACT_CLI}" broker can-i-deploy \
		  --pacticipant ${PACTICIPANT} \
		  --version ${COMMIT_HASH} \
		  --to ${DEPLOY_TARGET} \
		  --retry-while-unknown 0 \
		  --retry-interval 10

.env:
	touch .env

output:
	mkdir -p ./pacts
	touch ./pacts/tmp

clean: output
	rm pacts/*
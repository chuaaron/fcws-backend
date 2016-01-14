TESTS = $(shell find test -type f -name "*.test.js")
NPM_REGISTRY = "--registry=https://registry.npm.taobao.org"
TEST_TIMEOUT = 5000
MOCHA_REPORTER = spec

install:
	@npm install $(NPM_REGISTRY)

test: install
	@NODE_ENV=test PORT=9807 ./node_modules/.bin/mocha \
		--reporter $(MOCHA_REPORTER) \
		-r should \
		--timeout $(TEST_TIMEOUT) \
		$(TESTS)

test-cov cov: install
	@NODE_ENV=test PORT=9807 node \
		node_modules/.bin/istanbul cover --preserve-comments \
		./node_modules/.bin/_mocha \
		-- \
		-r should \
		--reporter $(MOCHA_REPORTER) \
		--timeout $(TEST_TIMEOUT) \
		$(TESTS)
run:
	@nodemon ./bin/www

start: install
	@NODE_ENV=production nohup pm2 start ./bin/www -i 0 --name "fcws" >> fcws.log 2>&1 &

restart: install
	@NODE_ENV=production nohup pm2 restart "fcws" >> fcws.log 2>&1 &

.PHONY: install test run start restart

DIR?=${CURDIR}

all:
	echo 1

deploy:
	git release
	git flush
	npm publish

run-test:
	docker run --rm -v ${DIR}:/usr/src/app agregad/node babel-node ./node_modules/mocha/bin/_mocha test/

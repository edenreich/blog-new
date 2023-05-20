
ENVIRONMENT ?= development

help:
	@echo "Usage:"
	@echo " make <target>\n"
	@echo "Targets:"
	@echo " help       show this help"
	@echo " dev        run the application in development mode"
	@echo " lint       lint the application"
	@echo " build      build the application"
	@echo " package    package the application as container image"
	@echo " clean      clean the application"

default: help

.docker:
	@which docker > /dev/null || (echo "docker is not installed" && exit 1)

.npm:
	@which npm > /dev/null || (echo "npm is not installed" && exit 1)

.nodejs:
	@which node > /dev/null || (echo "node is not installed" && exit 1)

.version-required:
	@node --version | grep -q "v16.20.0" || (echo "node version is not v16.20.0" && exit 1)

.PHONY: dev
dev: .npm .nodejs .version-required
	npm run dev

.PHONY: lint
lint: .npm .nodejs .version-required
	npm run lint

.PHONY: build
build: .npm .nodejs .version-required
	npm run build

.PHONY: package
package: .docker
	docker build -t blog --target $(ENVIRONMENT) .

.PHONY: clean
clean:
	rm -rf .next
	rm -rf out

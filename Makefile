
TAG ?= latest

help:
	@echo "Usage:"
	@echo " make <target>\n"
	@echo "Targets:"
	@echo " help       show this help"
	@echo " dev        run the application in development mode"
	@echo " lint       lint the application"
	@echo " build      build the application"
	@echo " package    package the application as container image"
	@echo " push       push the application as container image to a registry"
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
	docker build \
		-t ghcr.io/blog-frontend:latest \
		-t ghcr.io/blog-frontend:${TAG} \
		--cache-from ghcr.io/blog-frontend:latest .

.PHONY: push
push: .docker
	docker push ghcr.io/blog-frontend:latest
	docker push ghcr.io/blog-frontend:${TAG}

.PHONY: clean
clean:
	rm -rf .next
	rm -rf out

IMAGE?=jfrog/jfrog-docker-desktop-extension

BUILDER=buildx-multi-arch

build-extension: ## Build service image to be deployed as a desktop extension
	docker build --tag=$(IMAGE) .

install-extension: ## installs the extension on docker desktop with the local image
	yes | docker extension install $(IMAGE)

update: ## update the extension locally to include new changes
	docker build --tag=$(IMAGE) . && yes | docker extension update $(IMAGE)

debug: ## opens the devtools tab
	docker extension dev debug $(IMAGE)

stop-debug: ## closes devtools tab
	docker extension dev reset $(IMAGE)

prepare-buildx: ## Create buildx builder for multi-arch build, if not exists
	docker buildx inspect $(BUILDER) || docker buildx create --name=$(BUILDER) --driver=docker-container --driver-opt=network=host

push-extension: prepare-buildx ## Build & upload extension image to hub. Do not push if tag already exists.
	docker pull $(IMAGE):$(tag) && echo "Failure: Tag already exists" || docker buildx build --push --builder=$(BUILDER) --platform=linux/amd64,linux/arm64 --build-arg TAG=$(tag) --tag=$(IMAGE):$(tag) .

# Build & upload extension image to hub with the given tag and the 'latest' tag.
# Usage: make release tag=0.1
release: prepare-buildx ## Build & upload extension image to hub with the given tag and the 'latest' tag.
	docker pull $(IMAGE):$(tag) && echo "Failure: Tag already exists" || docker buildx build --push --builder=$(BUILDER) --platform=linux/amd64,linux/arm64 --tag=$(IMAGE):$(tag) --tag=$(IMAGE):latest .
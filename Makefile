IMAGE?=jfrog/jfrog-docker-desktop-extension

BUILDER=buildx-multi-arch

extension: ## Build service image to be deployed as a desktop extension
	docker build --tag=$(IMAGE) .

prepare-buildx: ## Create buildx builder for multi-arch build, if not exists
	docker buildx inspect $(BUILDER) || docker buildx create --name=$(BUILDER) --driver=docker-container --driver-opt=network=host

push-extension: prepare-buildx ## Build & Upload extension image to hub. Do not push if tag already exists: make push-extension tag=0.1
	docker pull $(IMAGE):$(tag) && echo "Failure: Tag already exists" || docker buildx build --push --builder=$(BUILDER) --platform=linux/amd64,linux/arm64 --build-arg TAG=${tag)} --tag=$(IMAGE):$(tag) .

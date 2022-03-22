FROM ubuntu:focal AS client-builder
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g yarn
WORKDIR /binaries
RUN curl -XGET "https://releases.jfrog.io/artifactory/jfrog-cli/v2-jf/[RELEASE]/jfrog-cli-mac-386/jf" -L -k -g > jf-darwin
RUN chmod +x jf-darwin
RUN curl -XGET "https://releases.jfrog.io/artifactory/jfrog-cli/v2-jf/[RELEASE]/jfrog-cli-windows-amd64/jf.exe" -L -k -g > jf-windows.exe
RUN chmod +x jf-windows.exe
RUN curl -XGET "https://releases.jfrog.io/artifactory/jfrog-cli/v2-jf/[RELEASE]/jfrog-cli-linux-amd64/jf" -L -k -g > jf-linux
RUN chmod +x jf-linux
WORKDIR /app/client
# cache packages in layer
COPY client/package.json /app/client/package.json
COPY client/yarn.lock /app/client/yarn.lock
ARG TARGETARCH
RUN yarn config set cache-folder /usr/local/share/.cache/yarn-${TARGETARCH}
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn-${TARGETARCH} yarn
# install
COPY client /app/client
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn-${TARGETARCH} yarn build

FROM alpine:3.15

LABEL org.opencontainers.image.title="JFrog Docker Desktop Extension" \
    org.opencontainers.image.description="Scan your Docker images for vulnerabilities with JFrog Xray." \
    org.opencontainers.image.vendor="JFrog" \
    com.docker.desktop.extension.api.version="0.0.1"

COPY --from=client-builder /app/client/build ui
COPY icon.svg .
COPY metadata.json .
VOLUME /config
COPY binaries ./binaries
COPY --from=client-builder binaries/jf-darwin binaries/darwin/jf
COPY --from=client-builder binaries/jf-windows.exe binaries/windows/jf.exe
COPY --from=client-builder binaries/jf-linux binaries/linux/jf

CMD [ "sleep", "infinity" ]

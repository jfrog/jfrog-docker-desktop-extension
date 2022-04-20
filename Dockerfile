FROM ubuntu:focal AS client-builder
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g yarn
WORKDIR /host
ARG jfrogCliVersion=2.16.0
ARG TARGETARCH
RUN curl -XGET "https://releases.jfrog.io/artifactory/jfrog-cli/v2-jf/$jfrogCliVersion/jfrog-cli-mac-386/jf" -L -k -g > jf-darwin
RUN chmod +x jf-darwin
RUN curl -XGET "https://releases.jfrog.io/artifactory/jfrog-cli/v2-jf/$jfrogCliVersion/jfrog-cli-windows-amd64/jf.exe" -L -k -g > jf-windows.exe
RUN chmod +x jf-windows.exe
RUN if [ "$TARGETARCH" = "arm64" ]; then \
    curl -XGET "https://releases.jfrog.io/artifactory/jfrog-cli/v2-jf/$jfrogCliVersion/jfrog-cli-linux-arm64/jf" -L -k -g > jf-linux; \
  else \
    curl -XGET "https://releases.jfrog.io/artifactory/jfrog-cli/v2-jf/$jfrogCliVersion/jfrog-cli-linux-amd64/jf" -L -k -g > jf-linux; \
  fi
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

LABEL org.opencontainers.image.title="JFrog" \
    org.opencontainers.image.description="Scan your Docker images for vulnerabilities with JFrog Xray." \
    org.opencontainers.image.vendor="JFrog Ltd." \
    com.docker.desktop.extension.api.version=">=0.2.0" \
    com.docker.desktop.extension.icon="https://media.jfrog.com/wp-content/uploads/2022/02/04003536/JFrog_Logo_partner_isv.svg" \
    com.docker.extension.publisher-url="https://jfrog.com"

COPY --from=client-builder /app/client/dist ui
COPY resources/icon.svg .
COPY metadata.json .
VOLUME /config
COPY host ./host
COPY --from=client-builder host/jf-darwin host/darwin/jf
COPY --from=client-builder host/jf-windows.exe host/windows/jf.exe
COPY --from=client-builder host/jf-linux host/linux/jf

CMD [ "sleep", "infinity" ]

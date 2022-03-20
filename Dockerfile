FROM node:14.17-alpine3.13 AS client-builder
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

COPY binaries/darwin/jf .
COPY --from=client-builder /app/client/dist ui
COPY icon.svg .
COPY metadata.json .
VOLUME /config
COPY binaries ./binaries

CMD [ "sleep", "infinity" ]

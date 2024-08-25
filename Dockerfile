FROM ubuntu:focal AS client-builder
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g yarn
WORKDIR /host
ARG jfrogCliVersion=2.64.0
ARG TARGETARCH
RUN if [ "$TARGETARCH" = "arm64" ]; then \
    curl -XGET "https://releases.jfrog.io/artifactory/jfrog-cli/v2-jf/$jfrogCliVersion/jfrog-cli-mac-arm64/jf" -L -k -g > jf-darwin; \
  else \
    curl -XGET "https://releases.jfrog.io/artifactory/jfrog-cli/v2-jf/$jfrogCliVersion/jfrog-cli-mac-386/jf" -L -k -g > jf-darwin; \
  fi
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

FROM alpine:latest

LABEL org.opencontainers.image.title="JFrog" \
    org.opencontainers.image.description="Scan your Docker images for vulnerabilities with JFrog Xray." \
    org.opencontainers.image.vendor="JFrog Ltd." \
    com.docker.desktop.extension.api.version=">=0.2.0" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/jfrog/jfrog-docker-desktop-extension/dev/resources/icon.svg" \
    com.docker.extension.screenshots="[{\"alt\": \"Image scanning - light screenshot\", \"url\": \"https://raw.githubusercontent.com/jfrog/jfrog-docker-desktop-extension/dev/resources/screenshots/1.png\"},{\"alt\": \"Image scan results - light screenshot\", \"url\": \"https://raw.githubusercontent.com/jfrog/jfrog-docker-desktop-extension/dev/resources/screenshots/2.png\"},{\"alt\": \"Vulnerability details - light screenshot\", \"url\": \"https://raw.githubusercontent.com/jfrog/jfrog-docker-desktop-extension/dev/resources/screenshots/3.png\"},{\"alt\": \"Image scanning - dark screenshot\", \"url\": \"https://raw.githubusercontent.com/jfrog/jfrog-docker-desktop-extension/dev/resources/screenshots/4.png\"},{\"alt\": \"Image scan results - dark screenshot\", \"url\": \"https://raw.githubusercontent.com/jfrog/jfrog-docker-desktop-extension/dev/resources/screenshots/5.png\"},{\"alt\": \"Vulnerability details - dark screenshot\", \"url\": \"https://raw.githubusercontent.com/jfrog/jfrog-docker-desktop-extension/dev/resources/screenshots/6.png\"}]" \
    com.docker.extension.detailed-description="<p>The JFrog Docker Desktop Extension scans any of your local Docker images for security vulnerabilities. The scanning process is based on JFrog Xray's vast vulnerabilities database, which is continuously updated with the latest vulnerabilities. In addition, a dedicated Security Research Team within JFrog, continuously improves the JFrog Xray's detection methods, ensuring that Xray continues to be a leading security solution in the market.</p><h3>Deep recursive scanning</h3><p>When an image is scanned with the JFrog Extension, Xray recursively scans every package included in the Docker Image. Drilling down to analyze even the smallest binary component that affects your software. For example, when analyzing a Docker image, if Xray finds that it contains a Java application it will also analyze all the .jar files used in this application.</p><h3>Fixed versions</h3><p>The JFrog Extension not only allows the detection of vulnerable packages, but also displays the software versions that include the fixes, allowing you to upgrade the vulnerable packages and resolve the issue.</p><h3>Easy and intuitive interface</h3><p>When clicking on a specific vulnerability, the view is expanded, to also include the issue description, online references about the issue, and a graph showing the location of the vulnerability within the image.</p><h3>It is all available for free</h3><p>Using the JFrog Extension doesn't require a paid JFrog subscription. You can use your own existing JFrog environment, or set up a new one in just two steps.</p><video src=\"https://user-images.githubusercontent.com/29822394/167414572-df6b2d4f-9c77-4d93-9c82-500057e2ffda.mov\" controls=\"controls\" muted=\"muted\" style=\"max-width:100%;\"></video>" \
    com.docker.extension.publisher-url="https://jfrog.com" \
    com.docker.extension.additional-urls="[{\"title\":\"Documentation\",\"url\":\"https://github.com/jfrog/jfrog-docker-desktop-extension#readme\"},{\"title\":\"Source code\",\"url\":\"https://github.com/jfrog/jfrog-docker-desktop-extension\"},{\"title\":\"JFrog Xray documentation\",\"url\":\"https://www.jfrog.com/confluence/display/JFROG/JFrog+Xray\"}]" \
    com.docker.extension.changelog="<p>Exciting New Features🎉</p><ul><li>Improve error and warning messages</li><li>Improve Scan page UI</li><li>Improve Setting page UI</li><li>Adjust App for small/large screens</li><li>Added Mac ARM64 CLI Support</li>/ul><p>Bug Fixes 🛠</p><ul><li>Fix scanning policy watches/project issue</li><li>Fix Windows permission issues</li><li>Fix 'Create one for FREE' link</li></ul>"
COPY --from=client-builder /app/client/dist ui
COPY resources/icon.svg .
COPY metadata.json .
VOLUME /config
COPY host ./host
COPY --from=client-builder host/jf-darwin host/darwin/jf
COPY --from=client-builder host/jf-windows.exe host/windows/jf.exe
COPY --from=client-builder host/jf-linux host/linux/jf

CMD [ "sleep", "infinity" ]
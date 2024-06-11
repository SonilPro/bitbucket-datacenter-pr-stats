FROM maven:3.9.6-eclipse-temurin-17

# https://github.com/phusion/baseimage-docker/issues/342#issuecomment-281315763
ENV DEBIAN_FRONTEND noninteractive

# Install node 16
ARG NODE_VERSION=16.11.1
ARG NODE_PACKAGE=node-v$NODE_VERSION-linux-x64
ARG NODE_HOME=/opt/$NODE_PACKAGE

ENV NODE_PATH $NODE_HOME/lib/node_modules
ENV PATH $NODE_HOME/bin:$PATH

RUN apt-get update && apt-get install -y \
      ca-certificates \
      curl \
      gpg \
    && curl https://nodejs.org/dist/v$NODE_VERSION/$NODE_PACKAGE.tar.gz | tar -xzC /opt/ \
    && npm install -g yarn

# Install Atlas SDK
ARG ATLAS_SDK_VERSION=8.2.10
ARG ATLAS_SDK_PACKAGE=atlassian-plugin-sdk-$ATLAS_SDK_VERSION
ARG ATLAS_SDK_HOME=/opt/$ATLAS_SDK_PACKAGE

ENV PATH $ATLAS_SDK_HOME/bin:$PATH

RUN wget -q -O - https://packages.atlassian.com/mvn/maven-external/com/atlassian/amps/atlassian-plugin-sdk/$ATLAS_SDK_VERSION/atlassian-plugin-sdk-$ATLAS_SDK_VERSION.tar.gz \
    | tar -xzC /opt/

# Install Chrome stable
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | tee /etc/apt/trusted.gpg.d/google.asc >/dev/null
RUN sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'

RUN set -x \
    && apt-get update \
    && apt-get install -y \
    google-chrome-stable

ENV CHROME_BIN /usr/bin/google-chrome

# Echo versions to the console
RUN java -version
RUN mvn -v
RUN node -v
RUN npm -v
RUN yarn -v
RUN atlas-version
RUN apt-cache policy google-chrome-stable | grep Installed | sed -e "s/Installed/Chrome/"

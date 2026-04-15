FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get install -y curl ca-certificates gnupg
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN node -v && npm -v

USER jenkins
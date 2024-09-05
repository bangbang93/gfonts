ARG BASE_IMAGE=node:20-bullseye-slim

FROM $BASE_IMAGE as prod-node-modules
ENV PROJECT_NAME gfonts
WORKDIR /opt/$PROJECT_NAME

RUN apt-get update \
    && apt-get install -y build-essential python3

COPY package.json package-lock.json /opt/$PROJECT_NAME/
RUN npm ci --omit=dev --no-fund --no-audit

FROM $BASE_IMAGE
ENV PROJECT_NAME=gfonts TZ=Asia/Shanghai
RUN apt-get update  \
    && apt-get install -y git tini procps \
    && rm -rf /var/lib/apt/lists/* \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

WORKDIR /opt/$PROJECT_NAME

COPY . .

COPY --from=prod-node-modules /opt/$PROJECT_NAME/node_modules ./node_modules

EXPOSE 3000
CMD ["tini", "--", "node", "bin/www"]

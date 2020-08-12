FROM node:13-alpine AS build

WORKDIR /app
COPY . .
RUN apk update
RUN apk add --no-cache make gcc g++ python && \
  npm install --silent && \
  apk del make gcc g++ python
RUN yarn run build
RUN ls dist

EXPOSE 80

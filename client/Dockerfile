FROM node:21-bookworm-slim as build

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginxinc/nginx-unprivileged:alpine3.18-slim-test
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
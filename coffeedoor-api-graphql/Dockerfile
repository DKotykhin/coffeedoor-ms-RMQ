#standalone container
FROM node:20 as dev

WORKDIR /app

COPY package.json /app
COPY pnpm-lock.yaml /app

RUN pnpm install

COPY . /app

RUN pnpm run build

EXPOSE 4444
CMD [ "pnpm", "start" ]


# common container
FROM node:20 as prod

WORKDIR /coffeedoor-api-graphql

COPY ./coffeedoor-api-graphql/package.json /coffeedoor-api-graphql
COPY ./coffeedoor-api-graphql/pnpm-lock.yaml /coffeedoor-api-graphql
COPY ./coffeedoor-api-graphql/tsconfig.json tsconfig.json
COPY ./coffeedoor-api-graphql/nest-cli.json nest-cli.json

RUN npm install -g pnpm
RUN pnpm install

COPY /coffeedoor-api-graphql /coffeedoor-api-graphql

RUN pnpm run build

EXPOSE 4444
CMD [ "pnpm", "start" ]

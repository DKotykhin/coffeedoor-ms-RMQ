#standalone container
FROM node:20 as dev

WORKDIR /app

COPY package.json /app
COPY pnpm-lock.yaml /app

RUN npm install -g pnpm
RUN pnpm install

COPY . /app

RUN pnpm run build

CMD [ "pnpm", "start" ]


# common container
FROM node:20 as prod

WORKDIR /coffeedoor-user-ms

COPY ./coffeedoor-user-ms/package.json /coffeedoor-user-ms
COPY ./coffeedoor-user-ms/pnpm-lock.yaml /coffeedoor-user-ms
COPY ./coffeedoor-user-ms/tsconfig.json tsconfig.json
COPY ./coffeedoor-user-ms/nest-cli.json nest-cli.json

RUN npm install -g pnpm
RUN pnpm install

COPY /coffeedoor-user-ms /coffeedoor-user-ms

RUN pnpm run build

CMD [ "pnpm", "start" ]

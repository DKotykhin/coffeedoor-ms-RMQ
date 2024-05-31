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

WORKDIR /coffeedoor-menu-ms

COPY ./coffeedoor-menu-ms/package.json /coffeedoor-menu-ms
COPY ./coffeedoor-menu-ms/pnpm-lock.yaml /coffeedoor-menu-ms
COPY ./coffeedoor-menu-ms/tsconfig.json tsconfig.json
COPY ./coffeedoor-menu-ms/nest-cli.json nest-cli.json

RUN npm install -g pnpm
RUN pnpm install

COPY /coffeedoor-menu-ms /coffeedoor-menu-ms

RUN pnpm run build

CMD [ "pnpm", "start" ]

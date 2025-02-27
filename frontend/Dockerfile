FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm install -g serve

RUN chown -R node /usr/src/app

USER node

RUN npm run build

EXPOSE 3000

CMD ["serve","-s","build"]
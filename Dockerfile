
FROM node:20-alpine

WORKDIR /project01/usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

EXPOSE 8080

CMD ["node", "app.js"]

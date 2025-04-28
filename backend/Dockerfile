FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install

ENV PORT=10000
EXPOSE 10000

CMD ["npm", "start"]

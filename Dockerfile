FROM node:20.12.2-alpine3.19

RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app

COPY --chown=app:app package*.json ./
RUN npm install
COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
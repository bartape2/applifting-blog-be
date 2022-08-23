FROM node:16-alpine
COPY app /app
WORKDIR app
RUN npm install
CMD npm run start

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=10000
ENV NODE_OPTIONS="--max-old-space-size=256"

EXPOSE 10000

CMD ["npm", "start"]

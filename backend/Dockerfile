FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm i --prod
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD ["node", "index.js"]

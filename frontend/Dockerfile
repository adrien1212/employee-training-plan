FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN echo ${PWD} && ls /app -l
# Production Stage
FROM nginx:alpine
COPY --from=build /app/nginx /etc/nginx/conf.d
COPY --from=build /app/dist /usr/share/nginx/html
COPY env.sh /docker-entrypoint.d/env.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
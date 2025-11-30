# Use official Node.js image for build
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Use Nginx to serve the built app
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

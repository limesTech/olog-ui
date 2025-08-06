# Node 24
FROM node:24-alpine
RUN apk update && apk add curl bash
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH
ENV BROWSER="none"
COPY . ./
RUN npm ci 
# --silent
EXPOSE 3000
# start app
CMD ["npm", "start"]
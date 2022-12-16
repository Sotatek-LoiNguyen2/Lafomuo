# lts-gallium refers to v16
# Using this instead of node:16 to avoid dependabot updates
FROM node:16.15.1 as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

RUN yarn build

# RUN npm prune

FROM node:16.15.1

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
# RUN chown -R node:node /usr/src/app && chmod 750 /usr/src/app
USER node
CMD [ "npm", "run", "start:dev" ]

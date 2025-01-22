# Dockerfile
FROM node:lts AS dev

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "yarn.lock", "./"]
RUN yarn
COPY . .

RUN yarn build

ENV directus_url=${directus_url}
ENV directus_token=${directus_token}
ENV directus_media_folder=${directus_media_folder}
ENV PUBLIC_CDN_URL=${PUBLIC_CDN_URL}
ENV IDE_ADMIN_PASSWORD=${IDE_ADMIN_PASSWORD}
ENV IDE_USER_PASSWORD=${IDE_USER_PASSWORD}

EXPOSE 3000
CMD ["node", "build"]
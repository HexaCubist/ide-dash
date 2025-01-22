# Dockerfile
FROM node:lts AS dev

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "yarn.lock", "./"]
RUN yarn
COPY . .


ARG directus_url=${directus_url}
ARG directus_token=${directus_token}
ARG directus_media_folder=${directus_media_folder}
ARG PUBLIC_CDN_URL=${PUBLIC_CDN_URL}
ARG IDE_ADMIN_PASSWORD=${IDE_ADMIN_PASSWORD}
ARG IDE_USER_PASSWORD=${IDE_USER_PASSWORD}
ARG BODY_SIZE_LIMIT=${BODY_SIZE_LIMIT}

ENV directus_url=${directus_url}
ENV directus_token=${directus_token}
ENV directus_media_folder=${directus_media_folder}
ENV PUBLIC_CDN_URL=${PUBLIC_CDN_URL}
ENV IDE_ADMIN_PASSWORD=${IDE_ADMIN_PASSWORD}
ENV IDE_USER_PASSWORD=${IDE_USER_PASSWORD}
ENV BODY_SIZE_LIMIT=${BODY_SIZE_LIMIT}

RUN yarn build


EXPOSE 3000
CMD ["node", "build"]
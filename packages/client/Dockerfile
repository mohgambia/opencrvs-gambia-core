# FROM nginx
# ARG HOST
# ARG RESOURCES_URL
# ENV HOST=$HOST
# ENV RESOURCES_URL=$RESOURCES_URL
# COPY infrastructure/nginx-default.conf /etc/nginx/conf.d/default.conf
# COPY --from=opencrvs-build /packages/client/build /usr/share/nginx/html

# ADD infrastructure/nginx-deploy-config.sh /
# RUN chmod +x /nginx-deploy-config.sh
# CMD ["bash", "-c", "'./nginx-deploy-config.sh'"]

FROM node:14
RUN npm install -g serve
RUN mkdir /app
ENV COUNTRY=zmb
COPY --from=opencrvs-build /packages/client/build /app
CMD ["serve", "-l", "80", "-s", "/app"]

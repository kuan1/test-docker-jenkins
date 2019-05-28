FROM nginx:stable-alpine
LABEL author=luzhongk version=0.0.1beta
COPY ./conf.d /etc/nginx/conf.d
COPY ./webroot:/etc/nginx/webroot
WORKDIR /etc/nginx
EXPOSE 80
CMD exec nginx -g 'daemon off;'

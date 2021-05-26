FROM nginx:latest

EXPOSE 80

COPY ./nginx /etc/nginx

RUN nginx -t

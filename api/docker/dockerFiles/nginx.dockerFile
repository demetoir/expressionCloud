FROM nginx:1.19.9

EXPOSE 80

COPY ./nginx /etc/nginx

RUN nginx -t

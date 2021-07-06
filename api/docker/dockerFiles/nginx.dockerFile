FROM nginx:mainline

EXPOSE 80

COPY ./nginx /etc/nginx

RUN nginx -t

FROM nginx

MAINTAINER Arthur Osipenko

COPY ./nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /etc/nginx/sites-available/domain.com
RUN mkdir -p /etc/nginx/sites-enabled/domain.com
COPY ./domain.com/nginx.conf /etc/nginx/sites-available/domain.com/nginx.conf

# Append "daemon off;" to the beginning of the configuration
# in order to avoid an exit of the container
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

RUN ln -s /etc/nginx/sites-available/domain.com/nginx.conf /etc/nginx/sites-enabled/domain.com/nginx.conf

ADD /usr/local/etc/nginx/psw /etc/nginx/psw
ADD /usr/local/etc/nginx/ssl /etc/nginx/ssl

# Define default command
CMD service nginx start

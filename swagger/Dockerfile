FROM nginx

MAINTAINER Arthur Osipenko

COPY ./nginx.conf /etc/nginx/nginx.conf

# Define working directory
ADD ./public /swagger
WORKDIR /swagger

# Append "daemon off;" to the beginning of the configuration
# in order to avoid an exit of the container
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Define default command
CMD service nginx start

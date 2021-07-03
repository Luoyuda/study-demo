FROM php:7.2.31-fpm
MAINTAINER xhl<562958029@qq.com>

RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
RUN apt-get clean
RUN apt-get update
RUN apt-get install -yq vim
RUN apt-get install -yq telnet
RUN apt install openssl libssl-dev -yq
ADD ./cert.pem /usr/lib/ssl/cert.pem
RUN pecl install redis-5.1.1 && docker-php-ext-enable redis

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/bin/

RUN install-php-extensions gd xdebug bcmath bz2 calendar dba exif gettext gmp intl ldap mysqli odbc pcntl pdo_dblib pdo_mysql pdo_odbc pdo_pgsql  pgsql pspell shmop soap sockets sysvmsg sysvsem sysvshm tidy wddx xmlrpc xsl opcache zip   

RUN echo "log_errors=On" >> /usr/local/etc/php/php.ini-development && echo "extension=redis.so" >> /usr/local/etc/php/php.ini-development 
WORKDIR /
RUN mkdir /data && mkdir /data/webdata && mkdir /data/webdata/seo && mkdir /data/api_log
RUN mkdir /data/uxin_bigdata && mkdir /data/uxin_bigdata/h5admin && mkdir /data/uxin_bigdata/h5admin/CURL
RUN mkdir /data/weblog  && mkdir /data/weblog/pull_image_error && mkdir /data/weblog/seo && mkdir /data/weblog/seo/h5_admin && chmod -R 777 /data

EXPOSE 80

EXPOSE 9000

STOPSIGNAL SIGTERM

ADD ./init.sh init.sh

CMD ["sh", "init.sh"]
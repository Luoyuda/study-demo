FROM php:7.2.31-fpm
MAINTAINER xhl<562958029@qq.com>

# 安装 nginx
ENV NGINX_VERSION   1.17.10
ENV NJS_VERSION     0.3.9
ENV PKG_RELEASE     1~buster

RUN set -x \
# create nginx user/group first, to be consistent throughout docker variants
    && addgroup --system --gid 101 nginx \
    && adduser --system --disabled-login --ingroup nginx --no-create-home --home /nonexistent --gecos "nginx user" --shell /bin/false --uid 101 nginx \
    && apt-get update \
    && apt-get install --no-install-recommends --no-install-suggests -y gnupg1 ca-certificates \
    && \
    NGINX_GPGKEY=573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62; \
    found=''; \
    for server in \
        ha.pool.sks-keyservers.net \
        hkp://keyserver.ubuntu.com:80 \
        hkp://p80.pool.sks-keyservers.net:80 \
        pgp.mit.edu \
    ; do \
        echo "Fetching GPG key $NGINX_GPGKEY from $server"; \
        apt-key adv --keyserver "$server" --keyserver-options timeout=10 --recv-keys "$NGINX_GPGKEY" && found=yes && break; \
    done; \
    test -z "$found" && echo >&2 "error: failed to fetch GPG key $NGINX_GPGKEY" && exit 1; \
    apt-get remove --purge --auto-remove -y gnupg1 && rm -rf /var/lib/apt/lists/* \
    && dpkgArch="$(dpkg --print-architecture)" \
    && nginxPackages=" \
        nginx=${NGINX_VERSION}-${PKG_RELEASE} \
        nginx-module-xslt=${NGINX_VERSION}-${PKG_RELEASE} \
        nginx-module-geoip=${NGINX_VERSION}-${PKG_RELEASE} \
        nginx-module-image-filter=${NGINX_VERSION}-${PKG_RELEASE} \
        nginx-module-njs=${NGINX_VERSION}.${NJS_VERSION}-${PKG_RELEASE} \
    " \
    && case "$dpkgArch" in \
        amd64|i386) \
# arches officialy built by upstream
            echo "deb https://nginx.org/packages/mainline/debian/ buster nginx" >> /etc/apt/sources.list.d/nginx.list \
            && apt-get update \
            ;; \
        *) \
# we're on an architecture upstream doesn't officially build for
# let's build binaries from the published source packages
            echo "deb-src https://nginx.org/packages/mainline/debian/ buster nginx" >> /etc/apt/sources.list.d/nginx.list \
            \
# new directory for storing sources and .deb files
            && tempDir="$(mktemp -d)" \
            && chmod 777 "$tempDir" \
# (777 to ensure APT's "_apt" user can access it too)
            \
# save list of currently-installed packages so build dependencies can be cleanly removed later
            && savedAptMark="$(apt-mark showmanual)" \
            \
# build .deb files from upstream's source packages (which are verified by apt-get)
            && apt-get update \
            && apt-get build-dep -y $nginxPackages \
            && ( \
                cd "$tempDir" \
                && DEB_BUILD_OPTIONS="nocheck parallel=$(nproc)" \
                    apt-get source --compile $nginxPackages \
            ) \
# we don't remove APT lists here because they get re-downloaded and removed later
            \
# reset apt-mark's "manual" list so that "purge --auto-remove" will remove all build dependencies
# (which is done after we install the built packages so we don't have to redownload any overlapping dependencies)
            && apt-mark showmanual | xargs apt-mark auto > /dev/null \
            && { [ -z "$savedAptMark" ] || apt-mark manual $savedAptMark; } \
            \
# create a temporary local APT repo to install from (so that dependency resolution can be handled by APT, as it should be)
            && ls -lAFh "$tempDir" \
            && ( cd "$tempDir" && dpkg-scanpackages . > Packages ) \
            && grep '^Package: ' "$tempDir/Packages" \
            && echo "deb [ trusted=yes ] file://$tempDir ./" > /etc/apt/sources.list.d/temp.list \
# work around the following APT issue by using "Acquire::GzipIndexes=false" (overriding "/etc/apt/apt.conf.d/docker-gzip-indexes")
#   Could not open file /var/lib/apt/lists/partial/_tmp_tmp.ODWljpQfkE_._Packages - open (13: Permission denied)
#   ...
#   E: Failed to fetch store:/var/lib/apt/lists/partial/_tmp_tmp.ODWljpQfkE_._Packages  Could not open file /var/lib/apt/lists/partial/_tmp_tmp.ODWljpQfkE_._Packages - open (13: Permission denied)
            && apt-get -o Acquire::GzipIndexes=false update \
            ;; \
    esac \
    \
    && apt-get install --no-install-recommends --no-install-suggests -y \
                        $nginxPackages \
                        gettext-base \
    && apt-get remove --purge --auto-remove -y ca-certificates && rm -rf /var/lib/apt/lists/* /etc/apt/sources.list.d/nginx.list \
    \
# if we have leftovers from building, let's purge them (including extra, unnecessary build deps)
    && if [ -n "$tempDir" ]; then \
        apt-get purge -y --auto-remove \
        && rm -rf "$tempDir" /etc/apt/sources.list.d/temp.list; \
    fi

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log


RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
RUN apt-get clean
RUN apt-get update
RUN apt-get install -yq vim
RUN apt-get install -yq telnet
RUN apt install openssl libssl-dev -yq
ADD cert.pem /usr/lib/ssl/cert.pem
RUN pecl install redis-5.1.1 \
    && docker-php-ext-enable redis

RUN apt-get install -yq redis-server
RUN apt-get install -yq redis-tools

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/bin/

RUN install-php-extensions gd xdebug 
# cgi-fcgi phpdbg_webhelper
RUN install-php-extensions bcmath bz2 calendar
RUN install-php-extensions dba exif gettext gmp
RUN install-php-extensions intl ldap mysqli odbc pcntl
RUN install-php-extensions pdo_dblib pdo_mysql pdo_odbc pdo_pgsql 
RUN install-php-extensions pgsql pspell shmop soap sockets    
RUN install-php-extensions sysvmsg sysvsem sysvshm tidy wddx    
RUN install-php-extensions xmlrpc xsl opcache zip   

# RUN apt-get install -yq libwebp-dev libjpeg-dev libpng-dev libfreetype6-dev
# RUN docker-php-source extract
# WORKDIR /usr/src/php/ext/gd
# RUN docker-php-ext-configure gd --with-webp-dir=/usr/include/webp --with-jpeg-dir=/usr/include --with-png-dir=/usr/include --with-freetype-dir=/usr/include/freetype2 
# RUN docker-php-ext-install gd
# # 1.0.2 增加 bcmath, calendar, exif, gettext, sockets, dba, 
# # mysqli, pcntl, pdo_mysql, shmop, sysvmsg, sysvsem, sysvshm 扩展
# RUN docker-php-ext-install -j$(nproc) bcmath calendar exif gettext \
# sockets dba mysqli pcntl pdo_mysql shmop sysvmsg sysvsem sysvshm
# # 增加 bz2 扩展
# RUN apt-get install -y --no-install-recommends libbz2-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-install -j$(nproc) bz2

# # 1.0.18 增加 intl 扩展 
# RUN apt-get install -y --no-install-recommends libicu-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-install -j$(nproc) intl

# 1.0.4 增加 enchant 扩展, 拼写检查库
# RUN apt-get update && \
# apt-get install -y libenchant-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-install -j$(nproc) enchant

# 1.0.6 增加 gmp 扩展, GMP
# RUN apt-get install -y --no-install-recommends libgmp-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-install -j$(nproc) gmp

# 1.0.7 增加 soap wddx xmlrpc tidy xsl 扩展
# RUN apt-get update && \
# apt-get install -y --no-install-recommends libxml2-dev libtidy-dev libxslt1-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-install -j$(nproc) soap wddx xmlrpc tidy xsl

# 1.0.8 增加 zip 扩展
# RUN apt-get update && \
# apt-get install -y --no-install-recommends libzip-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-install -j$(nproc) zip

# 1.0.9 增加 snmp 扩展
# RUN apt-get update && \
# apt-get install -y --no-install-recommends libsnmp-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-install -j$(nproc) snmp

# 1.0.10 增加 pgsql, pdo_pgsql 扩展 
# RUN apt-get update && \
# apt-get install -y --no-install-recommends libpq-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-install -j$(nproc) pgsql pdo_pgsql

# 1.0.11 增加 pspell 扩展 
# RUN apt-get update && \
# apt-get install -y --no-install-recommends libpspell-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-install -j$(nproc) pspell

# 1.0.12 增加 recode 扩展 
# RUN apt-get update && \
# apt-get install -y --no-install-recommends librecode-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-install -j$(nproc) recode

# 1.0.13 增加 PDO_Firebird 扩展 
# RUN apt-get update && \
# apt-get install -y --no-install-recommends firebird-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-install -j$(nproc) pdo_firebird

# 1.0.14 增加 pdo_dblib 扩展 
# RUN apt-get update && \
# apt-get install -y --no-install-recommends freetds-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-configure pdo_dblib --with-libdir=lib/x86_64-linux-gnu && \
# docker-php-ext-install -j$(nproc) pdo_dblib

# 1.0.15 增加 ldap 扩展 
# RUN apt-get update && \
# apt-get install -y --no-install-recommends libldap2-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu && \
# docker-php-ext-install -j$(nproc) ldap

# # 1.0.16 增加 imap 扩展 
# RUN apt-get update && \
# apt-get install -y --no-install-recommends libc-client-dev libkrb5-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-configure imap --with-kerberos --with-imap-ssl && \
# docker-php-ext-install -j$(nproc) imap

# # 1.0.17 增加 interbase 扩展 
# RUN apt-get update && \
# apt-get install -y --no-install-recommends firebird-dev && \
# rm -r /var/lib/apt/lists/* && \
# docker-php-ext-install -j$(nproc) interbase


# # 1.0.20 imagick 扩展
# RUN export CFLAGS="$PHP_CFLAGS" CPPFLAGS="$PHP_CPPFLAGS" LDFLAGS="$PHP_LDFLAGS" && \
# apt-get update && \
# apt-get install -y --no-install-recommends libmagickwand-dev && \
# rm -rf /var/lib/apt/lists/* && \
# pecl install imagick-3.4.3 && \
# docker-php-ext-enable imagick

# # 1.0.21 增加 Memcached 扩展 
# RUN apt-get update && \ 
# apt-get install -y --no-install-recommends zlib1g-dev libmemcached-dev && \
# rm -r /var/lib/apt/lists/* && \
# pecl install memcached && \
# docker-php-ext-enable memcached

# # 1.0.23 增加 opcache 扩展 
# RUN docker-php-ext-configure opcache --enable-opcache && docker-php-ext-install opcache

# 1.0.24 增加 odbc, pdo_odbc 扩展 
# RUN set -ex; \
# docker-php-source extract; \
# { \
#      echo '# https://github.com/docker-library/php/issues/103#issuecomment-271413933'; \
#      echo 'AC_DEFUN([PHP_ALWAYS_SHARED],[])dnl'; \
#      echo; \
#      cat /usr/src/php/ext/odbc/config.m4; \
# } > temp.m4; \
# mv temp.m4 /usr/src/php/ext/odbc/config.m4; \
# apt-get update; \
# apt-get install -y --no-install-recommends unixodbc-dev; \
# rm -rf /var/lib/apt/lists/*; \
# docker-php-ext-configure odbc --with-unixODBC=shared,/usr; \
# docker-php-ext-configure pdo_odbc --with-pdo-odbc=unixODBC,/usr; \
# docker-php-ext-install odbc pdo_odbc; \
# docker-php-source delete

RUN echo "log_errors=On" >> /usr/local/etc/php/php.ini-development && echo "extension=redis.so" >> /usr/local/etc/php/php.ini-development 
WORKDIR /
RUN mkdir /data && mkdir /data/webdata && mkdir /data/webdata/seo && mkdir /data/api_log
RUN mkdir /data/uxin_bigdata && mkdir /data/uxin_bigdata/h5admin && mkdir /data/uxin_bigdata/h5admin/CURL
RUN mkdir /data/weblog  && mkdir /data/weblog/pull_image_error && mkdir /data/weblog/seo && mkdir /data/weblog/seo/h5_admin && chmod -R 777 /data

EXPOSE 80

EXPOSE 9000

STOPSIGNAL SIGTERM

ADD init.sh init.sh

CMD ["sh", "init.sh"]
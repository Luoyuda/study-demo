
```sh
# conf 文件夹
/etc/nginx/
# log 文件夹
/var/log/nginx/
# www 文件夹
/usr/local/var/www/
# port
80
# 启动 nginx
docker run -it --privileged=true -p 8283:80 -v /usr/local/var/www/:/usr/local/var/www/ -v /Users/chenxiayu/study-demo/tp-demo/nginx/log:/var/log/nginx/ -v /Users/chenxiayu/study-demo/tp-demo/nginx/conf/nginx.conf:/etc/nginx/nginx.conf --net net -d --name xhl_nginx_1 nginx

# 启动 php
docker run -it -d --privileged=true -p 9100:9000 -v /usr/local/var/www/:/var/www/html/ --net net --name my_php php:fpm
```

docker run -it -d --privileged=true -p 8283:80 -p 9100:9000 -v /usr/local/var/www/:/usr/local/var/www/ -v /usr/local/var/www/:/var/www/html/ -v /Users/chenxiayu/study-demo/tp-demo/nginx/conf/nginx.conf:/etc/nginx/nginx.conf --name my_php_1 my_php /bin/bash -c 'sh init.sh'


/usr/local/php/sbin/php-fpm -R -c /etc/php.ini -y /etc/php-fpm.conf

/usr/local/openresty/nginx/sbin/nginx -c /usr/local/openresty/nginx/conf/nginx.conf

memcached -d -m 50 -l 127.0.0.1 -p 11211 -u root

redis
pdo_mysql

php-fpm -R -c /usr/local/etc/php/php.ini-development


# Redis

## [redis课程学习](https://www.bilibili.com/video/BV1S54y1R7SB?p=1)

## Nosql 概述

### 为什么Nosql 会出现

第一种架构：APP > DAL > Mysql  使用单机 Mysql

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200531225803736.png" alt="image-20200531225803736" style="zoom:50%;" />

应用瓶颈

1. 数据量太大
2. 数据索引（B+Tree）
3. 读写混合过大，服务器承受不住

由于大部分请求是在读数据，可以使用缓存来优化读取操作，提高访问速度。

第二种架构出现了：APP > DAL > CACHE > Mysql 使用缓存+从库做读操作，使用主库进行写入

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200531230053103.png" alt="image-20200531230053103" style="zoom:50%;" />

第三种架构 分库分表 + 水平拆分 + Mysql 集群

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200531230350651.png" alt="image-20200531230350651" style="zoom:50%;" />

现在数据量越来越大，关系型数据库越发头大，NoSQL数据库的产生就是为了解决大规模数据集合多重数据种类带来的挑战。

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200531231606576.png" alt="image-20200531231606576" style="zoom:50%;" />

### 什么是NoSQL

NoSQL = Not Only SQL （不仅仅是数据库）

关系型数据库：表，行，列

泛指非关系型数据库，随着web2.0互联网的诞生！传统关系型数据库很难对付web2.0时代，尤其是大规模高爆发的情况。

#### NoSQL 特点

1. 方便扩展（数据之间没有关系，很好扩展）

2. 大数据量高性能

3. 数据类型是多样

4. 传统的RDBMS和NoSQL

   ```sh
   # RDBMS
   - 结构化组织
   - SQL
   - 数据跟关系都存在表中
   - 数据定义语言
   - 严格的一致性
   - 基础的事务
   - ...
   ```

   ```sh
   # NoSQL
   - 数据类型多种多样
   - 没有固定的查询语句
   - 键值对存储，列存储，文档存储，图形数据库
   - 最终一致性
   - CAP定理和BASE
   - 高性能，高可用，高可扩
   ```

### NoSQL的四大分类

##### KV键值对

Redis

Memecache

##### 文档型数据库

MongoDB：介于关系型数据库跟非关系型数据库中的产品。一般用于处理大量文档！

##### 列存储数据库

HBase

分布式文件系统

##### 图形关系数据库

Neo4j

InfoGrid

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200531234313230.png" alt="image-20200531234313230" style="zoom:50%;" />

## Redis 

### 概述

Redis (Remote Dictionary Server) 远程字典服务，是一个开源的使用ANSI C语言 编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。

与memcached一样，为了保证效率，数据都是缓存在内存中。区别的是redis会周期性的把更新的数据写入磁盘或者把修改操作写入追加的记录文件，并且在此基础上实现了master-slave(主从)同步。

#### Redis 能干嘛

1. 内存存储、持久化（rdb、aof）
2. 效率高，可以用于高速缓存
3. 发布订阅系统
4. 地图信息分析
5. 计时器、计数器
6. 消息队列
7. 排行榜

#### 特性

1. 多种数据结构

2. 持久化

3. 集群

4. 事务

   

### 基础知识

Redis 是单线程的，用C语言写的。基于内存操作，Redis 的性能瓶颈不是 CPU，而是根据机器内存和网络带宽 。

为什么单线程还快？

1. 多线程（CPU会切换上下文）不一定比单线程效率高
2. 所有的数据都放在内存中，单线程操作是最高的，对于内存系统来说，没有上下文切换效率是最高的，多次读写都是在一个CPU上。

### 数据类型

Redis 是一个开源（BSD许可）的，内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件。 它支持多种类型的数据结构，如 字符串（strings）， 散列（hashes）， 列表（lists）， 集合（sets）， 有序集合（sorted sets） 与范围查询， bitmaps， hyperloglogs 和 地理空间（geospatial） 索引半径查询。 Redis 内置了 复制（replication），LUA脚本（Lua scripting）， LRU驱动事件（LRU eviction），事务（transactions） 和不同级别的 磁盘持久化（persistence）， 并通过 Redis哨兵（Sentinel）和自动 分区（Cluster）提供高可用性（high availability）。

#### Redis-Key

```sh
127.0.0.1:6379> FLUSHALL		# FLUSHALL [ASYNC] 清空当前数据库
OK
127.0.0.1:6379> set name xhl	# SET key value 设置值
OK
127.0.0.1:6379> keys *		#	KEYS pattern 获取符合规则的key
1) "name"
127.0.0.1:6379> get name	# GET key value 获取key
"xhl"
127.0.0.1:6379> EXISTS name		# EXISTS key 判断 key 是否存在 1 存在 0 不存在
(integer) 1
127.0.0.1:6379> EXISTS name1 
(integer) 0
127.0.0.1:6379> move name 1		# MOVE key index 移动到目标数据库
(integer) 1
127.0.0.1:6379> keys *
(empty list or set)
127.0.0.1:6379> select 1		# SELECT index 切换数据库
OK
127.0.0.1:6379[1]> keys *
1) "name"
127.0.0.1:6379[1]> move name 0
(integer) 1
127.0.0.1:6379[1]> select 0
OK
127.0.0.1:6379> keys *
1) "name"
127.0.0.1:6379> EXPIRE name 10	# EXPIRE key time 设置 key 过期时间，单位秒
(integer) 1
127.0.0.1:6379> ttl name	#	TTL key 查看剩余时间
(integer) 7
127.0.0.1:6379> ttl name
(integer) 2
127.0.0.1:6379> ttl name
(integer) 1
127.0.0.1:6379> ttl name
(integer) 0
127.0.0.1:6379> ttl name
(integer) -2
127.0.0.1:6379> get name
(nil)
127.0.0.1:6379> keys *
(empty list or set)
127.0.0.1:6379> set key 1
OK
127.0.0.1:6379> type key	#	TYPE key 查看 value 类型
string
```

#### String (字符串)

```bash
127.0.0.1:6379> set key 1	# SET key 设置值
OK
127.0.0.1:6379> APPEND key 1 # APPEND key value 追加字符串内容，如果 key 不存在，则相当于 set key > append key
(integer) 2
127.0.0.1:6379> APPEND key 1	
(integer) 3
127.0.0.1:6379> get key
"111"
127.0.0.1:6379> STRLEN key	#	STRLEN key 字符串长度
(integer) 3
127.0.0.1:6379> set views 0
OK
#########
127.0.0.1:6379> incr views	# INCR key 自增 1
(integer) 1
127.0.0.1:6379> incr views
(integer) 2
127.0.0.1:6379> decr views 	# DECR key 自减 1
(integer) 1
127.0.0.1:6379> INCRBY views 10	# INCRBY key steps 自增 N 
(integer) 11
127.0.0.1:6379> DECRBY views 10	# DECRBY key steps 自减 N 
(integer) 1
#########
127.0.0.1:6379> set str '123456789'
OK
127.0.0.1:6379> GETRANGE str 0 3 	# GETRANGE key start end 截取字符串 GETRANGE key start end
"1234"
127.0.0.1:6379> GETRANGE str 0 -1 # 
"123456789"
127.0.0.1:6379> SETRANGE str 1 xxx # SETRANGE key offset value 替换指定位置开始的字符串
(integer) 9
127.0.0.1:6379> get str
"1xxx56789"
#########
127.0.0.1:6379> SETEX str1 10 'str1' # SETEX key seconds value set with expire 设置过期时间
OK
127.0.0.1:6379> get str1
"str1"
127.0.0.1:6379> ttl str1
(integer) 0
127.0.0.1:6379> get str1
(nil)
127.0.0.1:6379> SETNX u 1 # SETNX key value set if not exist 不存在则设置，存在则失败 
(integer) 1
127.0.0.1:6379> SETNX u 1
(integer) 0
127.0.0.1:6379> get u
"1"
##########
127.0.0.1:6379> MSET k1 1 k2 2 k3 3 # MSET key value [key value ...] 设置多个值
OK
127.0.0.1:6379> MGET k1 k2 k3 # MSET key value [key value ...] 获取多个值
1) "1"
2) "2"
3) "3"
127.0.0.1:6379> MSETNX k4 4 k5 5 k6 6 # MSETNX key value [key value ...] 设置多个值 原子性，要么一起成功，要么一起失败
(integer) 1
127.0.0.1:6379> MSETNX k4 4 k5 5 k6 6
(integer) 0
127.0.0.1:6379> MSETNX k4 4 k7 7
(integer) 0
127.0.0.1:6379> GET k7
(nil)
### 对象
set user:1:{name:'xhl',age:10}
127.0.0.1:6379> mset user:1:name xhl user:1:age 19
OK
127.0.0.1:6379> mget user:1:name user:1:age
1) "xhl"
2) "19"
### 
127.0.0.1:6379> getset k8 10 # GETSET key value 先获取再设置，不存在返回nil，如果存在则返回，并设置新的值 
(nil)
127.0.0.1:6379> getset k8 11
"10"
```

使用场景

1. 存取字符串
2. 计数器
3. 统计数量
4. 对象缓存存储

#### list（列表）

基本数据类型，可以通过 list 来做栈，队列，阻塞队列

```sh
127.0.0.1:6379> LPUSH list 1 # LPUSH key value [value ...] 将一个值或者多个值插入列表头部（左）
(integer) 1
127.0.0.1:6379> LPUSH list 2
(integer) 2
127.0.0.1:6379> LRANGE list 0 -1 # LRANGE key start stop 通过区间获取
1) "2"
2) "1"
127.0.0.1:6379> RPUSH list 3 # RPUSH key value [value ...] 将一个值或者多个值插入列表尾部（右）
(integer) 3
127.0.0.1:6379> LRANGE list 0 -1
1) "2"
2) "1"
3) "3"
127.0.0.1:6379> LPOP list # LPOP key 从头部弹出一个值（左）
"2"
127.0.0.1:6379> RPOP list # RPOP key 从尾部弹出一个值（右）
"3"
127.0.0.1:6379> LRANGE list 0 -1
1) "1"
127.0.0.1:6379> LINDEX list 0 # LINDEX key index 获取索引 index 的值
"1"
127.0.0.1:6379> LLEN list # LLEN key 获取 list 长度
(integer) 1
####
127.0.0.1:6379> LRANGE list 0 -1 # [1, 0, 1, 2]
1) "1"
2) "0"
3) "1"
4) "2"
127.0.0.1:6379> LREM list 2 1 # LREM key count value 删除 N 个指定的值 [0, 2]
(integer) 2
127.0.0.1:6379> LPUSH list 1 # [1, 0, 2]
(integer) 3
127.0.0.1:6379> LREM list 2 1 # [0, 2]
(integer) 1
127.0.0.1:6379> LRANGE list 0 -1
1) "0"
2) "2"
####
127.0.0.1:6379> LRANGE list 0 -1
1) "-1"
2) "0"
3) "2"
4) "3"
127.0.0.1:6379> LTRIM list 1 2 # LTRIM key start stop 截取指定长度的值
OK
127.0.0.1:6379> LRANGE list 0 -1
1) "0"
2) "2"
####
127.0.0.1:6379> LRANGE list 0 -1
1) "-1"
2) "0"
3) "2"
4) "3"
127.0.0.1:6379> RPOPLPUSH list other # RPOPLPUSH source destination 移除列表尾部到另一个列表头部
"3"
127.0.0.1:6379> LRANGE list 0 -1
1) "-1"
2) "0"
3) "2"
127.0.0.1:6379> LRANGE other 0 -1
1) "3"
####
127.0.0.1:6379> EXISTS list1 # EXISTS key 是否存在
(integer) 0
127.0.0.1:6379> LSET list1 0 2 # LSET key index value 更新数组某个索引值 需要在数组存在，且索引存在时才能更新值
(error) ERR no such key
127.0.0.1:6379> Lpush list1 1
(integer) 1
127.0.0.1:6379> LRANGE list1 0 -1
1) "1"
127.0.0.1:6379> LSET list1 0 2
OK
127.0.0.1:6379> LRANGE list1 0 -1
1) "2"
127.0.0.1:6379> LSET list1 1 2
(error) ERR index out of range
####
127.0.0.1:6379> LRANGE list 0 -1
1) "2"
2) "0"
3) "2"
127.0.0.1:6379> LINSERT list before 0 1 # LINSERT key BEFORE|AFTER pivot value 在某个值的前/后插入值
(integer) 4
127.0.0.1:6379> LINSERT list after 0 1
(integer) 5
127.0.0.1:6379> LRANGE list 0 -1
1) "2"
2) "1"
3) "0"
4) "1"
5) "2"
```

1. list 实际上是一个链表，before > node > after
2. Key 不存在，创建新的链表
3. key 存在，新增内容
4. 移除所有值，则空链表，也不代表不存在
5. 首尾插入效率最高，插入中间元素效率较低

#### Set（集合）

set 的值是不重复的集合

```sh
127.0.0.1:6379> SADD set 1 2 2 1 # SADD key member [member ...] 给set新增一个值
(integer) 2
127.0.0.1:6379> SMEMBERS set # SMEMBERS key 获取集合所有的值
1) "1"
2) "2"
127.0.0.1:6379> SISMEMBER set 1 # SISMEMBER key value 判断某个值在不在集合中
(integer) 1
127.0.0.1:6379> SISMEMBER set 0
(integer) 0
127.0.0.1:6379> SCARD set # SCARD key 获取集合个数
(integer) 2
127.0.0.1:6379> SREM set 1 # SREM key value 删除某个值
(integer) 1
127.0.0.1:6379> SMEMBERS set
1) "2"
####
127.0.0.1:6379> SMEMBERS set 
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
127.0.0.1:6379> SRANDMEMBER set # SRANDMEMBER key 随机抽一个元素
"4"
127.0.0.1:6379> SRANDMEMBER set
"4"
127.0.0.1:6379> SRANDMEMBER set
"5"
127.0.0.1:6379> SRANDMEMBER set
"4"
127.0.0.1:6379> SRANDMEMBER set
"2"
127.0.0.1:6379> SRANDMEMBER set
"3"
#### 
127.0.0.1:6379> SPOP set 1 # SPOP key list 随机删除某个元素
1) "4"
127.0.0.1:6379> SPOP set 2
1) "2"
2) "5"
####
127.0.0.1:6379> SMOVE set set1 2
(integer) 0
127.0.0.1:6379> SMEMBERS set
1) "1"
2) "3"
127.0.0.1:6379> SMOVE set set1 1 # SMOVE source destination member 把元素从 source 移动到 destination 中
(integer) 1
127.0.0.1:6379> SMEMBERS set1
1) "1"
127.0.0.1:6379> SMEMBERS set
1) "3"
####
127.0.0.1:6379> SMEMBERS set
1) "1"
2) "2"
3) "3"
127.0.0.1:6379> SMEMBERS set1
1) "1"
127.0.0.1:6379> SDIFF set set1 # SDIFF key [key...] 获取 N 个集合的差集
1) "2"
2) "3"
127.0.0.1:6379> SINTER set set1 # SINTER key [key...] 获取 N 个集合的交集
1) "1"
127.0.0.1:6379> SUNION set set1 # SUNION key [key...] 获取 N 个集合的并集
1) "1"
2) "2"
3) "3"
```

#### Hash（哈希）

Map 集合 key-map 本质跟 string 类型没什么太大的区别

```shell
127.0.0.1:6379> hset myhash key1 1 # HSET key field value 设置一个具体的 key-value
(integer) 1
127.0.0.1:6379> hget myhash key1 # HGET key field 获取map的值
"1"
127.0.0.1:6379> hmset myhash key1 2 key2 2 key3 3 # HSET key field value [field value...] 设置一批键值数据
OK
127.0.0.1:6379> hmget myhash key1 key2 key3 # HSET key field [field...] 获取一组键值的值
1) "2"
2) "2"
3) "3"
127.0.0.1:6379> HGETALL myhash # HGETALL key 获取全部的数据
1) "key1"
2) "2"
3) "key2"
4) "2"
5) "key3"
6) "3
127.0.0.1:6379> hdel myhash key1 # HDEL key field 删除一个键值
(integer) 1
127.0.0.1:6379> HGETALL myhash
1) "key2"
2) "2"
3) "key3"
4) "3"
#### 
127.0.0.1:6379> HLEN myhash # HLEN key 获取 hash 长度
(integer) 2
####
127.0.0.1:6379> HEXISTS myhash key1 # HEXISTS key field 判断键值是否存在 0 / 1
(integer) 0
127.0.0.1:6379> HEXISTS myhash key2
(integer) 1
####
127.0.0.1:6379> HKEYS myhash # HKEYS key 获取键
1) "key2"
2) "key3"
127.0.0.1:6379> HVALS myhash # HVALS key 获取值
1) "2"
2) "3"
####
127.0.0.1:6379> HINCRBY myhash key1 1 # HINCRBY key field value 自增
(integer) 3
127.0.0.1:6379> HSETNX myhash key4 1 # HSETNX key field value 不存在则设置，存在则失败
(integer) 1
127.0.0.1:6379> HSETNX myhash key4 1
(integer) 0
```

Hash 更适合存储对象，string 更适合存储字符串

#### Zset （有序集合）

在 set 的基础上，增加一个值，用来排序

```sh
127.0.0.1:6379> ZADD myset 1 x-1 # ZADD key [NX|XX] [CH] [INCR] score member [score member ...] 新增一个值
(integer) 1
127.0.0.1:6379> ZADD myset 2 x-1
(integer) 0
127.0.0.1:6379> ZADD myset 2 x-2
(integer) 1
127.0.0.1:6379> ZRANGE myset 0 -1 WITHSCORES # ZRANGE key start stop [WITHSCORES] 获取正序
1) "x-1"
2) "2"
3) "x-2"
4) "2"
127.0.0.1:6379> ZREVRANGE myset 0 -1 withscores # ZREVRANGE key start stop [WITHSCORES] 获取倒序
1) "x-4"
2) "5"
3) "x-2"
4) "3"
5) "x-3"
6) "1"
127.0.0.1:6379> ZADD myset 3 x-2
(integer) 0
127.0.0.1:6379> ZRANGE myset 0 -1 WITHSCORES
1) "x-1"
2) "2"
3) "x-2"
4) "3"
####
127.0.0.1:6379> ZRANGE myset 0 -1 WITHSCORES
1) "x-3"
2) "1"
3) "x-1"
4) "2"
5) "x-2"
6) "3"
7) "x-4"
8) "5"
127.0.0.1:6379> ZRANGEBYSCORE myset -inf +inf WITHSCORES # ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count] 最小值到最大值之间的数据
1) "x-3"
2) "1"
3) "x-1"
4) "2"
5) "x-2"
6) "3"
7) "x-4"
8) "5"
127.0.0.1:6379> ZRANGEBYSCORE myset -inf +inf WITHSCORES LIMIT 2 2
1) "x-2"
2) "3"
3) "x-4"
4) "5"
127.0.0.1:6379> ZRANGEBYSCORE myset -inf +inf WITHSCORES LIMIT 0 2
1) "x-3"
2) "1"
3) "x-1"
4) "2"
127.0.0.1:6379> ZRANGEBYSCORE myset -inf +inf WITHSCORES LIMIT 1 3
1) "x-1"
2) "2"
3) "x-2"
4) "3"
5) "x-4"
6) "5"
127.0.0.1:6379> ZREVRANGEBYSCORE myset +inf -inf WITHSCORES LIMIT 1 3 # ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count] 最大值到最小值之间的数据
1) "x-2"
2) "3"
3) "x-1"
4) "2"
5) "x-3"
6) "1"
127.0.0.1:6379> ZREVRANGEBYSCORE myset +inf -inf WITHSCORES
1) "x-4"
2) "5"
3) "x-2"
4) "3"
5) "x-1"
6) "2"
7) "x-3"
8) "1"
####
127.0.0.1:6379> ZREM myset x-1 # ZREM key member [member ...] 删除一个值
(integer) 1
127.0.0.1:6379> ZRANGEBYSCORE myset -inf +inf
1) "x-3"
2) "x-2"
3) "x-4"
127.0.0.1:6379> zcard myset # ZCARD key 获取个数
(integer) 3
127.0.0.1:6379> ZREVRANGE myset 0 -1 withscores
1) "x-4"
2) "5"
3) "x-2"
4) "3"
5) "x-3"
6) "1"
127.0.0.1:6379> ZCOUNT myset 1 3 # ZCOUNT key min max 获取指定分数区间
(integer) 2
127.0.0.1:6379> ZCOUNT myset 1 2
(integer) 1
127.0.0.1:6379> ZCOUNT myset 1 5
(integer) 3
```

应用场景，带权重的列表都可以做。

### 特殊数据类型

#### geospatial 地理位置

Redis Geo 可以推算地理位置的信息，两地之间的距离

```sh
127.0.0.1:6379> GEOADD geo 113.280637 23.125178 gz 113.382391  22.521113 zs 121.472644 31.231706 shh
(integer) 3
127.0.0.1:6379> GEOADD geo 114.085947 22.547 sz # GEOADD key longitude latitude member [longitude latitude member ...] key 经度 纬度 名称
(integer) 1
127.0.0.1:6379> GEOADD geo 120.153576 30.287459 hz 109.08816 34.53483 xa
(integer) 2
127.0.0.1:6379> GEOPOS geo sz gz # GEOPOS key member [member ...] 获取指定城市的经度纬度
1) 1) "114.08594459295272827"
   2) "22.54699993773966327"
2) 1) "113.28063815832138062"
   2) "23.12517743834835215
127.0.0.1:6379> GEODIST geo sz gz km # GEODIST key member1 member2 [unit] 两地的距离
"104.6426"
127.0.0.1:6379> GEODIST geo sz gz m
"104642.6221"
127.0.0.1:6379> GEORADIUS geo 110 30 1000 km WITHCOORD WITHDIST WITHHASH COUNT 3 DESC # GEORADIUS key longitude latitude radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key] 以某一个纬度为中心，查看半径多少的城市
1) 1) "hz"
   2) "976.8197"
   3) (integer) 4054134271990931
   4) 1) "120.15357345342636108"
      2) "30.28745790721532671"
2) 1) "sz"
   2) "923.4929"
   3) (integer) 4046433733682118
   4) 1) "114.08594459295272827"
      2) "22.54699993773966327"
3) 1) "zs"
   2) "897.5039"
   3) (integer) 4046330583156115
   4) 1) "113.38239043951034546"
      2) "22.52111283053933022"
127.0.0.1:6379> GEORADIUSBYMEMBER geo sz 1000 km WITHDIST # GEORADIUSBYMEMBER key member radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key] 以某一个值为中心，查看半径多少的城市
1) 1) "zs"
   2) "72.3365"
2) 1) "sz"
   2) "0.0000"
3) 1) "gz"
   2) "104.6426"
```

#### Hyperloglog

基数（不重复的元素），可以接受误差

Redis Hyperloglog 基数统计的算法！占用内存固定。误差率 0.81%

```sh
127.0.0.1:6379> PFADD mykey a b c d e f g h i j # PFADD key element [element ...] 创建一组元素
(integer) 1
127.0.0.1:6379> PFCOUNT mykey # PFCOUNT key [key ...] 统计元素个数
(integer) 10
127.0.0.1:6379> PFADD mykey a b c d e f g h i j
(integer) 0
127.0.0.1:6379> PFCOUNT mykey
(integer) 10
127.0.0.1:6379> PFADD mykey a
(integer) 0
127.0.0.1:6379> PFCOUNT mykey
(integer) 10
127.0.0.1:6379> PFADD mykey1 a a b c d e f g h i j
(integer) 1
127.0.0.1:6379> PFCOUNT mykey1
(integer) 10
127.0.0.1:6379> PFMERGE mykey3 mykey1 mykey # PFMERGE destkey sourcekey [sourcekey ...] 合并两组数据
OK
127.0.0.1:6379> PFCOUNT mykey3
(integer) 10
127.0.0.1:6379> PFADD mykey1 a a b c d e f g h i j fd
(integer) 1
127.0.0.1:6379> PFMERGE mykey3 mykey1 mykey
OK
127.0.0.1:6379> PFCOUNT mykey3
(integer) 11
```

#### Bitmaps

位存储，bitmaps 位图，使用二进制来记录，只有0或1的状态

```sh
127.0.0.1:6379> SETBIT sign 0 0 # SETBIT key offset value 设置
(integer) 0
127.0.0.1:6379> SETBIT sign 1 0 
(integer) 0
127.0.0.1:6379> SETBIT sign 2 1
(integer) 0
127.0.0.1:6379> SETBIT sign 3 1
(integer) 0
127.0.0.1:6379> SETBIT sign 4 1
(integer) 0
127.0.0.1:6379> SETBIT sign 5 0
(integer) 0
127.0.0.1:6379> SETBIT sign 6 1
(integer) 0
127.0.0.1:6379> BITCOUNT sign # BITCOUNT key [start end] 1的次数
(integer) 4
127.0.0.1:6379> GETBIT sign 6 # GETBIT key offset 获取某个位置的状态
(integer) 1
```

### 事务

redis 事务本质：一组命令的集合！一个事务中所有命令都会被序列化，在事务执行的过程中会按照顺序执行！

一次性、顺序性，排他性的执行一系列命令

```
---- 队列 set set set 队列 ----
```

Redis 事务没有隔离级别的概念

所有的命令在事务中并没有被执行，只有发起执行命令的时候才会执行！

Redis 的事务

* 开启事务（MULTI）
* 命令入队
* 执行（exec）

```sh
127.0.0.1:6379> MULTI	# 开启事务
OK
127.0.0.1:6379> set k1 v1 # 入队
QUEUED
127.0.0.1:6379> set k2 v2
QUEUED
127.0.0.1:6379> set k3 v3
QUEUED
127.0.0.1:6379> get k2
QUEUED
127.0.0.1:6379> exec # 执行事务
1) OK
2) OK
3) OK
4) "v2"
127.0.0.1:6379> MULTI # 开启事务
OK
127.0.0.1:6379> get k2
QUEUED
127.0.0.1:6379> set k4 v4
QUEUED
127.0.0.1:6379> DISCARD	
OK
127.0.0.1:6379> get k4 # 放弃事务
(nil)
```

编译型异常（代码有问题！），事务都不会被执行

```sh
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379> set k1 v1
QUEUED
127.0.0.1:6379> get v1
QUEUED
127.0.0.1:6379> gets v1
(error) ERR unknown command `gets`, with args beginning with: `v1`,
127.0.0.1:6379> EXEC
(error) EXECABORT Transaction discarded because of previous errors.
127.0.0.1:6379> get v1
(nil)
```

运行型异常，执行命令的时候，中间有运行时错误，其他命令是可以正常设置，单条抛出错误

```sh
127.0.0.1:6379> set k1 "v1"
OK
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379> INCR k1
QUEUED
127.0.0.1:6379> set k2 v2
QUEUED
127.0.0.1:6379> get k2
QUEUED
127.0.0.1:6379> get k1
QUEUED
127.0.0.1:6379> exec
1) (error) ERR value is not an integer or out of range
2) OK
3) "v2"
4) "v1"
127.0.0.1:6379> get k2
"v2"
```

#### 悲观锁

什么时候都会出问题，无论做什么都加锁

#### 乐观锁

认为什么时候都不会出问题，所以不会上锁，更新数据的时候去判断一下，在此期间判断是否有人修改过数据

获取 version

更新的时候比较 version

#### redis 的监控设置

```sh
127.0.0.1:6379> set money 100
OK
127.0.0.1:6379> set out 0
OK
127.0.0.1:6379> watch money # 监视 money
OK
127.0.0.1:6379> multi # 事务正常结束 数据期间没有发生变动，正常执行成功
OK
127.0.0.1:6379> DECRBY money 20
QUEUED
127.0.0.1:6379> INCRBY out 20
QUEUED
127.0.0.1:6379> EXEC
1) (integer) 80
2) (integer) 20
127.0.0.1:6379> get money
"80"
127.0.0.1:6379> get out
"20"
```

#### 多线程修改值

```sh
# 1
127.0.0.1:6379> get money
"80"
127.0.0.1:6379> watch money # 监视的时候先获取这个值，当事务执行的时候，比较值，如果不相等，则执行失败
OK
# 2 
127.0.0.1:6379> set money 1001
OK
# 3
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379> DECRBY money 20
QUEUED
127.0.0.1:6379> INCRBY out 20
QUEUED
127.0.0.1:6379>
127.0.0.1:6379> EXEC
(nil)
```

```sh
# 1. 如果发现事务执行失败，则先解锁
127.0.0.1:6379> UNWATCH
OK
# 2. 再次监视
127.0.0.1:6379> watch money
OK
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379> DECRBY money 10
QUEUED
127.0.0.1:6379> INCRBY out 10
QUEUED
127.0.0.1:6379> exec
1) (integer) 991
2) (integer) 40
```

### redis.conf

```sh
# Redis configuration file example.
#
# Note that in order to read the configuration file, Redis must be
# started with the file path as first argument:
#
# ./redis-server /path/to/redis.conf

# Note on units: when memory size is needed, it is possible to specify
# it in the usual form of 1k 5GB 4M and so forth:
#
# 1k => 1000 bytes
# 1kb => 1024 bytes
# 1m => 1000000 bytes
# 1mb => 1024*1024 bytes
# 1g => 1000000000 bytes
# 1gb => 1024*1024*1024 bytes
#
# units are case insensitive so 1GB 1Gb 1gB are all the same.
# 配置文件对大小写不敏感
################################## INCLUDES ###################################

# Include one or more other config files here.  This is useful if you
# have a standard template that goes to all Redis servers but also need
# to customize a few per-server settings.  Include files can include
# other files, so use this wisely.
#
# Notice option "include" won't be rewritten by command "CONFIG REWRITE"
# from admin or Redis Sentinel. Since Redis always uses the last processed
# line as value of a configuration directive, you'd better put includes
# at the beginning of this file to avoid overwriting config change at runtime.
#
# If instead you are interested in using includes to override configuration
# options, it is better to use include as the last line.
#
# include /path/to/local.conf
# include /path/to/other.conf
# 允许整合引入配置，可以组合多个配置文件

################################## NETWORK #####################################

# By default, if no "bind" configuration directive is specified, Redis listens
# for connections from all the network interfaces available on the server.
# It is possible to listen to just one or multiple selected interfaces using
# the "bind" configuration directive, followed by one or more IP addresses.
#
# Examples:
#
# bind 192.168.1.100 10.0.0.1
# bind 127.0.0.1 ::1
#
# ~~~ WARNING ~~~ If the computer running Redis is directly exposed to the
# internet, binding to all the interfaces is dangerous and will expose the
# instance to everybody on the internet. So by default we uncomment the
# following bind directive, that will force Redis to listen only into
# the IPv4 loopback interface address (this means Redis will be able to
# accept connections only from clients running into the same computer it
# is running).
#
# IF YOU ARE SURE YOU WANT YOUR INSTANCE TO LISTEN TO ALL THE INTERFACES
# JUST COMMENT THE FOLLOWING LINE.
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
bind 127.0.0.1 ::1 # 绑定端口号

# Protected mode is a layer of security protection, in order to avoid that
# Redis instances left open on the internet are accessed and exploited.
#
# When protected mode is on and if:
#
# 1) The server is not binding explicitly to a set of addresses using the
#    "bind" directive.
# 2) No password is configured.
#
# The server only accepts connections from clients connecting from the
# IPv4 and IPv6 loopback addresses 127.0.0.1 and ::1, and from Unix domain
# sockets.
#
# By default protected mode is enabled. You should disable it only if
# you are sure you want clients from other hosts to connect to Redis
# even if no authentication is configured, nor a specific set of interfaces
# are explicitly listed using the "bind" directive.
protected-mode yes # 受保护模式 默认开启
# Accept connections on the specified port, default is 6379 (IANA #815344).
# If port 0 is specified Redis will not listen on a TCP socket.
port 6379 # 默认端口号

################################# GENERAL #####################################

# By default Redis does not run as a daemon. Use 'yes' if you need it.
# Note that Redis will write a pid file in /usr/local/var/run/redis.pid when daemonized.
daemonize no # 以守护进程方式运行

# If you run Redis from upstart or systemd, Redis can interact with your
# supervision tree. Options:
#   supervised no      - no supervision interaction
#   supervised upstart - signal upstart by putting Redis into SIGSTOP mode
#   supervised systemd - signal systemd by writing READY=1 to $NOTIFY_SOCKET
#   supervised auto    - detect upstart or systemd method based on
#                        UPSTART_JOB or NOTIFY_SOCKET environment variables
# Note: these supervision methods only signal "process is ready."
#       They do not enable continuous liveness pings back to your supervisor.
supervised no 

# If a pid file is specified, Redis writes it where specified at startup
# and removes it at exit.
#
# When the server runs non daemonized, no pid file is created if none is
# specified in the configuration. When the server is daemonized, the pid file
# is used even if not specified, defaulting to "/usr/local/var/run/redis.pid".
#
# Creating a pid file is best effort: if Redis is not able to create it
# nothing bad happens, the server will start and run normally.
pidfile /var/run/redis_6379.pid # 如果是以后台方式运行，则需要指定一个pid

# Specify the server verbosity level.
# This can be one of:
# debug (a lot of information, useful for development/testing)
# verbose (many rarely useful info, but not a mess like the debug level)
# notice (moderately verbose, what you want in production probably)
# warning (only very important / critical messages are logged)
loglevel notice

# Specify the log file name. Also the empty string can be used to force
# Redis to log on the standard output. Note that if you use standard
# output for logging but daemonize, logs will be sent to /dev/null
logfile "" # 日志文件位置

# To enable logging to the system logger, just set 'syslog-enabled' to yes,
# and optionally update the other syslog parameters to suit your needs.
# syslog-enabled no

# Specify the syslog identity.
# syslog-ident redis

# Specify the syslog facility. Must be USER or between LOCAL0-LOCAL7.
# syslog-facility local0

# Set the number of databases. The default database is DB 0, you can select
# a different one on a per-connection basis using SELECT <dbid> where
# dbid is a number between 0 and 'databases'-1
databases 16 # 数据库数量 ，默认16个
...
# 持久化规则
################################ SNAPSHOTTING  ################################
#
# Save the DB on disk:
#
#   save <seconds> <changes>
#
#   Will save the DB if both the given number of seconds and the given
#   number of write operations against the DB occurred.
#
#   In the example below the behaviour will be to save:
#   after 900 sec (15 min) if at least 1 key changed
#   after 300 sec (5 min) if at least 10 keys changed
#   after 60 sec if at least 10000 keys changed
#
#   Note: you can disable saving completely by commenting out all "save" lines.
#
#   It is also possible to remove all the previously configured save
#   points by adding a save directive with a single empty string argument
#   like in the following example:
#
#   save ""

save 900 1 # 如果900秒内，至少有一个key被修改，就进行持久化操作
save 300 10 # 300秒内对10个key修改，进行持久化操作
save 60 10000 # 60秒内，如果至少10000 key进行修改，进行持久化操作

# By default Redis will stop accepting writes if RDB snapshots are enabled
# (at least one save point) and the latest background save failed.
# This will make the user aware (in a hard way) that data is not persisting
# on disk properly, otherwise chances are that no one will notice and some
# disaster will happen.
#
# If the background saving process will start working again Redis will
# automatically allow writes again.
#
# However if you have setup your proper monitoring of the Redis server
# and persistence, you may want to disable this feature so that Redis will
# continue to work as usual even if there are problems with disk,
# permissions, and so forth.
stop-writes-on-bgsave-error yes # 持久化失败是否重试
# Compress string objects using LZF when dump .rdb databases?
# For default that's set to 'yes' as it's almost always a win.
# If you want to save some CPU in the saving child set it to 'no' but
# the dataset will likely be bigger if you have compressible values or keys.
rdbcompression yes # 是否压缩 rdb 文件，需要消耗CPU资源
# Since version 5 of RDB a CRC64 checksum is placed at the end of the file.
# This makes the format more resistant to corruption but there is a performance
# hit to pay (around 10%) when saving and loading RDB files, so you can disable it
# for maximum performances.
#
# RDB files created with checksum disabled have a checksum of zero that will
# tell the loading code to skip the check.
rdbchecksum yes # 保存后rdb文件时候，进行错误检查
...
# The working directory.
#
# The DB will be written inside this directory, with the filename specified
# above using the 'dbfilename' configuration directive.
#
# The Append Only File will also be created inside this directory.
#
# Note that you must specify a directory here, not a file name.
dir /usr/local/var/db/redis/ # rdb 文件目录
################################## SECURITY ###################################

# Require clients to issue AUTH <PASSWORD> before processing any other
# commands.  This might be useful in environments in which you do not trust
# others with access to the host running redis-server.
#
# This should stay commented out for backward compatibility and because most
# people do not need auth (e.g. they run their own servers).
#
# Warning: since Redis is pretty fast an outside user can try up to
# 150k passwords per second against a good box. This means that you should
# use a very strong password otherwise it will be very easy to break.
#
# requirepass foobared # 配置密码

# Command renaming.
#
# It is possible to change the name of dangerous commands in a shared
# environment. For instance the CONFIG command may be renamed into something
# hard to guess so that it will still be available for internal-use tools
# but not available for general clients.
#
# Example:
#
# rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52
#
# It is also possible to completely kill a command by renaming it into
# an empty string:
#
# rename-command CONFIG ""
#
# Please note that changing the name of commands that are logged into the
# AOF file or transmitted to replicas may cause problems.
################################### CLIENTS ####################################

# Set the max number of connected clients at the same time. By default
# this limit is set to 10000 clients, however if the Redis server is not
# able to configure the process file limit to allow for the specified limit
# the max number of allowed clients is set to the current file limit
# minus 32 (as Redis reserves a few file descriptors for internal uses).
#
# Once the limit is reached Redis will close all the new connections sending
# an error 'max number of clients reached'.
#
# maxclients 10000 # 最大客户端连接数
############################## MEMORY MANAGEMENT ################################

# Set a memory usage limit to the specified amount of bytes.
# When the memory limit is reached Redis will try to remove keys
# according to the eviction policy selected (see maxmemory-policy).
#
# If Redis can't remove keys according to the policy, or if the policy is
# set to 'noeviction', Redis will start to reply with errors to commands
# that would use more memory, like SET, LPUSH, and so on, and will continue
# to reply to read-only commands like GET.
#
# This option is usually useful when using Redis as an LRU or LFU cache, or to
# set a hard memory limit for an instance (using the 'noeviction' policy).
#
# WARNING: If you have replicas attached to an instance with maxmemory on,
# the size of the output buffers needed to feed the replicas are subtracted
# from the used memory count, so that network problems / resyncs will
# not trigger a loop where keys are evicted, and in turn the output
# buffer of replicas is full with DELs of keys evicted triggering the deletion
# of more keys, and so forth until the database is completely emptied.
#
# In short... if you have replicas attached it is suggested that you set a lower
# limit for maxmemory so that there is some free RAM on the system for replica
# output buffers (but this is not needed if the policy is 'noeviction').
#
# maxmemory <bytes> # 默认配置的内存容量
# MAXMEMORY POLICY: how Redis will select what to remove when maxmemory
# is reached. You can select among five behaviors:
#
# volatile-lru -> Evict using approximated LRU among the keys with an expire set.
# allkeys-lru -> Evict any key using approximated LRU.
# volatile-lfu -> Evict using approximated LFU among the keys with an expire set.
# allkeys-lfu -> Evict any key using approximated LFU.
# volatile-random -> Remove a random key among the ones with an expire set.
# allkeys-random -> Remove a random key, any key.
# volatile-ttl -> Remove the key with the nearest expire time (minor TTL)
# noeviction -> Don't evict anything, just return an error on write operations.
#
# LRU means Least Recently Used
# LFU means Least Frequently Used
#
# Both LRU, LFU and volatile-ttl are implemented using approximated
# randomized algorithms.
#
# Note: with any of the above policies, Redis will return an error on write
#       operations, when there are no suitable keys for eviction.
#
#       At the date of writing these commands are: set setnx setex append
#       incr decr rpush lpush rpushx lpushx linsert lset rpoplpush sadd
#       sinter sinterstore sunion sunionstore sdiff sdiffstore zadd zincrby
#       zunionstore zinterstore hset hsetnx hmset hincrby incrby decrby
#       getset mset msetnx exec sort
#
# The default is:
#
# maxmemory-policy noeviction # 内存达到上线的处理策略

############################## APPEND ONLY MODE ###############################

# By default Redis asynchronously dumps the dataset on disk. This mode is
# good enough in many applications, but an issue with the Redis process or
# a power outage may result into a few minutes of writes lost (depending on
# the configured save points).
#
# The Append Only File is an alternative persistence mode that provides
# much better durability. For instance using the default data fsync policy
# (see later in the config file) Redis can lose just one second of writes in a
# dramatic event like a server power outage, or a single write if something
# wrong with the Redis process itself happens, but the operating system is
# still running correctly.
#
# AOF and RDB persistence can be enabled at the same time without problems.
# If the AOF is enabled on startup Redis will load the AOF, that is the file
# with the better durability guarantees.
#
# Please check http://redis.io/topics/persistence for more information.

appendonly no # aof 配置，默认不开启，使用rdb
# The name of the append only file (default: "appendonly.aof")

appendfilename "appendonly.aof" # aof 配置默认文件

# appendfsync always # 每次修改都会同步，消耗性能
appendfsync everysec # 每秒执行一次，可能丢失这 1s 的数据
# appendfsync no # 不执行同步，操作系统自己同步数据
```

#### 网络

```sh
bind 127.0.0.1 ::1 # 绑定端口号
protected-mode yes # 受保护模式 默认开启
port 6379 # 默认端口号
```

#### 通用配置

```sh
daemonize no # 以守护进程方式运行
pidfile /var/run/redis_6379.pid # 如果是以后台方式运行，则需要指定一个pid

logfile "" # 日志文件位置
databases 16 # 数据库数量 ，默认16个
```

#### 持久化配置

```sh
save 900 1 # 如果900秒内，至少有一个key被修改，就进行持久化操作
save 300 10 # 300秒内对10个key修改，进行持久化操作
save 60 10000 # 60秒内，如果至少10000 key进行修改，进行持久化操作
stop-writes-on-bgsave-error yes # 持久化失败是否重试
rdbcompression yes # 是否压缩 rdb 文件，需要消耗CPU资源
rdbchecksum yes # 保存后rdb文件时候，进行错误检查
dir /usr/local/var/db/redis/ # rdb 文件目录
```

#### 安全

```sh
requirepass foobared # 配置密码
```

#### 客户端

```sh
maxclients 10000 # 最大客户端连接数
maxmemory <bytes> # 默认配置的内存容量
maxmemory-policy noeviction # 内存达到上线的处理策略
 volatile-lru # 只对设置过期时间的 key 进行LRU
 allkeys-lru # 删除LRU算法的key
 volatile-random-lru # 随机删除过期 key
 allkeys-random # 随机删除
 volatile-ttl # 删除即将过期
 noeviction # 永不过期，直接抛错
```

#### AOF 配置

```sh
appendonly no # aof 配置，默认不开启，使用rdb
appendfilename "appendonly.aof" # aof 配置默认文件
# appendfsync always # 每次修改都会同步，消耗性能
appendfsync everysec # 每秒执行一次，可能丢失这 1s 的数据
# appendfsync no # 不执行同步，操作系统自己同步数据
```

## redis 持久化

Redis 是内存数据库，如果不做持久化，数据就很容易丢失

#### RDB(Redis DataBase)

在指定的时间间隔内将内存中的数据集快照写入磁盘，Snapshot快照，它恢复时将快照文件直接读到内存里。

Redis 会单独创建一个子进程来进行持久化，将数据写入一个临时文件中，等持久化过程结束后，在用临时文件替换上次持久化号到文件，整个过程不影响主进程，不需要主进程进行任何IO操作，确保了高性能。

如果需要大规模的数据恢复，且对数据恢复的完整性不是非常敏感，则RDB比AOF更加高效。

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200606103248219.png" alt="image-20200606103248219" style="zoom:50%;" />

##### 优点：

1. 适合大规模的数据恢复！dump.rdb
2. 对数据完整性要求不高！

##### 缺点

1. 如果最后一次持久化宕机了，的数据可能丢失
2. 需要一定的时间间隔进程操作
3. fork进程会占用一定的内存空间

默认保存文件 dump.rdb

##### 触发机制：

	1. Save 规则满足
 	2. 执行 flushall 
 	3. 退出 redis

备份自动生成一个 dump.rdb

只需要把 rdb 文件放到redis启动的目录，就可以在redis启动的时候自动检查，恢复数据

#### AOF（Append Only File）

将所有写命令都记录下来，恢复的时候，就再把这个文件全部执行一遍

用日志的形式记录每个写操作，将Redis执行过的指令都记录下来，只许追加文件但不改写文件，启动时重新构建数据。

备份自动生成一个 append only.aof

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200606110817924.png" alt="image-20200606110817924" style="zoom:50%;" />

优点：

1. 每次修改都同步，文件完整性更好
2. 默认每秒同步一次，可能会丢失一秒的数据
3. 从不同步，效率最高

缺点：

1. 相对于数据文件，aof远远大于rdb，修复速度比rdb慢
2. 运行效率比rdb慢

## Redis 发布订阅

Redis 发布订阅（pub/sub）是一种消息通信模式：发送者（pub）发送消息，订阅者（sub）接收消息

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200606114029767.png" alt="image-20200606114029767" style="zoom:50%;" />

```sh
# 订阅一个频道
127.0.0.1:6379> SUBSCRIBE xhl # SUBSCRIBE channel [channel ...] 订阅某个频道
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "xhl"
3) (integer) 1
1) "message"
2) "xhl"
3) "hello"
1) "message"
2) "xhl"
3) "123"
# 发送端
127.0.0.1:6379> PUBLISH xhl hello # PUBLISH channel message 往频道扔消息 
(integer) 1
127.0.0.1:6379> PUBLISH xhl 123
(integer) 1
```

使用场景：

1. 实时消息系统
2. 实时聊天
3. 关注系统

## Redis 主从复制

#### 概念

主从复制，是指将一台 Redis 服务器的数据，复制到其他的 Redis 服务器，前者称为主节点（master/leader），后者称为从节点（slave/follower）；数据的复制是单向的，只能从主节点到从节点，主节点以写为主，从节点以读为主。

默认情况下，每台 Redis 都是主节点，且一个主节点可以有多个从节点，但是一个从节点只能有一个主节点。

作用：

1. 数据冗余：主从复制实现了数据的热备份，是持久化之外的数据冗余方式
2. 故障恢复：当主节点出现问题时，可以由从节点提供服务，实现快速的故障恢复
3. 负载均衡：在主从复制的基础上，配合读写分离，由主节点提供写服务，由从鸡诶单提供读服务，分担服务器负载，在写少读多点场景下，多个从节点分担负载，可以大大提高Redis服务器的并发量
4. 高可用（集群）基石：主从复制是哨兵和集群能够实施的基础。

#### 环境配置

只需要配置从库，默认是主机

```sh
info replication
# Replication
role:master
connected_slaves:0
master_replid:a89eafbc374291f4479325b2170dfda0e72a3b3f
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
```

复制配置文件，修改

```sh
daemonize yes # 以守护进程方式运行
# 端口号
port 6379
# pid 名字
pidfile /var/run/redis_6379.pid # 如果是以后台方式运行，则需要指定一个pid
# log 文件名字
logfile "6379.log" # 日志文件位置
# dump.rdb 名字
dbfilename dump6379.rdb
```

启动 redis-server

```sh
➜  etc redis-server redis79.conf
➜  etc redis-server redis80.conf
➜  etc redis-server redis81.conf
➜  ~ ps -fe | grep redis
  501 16626     1   0  2:35下午 ??         0:00.16 redis-server 127.0.0.1:6379
  501 16647     1   0  2:35下午 ??         0:00.13 redis-server 127.0.0.1:6380
  501 16657     1   0  2:35下午 ??         0:00.12 redis-server 127.0.0.1:6381
➜  etc redis-cli -p 6379
127.0.0.1:6379> ping
PONG
➜  ~ redis-cli -p 6380
127.0.0.1:6380> ping
PONG
➜  ~ redis-cli -p 6381
127.0.0.1:6381> ping
PONG
```

丛机配置

```sh
# 127.0.0.1:6380
127.0.0.1:6380> SLAVEOF 127.0.0.1 6379 # 配置主机
OK
127.0.0.1:6380> info replacation
127.0.0.1:6380> info repliacation
127.0.0.1:6380> info replication
# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:up
master_last_io_seconds_ago:6
master_sync_in_progress:0
slave_repl_offset:28
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:11280f3fda4f9ce019d48cdf6e0f37225579e5fd
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:28
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:28
# 127.0.0.1:6381
127.0.0.1:6381> SLAVEOF 127.0.0.1 6379
OK
127.0.0.1:6381> info replication
# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:up
master_last_io_seconds_ago:1
master_sync_in_progress:0
slave_repl_offset:56
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:11280f3fda4f9ce019d48cdf6e0f37225579e5fd
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:56
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:43
repl_backlog_histlen:14
```

完成配置

```sh
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=127.0.0.1,port=6380,state=online,offset=323,lag=1
slave1:ip=127.0.0.1,port=6381,state=online,offset=323,lag=
master_replid:11280f3fda4f9ce019d48cdf6e0f37225579e5fd
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:323
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:323

127.0.0.1:6379> set from6379 1
OK
127.0.0.1:6380> get from6379
"1"
127.0.0.1:6381> get from6379
"1"
```

主机负责写，从机只有读操作。

主机断开链接，从机依旧连接主机，且没有写操作，如果主机重新连接，就可以直接获取到主机信息

如果从机断开，只要变成从机，就可以立即从主机读取到信息

#### 复制原理

从机启动成功连接到主机后，会发送一个同步命令

主机接到命令后会启动后台进程，同时收集接收到的修改命令，后台执行完毕后，直接传送整个文件到从机，完成一次同步。

全量复制：从机接收到数据库文件数据后，将起存盘并加载到内存中

增量复制：主机继续讲新的命令传给主机，完成同步

#### 普通模型

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200606151355877.png" alt="image-20200606151355877" style="zoom:50%;" />

#### 毛毛虫模型

![image-20200606151252741](/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200606151252741.png)

如果主机断开，需要手动设置中间从机为主机

```
SLAVEOF no one
```

## 哨兵模式（自动选取主机模式）

主从复制在服务器故障的情况下，需要手动干预，比较麻烦，所以需要哨兵架构来解决问题

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200606152211472.png" alt="image-20200606152211472" style="zoom:50%;" />

哨兵通过发送命令，等待redis服务器响应，从而监控多个redis实例是否正常运行

哨兵的作用

1. 通过发送命令，让redis服务返回其运行状态
2. 当主机宕机，将自动切换从机变为主机，通过发布订阅模式通知其他从服务器，修改配置文件，让他们切换成主机

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200606152846061.png" alt="image-20200606152846061" style="zoom:50%;" />

假设主服务器宕机

哨兵1检测到这个结果，哨兵1会主观认为主服务器不可用，称为主观下线。

当后面的其他哨兵也检查服务器不可用，且达到一定的值。

哨兵直接就会进行投票，投票结果由一个哨兵发起。

进行故障转移，切换成功后，就会通过发布订阅模式，让各个哨兵把自己监控的从服务器，切换成主机，称为客观下线。

#### 配置

1. 配置哨兵配置文件

   ```sh
   # sentinel monitor name host port 1
   sentinel monitor myredis 127.0.0.1 6379 1
   ```

2. 启动哨兵

   ```sh
   redis-sentinel sentinel.conf
   ```

3. 主机宕机

   ```sh
   16955:X 06 Jun 2020 15:41:08.498 # Sentinel ID is d4c1dba5960c5193c05a3ffa0378b784cebfb39d
   16955:X 06 Jun 2020 15:41:08.498 # +monitor master myredis 127.0.0.1 6379 quorum 1
   16955:X 06 Jun 2020 15:41:08.500 * +slave slave 127.0.0.1:6380 127.0.0.1 6380 @ myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:41:08.501 * +slave slave 127.0.0.1:6381 127.0.0.1 6381 @ myredis 127.0.0.1 6379
   
   16955:X 06 Jun 2020 15:43:26.901 # +sdown master myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:26.901 # +odown master myredis 127.0.0.1 6379 #quorum 1/1
   16955:X 06 Jun 2020 15:43:26.901 # +new-epoch 1
   16955:X 06 Jun 2020 15:43:26.901 # +try-failover master myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:26.904 # +vote-for-leader d4c1dba5960c5193c05a3ffa0378b784cebfb39d 1
   16955:X 06 Jun 2020 15:43:26.904 # +elected-leader master myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:26.904 # +failover-state-select-slave master myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:26.984 # +selected-slave slave 127.0.0.1:6380 127.0.0.1 6380 @ myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:26.984 * +failover-state-send-slaveof-noone slave 127.0.0.1:6380 127.0.0.1 6380 @ myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:27.036 * +failover-state-wait-promotion slave 127.0.0.1:6380 127.0.0.1 6380 @ myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:28.004 # +promoted-slave slave 127.0.0.1:6380 127.0.0.1 6380 @ myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:28.004 # +failover-state-reconf-slaves master myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:28.107 * +slave-reconf-sent slave 127.0.0.1:6381 127.0.0.1 6381 @ myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:29.093 * +slave-reconf-inprog slave 127.0.0.1:6381 127.0.0.1 6381 @ myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:29.093 * +slave-reconf-done slave 127.0.0.1:6381 127.0.0.1 6381 @ myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:29.163 # +failover-end master myredis 127.0.0.1 6379
   16955:X 06 Jun 2020 15:43:29.163 # +switch-master myredis 127.0.0.1 6379 127.0.0.1 6380
   16955:X 06 Jun 2020 15:43:29.164 * +slave slave 127.0.0.1:6381 127.0.0.1 6381 @ myredis 127.0.0.1 6380
   16955:X 06 Jun 2020 15:43:29.164 * +slave slave 127.0.0.1:6379 127.0.0.1 6379 @ myredis 127.0.0.1 6380
   16955:X 06 Jun 2020 15:43:59.203 # +sdown slave 127.0.0.1:6379 127.0.0.1 6379 @ myredis 127.0.0.1 6380
   ```

4. 如果之前主机回来了，只能当作当前主机的从机

##### 优点

1. 哨兵集群，基于主从复制模式
2. 主从可以切换，故障可以专业，系统可用性更好
3. 哨兵模式自动，更加健壮

##### 缺点

1. redis不好在线扩容，集群容量达到上限，在线扩容十分麻烦
2. 配置相当麻烦

##### 配置文件

```sh
# Example sentinel.conf

# *** IMPORTANT ***
#
# By default Sentinel will not be reachable from interfaces different than
# localhost, either use the 'bind' directive to bind to a list of network
# interfaces, or disable protected mode with "protected-mode no" by
# adding it to this configuration file.
#
# Before doing that MAKE SURE the instance is protected from the outside
# world via firewalling or other means.
#
# For example you may use one of the following:
#
# bind 127.0.0.1 192.168.1.1
#
# protected-mode no

# port <sentinel-port>
# The port that this sentinel instance will run on
port 26379 # 端口号

# By default Redis Sentinel does not run as a daemon. Use 'yes' if you need it.
# Note that Redis will write a pid file in /var/run/redis-sentinel.pid when
# daemonized.
daemonize no # 守护进程运行

# When running daemonized, Redis Sentinel writes a pid file in
# /var/run/redis-sentinel.pid by default. You can specify a custom pid file 
# location here.
pidfile /var/run/redis-sentinel.pid # 守护进程 pid

# Specify the log file name. Also the empty string can be used to force
# Sentinel to log on the standard output. Note that if you use standard
# output for logging but daemonize, logs will be sent to /dev/null
logfile "" # log 文件

# sentinel announce-ip <ip>
# sentinel announce-port <port>
#
# The above two configuration directives are useful in environments where,
# because of NAT, Sentinel is reachable from outside via a non-local address.
#
# When announce-ip is provided, the Sentinel will claim the specified IP address
# in HELLO messages used to gossip its presence, instead of auto-detecting the
# local address as it usually does.
#
# Similarly when announce-port is provided and is valid and non-zero, Sentinel
# will announce the specified TCP port.
#
# The two options don't need to be used together, if only announce-ip is
# provided, the Sentinel will announce the specified IP and the server port
# as specified by the "port" option. If only announce-port is provided, the
# Sentinel will announce the auto-detected local IP and the specified port.
#
# Example:
#
# sentinel announce-ip 1.2.3.4

# dir <working-directory>
# Every long running process should have a well-defined working directory.
# For Redis Sentinel to chdir to /tmp at startup is the simplest thing
# for the process to don't interfere with administrative tasks such as
# unmounting filesystems.
dir /tmp # 哨兵工作目录

# sentinel monitor <master-name> <ip> <redis-port> <quorum>
#
# Tells Sentinel to monitor this master, and to consider it in O_DOWN
# (Objectively Down) state only if at least <quorum> sentinels agree.
#
# Note that whatever is the ODOWN quorum, a Sentinel will require to
# be elected by the majority of the known Sentinels in order to
# start a failover, so no failover can be performed in minority.
#
# Replicas are auto-discovered, so you don't need to specify replicas in
# any way. Sentinel itself will rewrite this configuration file adding
# the replicas using additional configuration options.
# Also note that the configuration file is rewritten when a
# replica is promoted to master.
#
# Note: master name should not include special characters or spaces.
# The valid charset is A-z 0-9 and the three characters ".-_".
sentinel monitor mymaster 127.0.0.1 6379 2 # 配置监控节点

# sentinel auth-pass <master-name> <password>
#
# Set the password to use to authenticate with the master and replicas.
# Useful if there is a password set in the Redis instances to monitor.
#
# Note that the master password is also used for replicas, so it is not
# possible to set a different password in masters and replicas instances
# if you want to be able to monitor these instances with Sentinel.
#
# However you can have Redis instances without the authentication enabled
# mixed with Redis instances requiring the authentication (as long as the
# password set is the same for all the instances requiring the password) as
# the AUTH command will have no effect in Redis instances with authentication
# switched off.
#
# Example:
#
# sentinel auth-pass mymaster MySUPER--secret-0123passw0rd # 配置带密码的主机

# sentinel down-after-milliseconds <master-name> <milliseconds>
#
# Number of milliseconds the master (or any attached replica or sentinel) should
# be unreachable (as in, not acceptable reply to PING, continuously, for the
# specified period) in order to consider it in S_DOWN state (Subjectively
# Down).
#
# Default is 30 seconds.
sentinel down-after-milliseconds mymaster 30000 # 等待时间

# sentinel parallel-syncs <master-name> <numreplicas>
#
# How many replicas we can reconfigure to point to the new replica simultaneously
# during the failover. Use a low number if you use the replicas to serve query
# to avoid that all the replicas will be unreachable at about the same
# time while performing the synchronization with the master.
sentinel parallel-syncs mymaster 1 # 并行同步时间

# sentinel failover-timeout <master-name> <milliseconds>
#
# Specifies the failover timeout in milliseconds. It is used in many ways:
#
# - The time needed to re-start a failover after a previous failover was
#   already tried against the same master by a given Sentinel, is two
#   times the failover timeout.
#
# - The time needed for a replica replicating to a wrong master according
#   to a Sentinel current configuration, to be forced to replicate
#   with the right master, is exactly the failover timeout (counting since
#   the moment a Sentinel detected the misconfiguration).
#
# - The time needed to cancel a failover that is already in progress but
#   did not produced any configuration change (SLAVEOF NO ONE yet not
#   acknowledged by the promoted replica).
#
# - The maximum time a failover in progress waits for all the replicas to be
#   reconfigured as replicas of the new master. However even after this time
#   the replicas will be reconfigured by the Sentinels anyway, but not with
#   the exact parallel-syncs progression as specified.
#
# Default is 3 minutes.
sentinel failover-timeout mymaster 180000 # 默认三分钟故障转移

# SCRIPTS EXECUTION
#
# sentinel notification-script and sentinel reconfig-script are used in order
# to configure scripts that are called to notify the system administrator
# or to reconfigure clients after a failover. The scripts are executed
# with the following rules for error handling:
#
# If script exits with "1" the execution is retried later (up to a maximum
# number of times currently set to 10).
#
# If script exits with "2" (or an higher value) the script execution is
# not retried.
#
# If script terminates because it receives a signal the behavior is the same
# as exit code 1.
#
# A script has a maximum running time of 60 seconds. After this limit is
# reached the script is terminated with a SIGKILL and the execution retried.

# NOTIFICATION SCRIPT
#
# sentinel notification-script <master-name> <script-path>
#
# Call the specified notification script for any sentinel event that is
# generated in the WARNING level (for instance -sdown, -odown, and so forth).
# This script should notify the system administrator via email, SMS, or any
# other messaging system, that there is something wrong with the monitored
# Redis systems.
#
# The script is called with just two arguments: the first is the event type
# and the second the event description.
#
# The script must exist and be executable in order for sentinel to start if
# this option is provided.
#
# Example:
#
# 故障通知通知
# sentinel notification-script mymaster /var/redis/notify.sh

# CLIENTS RECONFIGURATION SCRIPT
#
# sentinel client-reconfig-script <master-name> <script-path>
#
# When the master changed because of a failover a script can be called in
# order to perform application-specific tasks to notify the clients that the
# configuration has changed and the master is at a different address.
#
# The following arguments are passed to the script:
#
# <master-name> <role> <state> <from-ip> <from-port> <to-ip> <to-port>
#
# <state> is currently always "failover"
# <role> is either "leader" or "observer"
#
# The arguments from-ip, from-port, to-ip, to-port are used to communicate
# the old address of the master and the new address of the elected replica
# (now a master).
#
# This script should be resistant to multiple invocations.
#
# Example:
#
# 客户端重新配置通知脚本
# sentinel client-reconfig-script mymaster /var/redis/reconfig.sh

# SECURITY
#
# By default SENTINEL SET will not be able to change the notification-script
# and client-reconfig-script at runtime. This avoids a trivial security issue
# where clients can set the script to anything and trigger a failover in order
# to get the program executed.

sentinel deny-scripts-reconfig yes

# REDIS COMMANDS RENAMING
#
# Sometimes the Redis server has certain commands, that are needed for Sentinel
# to work correctly, renamed to unguessable strings. This is often the case
# of CONFIG and SLAVEOF in the context of providers that provide Redis as
# a service, and don't want the customers to reconfigure the instances outside
# of the administration console.
#
# In such case it is possible to tell Sentinel to use different command names
# instead of the normal ones. For example if the master "mymaster", and the
# associated replicas, have "CONFIG" all renamed to "GUESSME", I could use:
#
# SENTINEL rename-command mymaster CONFIG GUESSME
#
# After such configuration is set, every time Sentinel would use CONFIG it will
# use GUESSME instead. Note that there is no actual need to respect the command
# case, so writing "config guessme" is the same in the example above.
#
# SENTINEL SET can also be used in order to perform this configuration at runtime.
#
# In order to set a command back to its original name (undo the renaming), it
# is possible to just rename a command to itsef:
#
# SENTINEL rename-command mymaster CONFIG CONFIG
```

## 缓存穿透和雪崩

#### 缓存穿透（没找到缓存，请求）

用户查询一个数据，发现 redis 中没有，然后查询 mysql 发现也没有，如果大量查询则会让 mysql 崩溃

##### 解决方案

1. 布隆过滤器，布隆过滤器是一种数据结构，对所有可能查询的值以 hash 形式存储，在控制层先进行校样，不符合则丢弃，从而避免对底层存储系统的查询压力
2. 缓存空对象，当存储层不命中后，返回控对象也缓存，同时设置过期时间，之后再访问数据将在缓存中获取。
   1. 如果空值被存储，造成存储空间被浪费
   2. 即使对空值设置了过期时间，还是会存在一段时间的数据不一致

#### 缓存击穿（量太大，缓存过期）

一个 key 非常的热点，不停扛高并发，大并发集中在一个带你进行访问，当这个key失效的瞬间，持续的大并发会击穿缓存，直接请求数据库，导致数据库崩溃

##### 解决方案

1. 热点数据永不过时

2. 加互斥锁

   分布式锁，给每个 key 同时只有一个线程去查询后段服务，其他县城没有获得分布式锁的权限，因此只需要等待，这种方式实际是将高并发转移到分布式锁上，因此对分布式锁考验很大。

#### 缓存雪崩

在某一个时间段，缓存集中过期/redis 宕机！

##### 解决方案

1. Redis 高可用，加机器（异地多活）

2. 限流降级

   缓存失效后，通过加锁，或者队列控制数据库写缓存的线程数量。

3. 数据预热

   把数据先访问一边，这样可能大量访问的数据会加载在缓存中，在将发生高并发访问前手动触发加载缓存不同的key，设置不同的过期时间，让缓存失效的时间段尽量均匀，点射。




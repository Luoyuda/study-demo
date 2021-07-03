# MySQL

## 数据库 （DB，DataBase）

数据仓库，用于存储数据，管理数据

### 数据库分类

关系型数据库（SQL）

* MySQL，Oracle，Sql Server
* 通过表和表之间，行和列之间关系进行数据的存储

非关系型数据库（NoSQL） Not Only

* Redis，MongoDB
* 对象存储，通过自身属性决定存储

DBMS（数据库管理系统）

* 数据库管理软件，科学有效的管理我们的数据 。
* MySQL

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200607093019620.png" alt="image-20200607093019620" style="zoom:50%;" />

## MySQL

MySQL 是一个关系型数据库管理系统，是最好的RDBMS之一，体积小、速度快、可免费可付费、可集群

#### 配置文件

```sh
# my.ini / my.cnf
basedir= #配置目录
datadir= #数据库存放目录
port=3306 #端口号
skip-grant-tables # 免密码登陆
```

#### 连接数据库

```sh
# -u用户名 -p密码 -hHost -PPort
mysql -uroot -p123456 -h127.0.0.1 -P3310
mysql> flush privileges; # 刷新权限
Query OK, 0 rows affected (0.03 sec)
mysql> show databases; # 查看所有数据库
+--------------------+
| Database           |
+--------------------+
| directseedingadmin |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| test               |
+--------------------+
6 rows in set (0.00 sec)
mysql> create database test_db; # 创建数据库
Query OK, 1 row affected (0.00 sec)
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| directseedingadmin |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| test               |
| test_db            |
+--------------------+
7 rows in set (0.00 sec)
mysql> use test_db; # 切换数据库
Database changed
mysql> show tables; # 查看数据库中所有的表
Empty set (0.00 sec)
mysql> describe user; # 查看表信息
```

## 数据库操作（DDL）

#### 操作数据库

##### 创建数据库

```mysql
CREATE DATABASE [IF NOT EXISTS] test;
```

##### 删除数据库

```mysql
DROP DATABASE [IF EXISTS] test;
```

##### 使用数据库

```mysql
USE test; # 特殊字符用 ``
```

##### 查看数据库

```mysql
SHOW DATABASES;
```

#### 数据库列类型

##### 数值

| 类型      | 备注           | 字节 |
| --------- | -------------- | ---- |
| tinyint   | 十分小         | 1    |
| smallint  | 较小的         | 2    |
| mediumint | 中等大小       | 3    |
| int       | 标准的         | 4    |
| bigint    | 较大的         | 8    |
| folat     | 浮点数         | 4    |
| double    | 浮点数         | 8    |
| decimal   | 字符串的浮点数 |      |

##### 字符串

| 类型     | 备注             | 字节    |
| -------- | ---------------- | ------- |
| char     | 固定大小的字符串 | 0-255   |
| varchar  | 可变的字符串     | 0-65535 |
| tinytext | 微型文本         | 2^8-1   |
| text     | 文本串           | 2^16-1  |

##### 时间日期

| 类型      | 备注                |
| --------- | ------------------- |
| date      | YYYY-MM-DD 日期格式 |
| time      | HH:mm:ss 时间格式   |
| datetime  | YYYY-MM-DD HH:mm:ss |
| timestamp | 时间戳              |
| year      | 年份                |

##### Null

没有值，不要Null进行计算

#### 数据库字段属性

| key            | 名称     | 描述                                                         |
| -------------- | :------- | ------------------------------------------------------------ |
| UNSIGNED       | unsigned | 无符号的整数，声明该列不能为负数                             |
| ZEROFILL       | zerofill | 0填充，不足的位数用0填充                                     |
| AUTO_INCREMENT | 自增     | 整数类型，自增属性，在上一条记录基础上+1，可以设置自增增量跟起始值 |
| NOT NULL       | 非空     | 不能为空                                                     |
| DEFAULT        | 默认值   | 默认值                                                       |

#### 创建数据库表

```mysql
CREATE TABLE IF NOT EXISTS `student`(
	`id` INT(4) NOT NULL AUTO_INCREMENT COMMENT '学生id',
	`name` VARCHAR(30) NOT NULL DEFAULT '匿名' COMMENT '学生姓名',
	`pwd` VARCHAR(20) NOT NULL DEFAULT '123456' COMMENT '登陆密码',
	`sex` VARCHAR(2) NOT NULL DEFAULT '女' COMMENT	 '性别',
	`brithday` DATETIME DEFAULT NULL COMMENT '出生日期',
	`address` VARCHAR(100) DEFAULT NULL COMMENT '地址',
	`email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
	PRIMARY KEY (`id`)
)ENGINE=INNODB DEFAULT CHARSET=utf8
mysql> show create table student; # 查看表创建语句
 CREATE TABLE `student` (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '学生id',
  `name` varchar(30) NOT NULL DEFAULT '匿名' COMMENT '学生姓名',
  `pwd` varchar(20) NOT NULL DEFAULT '123456' COMMENT '登陆密码',
  `sex` varchar(2) NOT NULL DEFAULT '女' COMMENT '性别',
  `brithday` datetime DEFAULT NULL COMMENT '出生日期',
  `address` varchar(100) DEFAULT NULL COMMENT '地址',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
mysql> desc student;
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| id       | int(4)       | NO   | PRI | NULL    | auto_increment |
| name     | varchar(30)  | NO   |     | 匿名    |                |
| pwd      | varchar(20)  | NO   |     | 123456  |                |
| sex      | varchar(2)   | NO   |     | 女      |                |
| brithday | datetime     | YES  |     | NULL    |                |
| address  | varchar(100) | YES  |     | NULL    |                |
| email    | varchar(100) | YES  |     | NULL    |                |
+----------+--------------+------+-----+---------+----------------+
7 rows in set (0.00 sec)
```

格式

```mysql
CREATE TABLE [IF NOT EXISTS] `表名`(
  `字段名` 列类型 [属性] [索引] [注释],
	# `id` INT(4) NOT NULL AUTO_INCREMENT COMMENT '学生id',
	# PRIMARY KEY (`id`)
)[表类型] [字符集设置] [注释]
# ENGINE=INNODB DEFAULT CHARSET=utf8
```

##### 数据库引擎

|            | MYISAM   | INNODB       |
| ---------- | :------- | ------------ |
| 事务       | unsigned | 支持         |
| 数据行锁定 | 不支持   | 支持         |
| 外键约束   | 不支持   | 支持         |
| 全文索引   | 支持     | 不能为空     |
| 表空间大小 | 小       | 约为它的两倍 |

MYISAM：节省空间，速度较快

INNODB：安全性高，事务的处理，多表多用户操作

#### 修改数据表

```mysql
-- 修改表名 ALTER TABLE 旧表名 RENAME  新表名
ALTER TABLE `test_db`.`student` RENAME AS `student_info`;
-- 增加表字段
ALTER TABLE `student_info` ADD age1 INT(11);
-- 修改约束
ALTER TABLE `student_info` MODIFY age1 VARCHAR(20);
-- 修改约束 跟 字段名
ALTER TABLE `student_info` CHANGE age1 age2 INT(1);
-- 删除字段
ALTER TABLE `student_info` DROP age2;
```

## 数据管理（DML）

### 外键

创建表的时候关联其他表的字段，删除有外键关系的表，必须删除引用外键的表，再删除。

比较麻烦，不建议使用，关联太多删除太麻烦

最佳实践

* 数据库表应该是单纯的表，只需要单纯存放数据，只有行和列
* 在代码层面上去实现外键

### 添加

```mysql
-- 插入语句 
-- insert into 表名 (字段名) values(值),(值),(值),...,(值) 字段和值一一对应
-- 1.字段和字段之间用英文逗号隔开
-- 2.字段是可以省略的，后面的值必须跟前面的字段一一对应
-- 3.同时插入多条用(值),(值)隔开
INSERT INTO `grade` (`gradename`) VALUES('大一');
-- 插入多个
INSERT INTO `grade` (`gradename`) VALUES('大二'),('大三');
INSERT INTO `student_info` (`name`, `pwd`, `sex`, `grade_id`) VALUES ('xhl', 'pwd-xhl', '男', '1');
INSERT INTO `student_info` (`name`, `pwd`, `sex`, `grade_id`, `brithday`, `email`, `address`) VALUES ('xhl', 'pwd-xhl', '男', '1', '2020-01-02 00:00:00', '562958029@qq.com', '地址');
```

### 修改

```mysql
-- 更新语句，一定要加条件！！！
-- UPDATE 表名 SET 字段名=值,字段名=值 WHERE 判断条件
-- 1.列名需要准确
-- 2.筛选条件加上
-- 3.value 可以是个值，也可以是个变量 (CURRENT_TIME)
-- 4.多个设置需要,号间隔
UPDATE `student_info` SET `name`='大傻逼' WHERE id = 2;
UPDATE `student_info` SET `name`='大傻逼-2', `email`='22@qq.com', `brithday`=CURRENT_TIME WHERE `name` = '大傻逼-2' AND `brithday` = '2020-01-02 00:00:00';

```

| 操作符         | 含义         | 范围   | 结果  |
| -------------- | ------------ | ------ | ----- |
| =              | 等于         | 5=6    | false |
| <> 或 !=       | 不等于       | 5<>6   | true  |
| >              | 大于         | 5>6    | true  |
| <              | 小于         | 5<6    | false |
| \>=            | 大于等于     | 5>=6   | false |
| <=             | 小于等于     | 5<=6   | true  |
| BETWEEN…AND... | 在某个范围内 | [2, 5] | true  |
| AND            | 且，&&       |        |       |
| OR             | 或，\|\|     |        |       |

### 删除

```mysql
-- 删除语句
-- DELETE FROM 表名 WHERE 条件
DELETE FROM `student_info` WHERE id = 4;
-- 清空表
TRUNCATE `student_info`;
```

##### DELETE 和 TRUNCATE

相同点：都能删除数据，都不会删除表结构

不同：TRUNCATE重新设置自增列，不会影响事务

DELETE 删除后，重启数据库，

InnoDB 自增列会从1开始（内存中，断电扑街）

MyISAM 会继续从上一个自增量开始（存在文件中）

## 查询数据 （DQL）

```mysql
-- SELECT 字段 FROM 表名
SELECT subjectname FROM school.`subject`;
+--------------------+
| subjectname        |
+--------------------+
| 高等数学-1         |
| 高等数学-2         |
| 高等数学-3         |
| 高等数学-4         |
| C语言-1            |
| C语言-2            |
| C语言-3            |
| C语言-4            |
| Java程序设计-1     |
| Java程序设计-2     |
| Java程序设计-3     |
| Java程序设计-4     |
| 数据库结构-1       |
| 数据库结构-2       |
| 数据库结构-3       |
| 数据库结构-4       |
| C#基础             |
+--------------------+
17 rows in set (0.00 sec)
-- AS 别名 可以给字段或者表起别名
SELECT studentname AS `姓名`, studentno AS `学号` FROM student AS a;
+--------+--------+
| 姓名   | 学号   |
+--------+--------+
| 张伟   |   1000 |
| 赵强   |   1001 |
+--------+--------+
2 rows in set (0.00 sec)
-- 函数方法 CONCAT(a,...)
SELECT CONCAT('姓名：', studentname, '-学号：', studentno) AS `学生信息` FROM student;
+-------------------------------+
| 学生信息                      |
+-------------------------------+
| 姓名：张伟-学号：1000         |
| 姓名：赵强-学号：1001         |
+-------------------------------+
2 rows in set (0.00 sec)
-- DISTINCT 去重
SELECT DISTINCT `studentno` FROM result;
```

#### where 条件

##### 逻辑运算符

| 运算符  | 语法            | 描述 |
| ------- | --------------- | ---- |
| And &&  | A and b a && b  | 且   |
| or \|\| | a or b a \|\| b | 或   |
| not !   | not a !a        | 非   |

```mysql
-- 条件查询 AND
SELECT * FROM result WHERE studentresult > 90
+-----------+-----------+---------------------+---------------+
| studentno | subjectno | examdate            | studentresult |
+-----------+-----------+---------------------+---------------+
|      1000 |         4 | 2013-11-13 16:00:00 |            98 |
|      1001 |         5 | 2020-05-02 10:00:00 |            91 |
+-----------+-----------+---------------------+---------------+
2 rows in set (0.00 sec)
SELECT * FROM result WHERE studentresult > 90 AND studentno != 1000;
+-----------+-----------+---------------------+---------------+
| studentno | subjectno | examdate            | studentresult |
+-----------+-----------+---------------------+---------------+
|      1001 |         5 | 2020-05-02 10:00:00 |            91 |
+-----------+-----------+---------------------+---------------+
1 row in set (0.00 sec)
-- 区间
SELECT * FROM result WHERE studentresult BETWEEN 90 AND 100
-- OR
SELECT * FROM result WHERE studentresult > 95 OR studentno = 1001
SELECT * FROM result WHERE studentresult > 95 || studentno = 1001
+-----------+-----------+---------------------+---------------+
| studentno | subjectno | examdate            | studentresult |
+-----------+-----------+---------------------+---------------+
|      1000 |         4 | 2013-11-13 16:00:00 |            98 |
|      1001 |         5 | 2020-05-02 10:00:00 |            91 |
+-----------+-----------+---------------------+---------------+
2 rows in set (0.00 sec)
-- NOT
SELECT * FROM result WHERE studentresult > 90 AND NOT studentno = 1000
+-----------+-----------+---------------------+---------------+
| studentno | subjectno | examdate            | studentresult |
+-----------+-----------+---------------------+---------------+
|      1001 |         5 | 2020-05-02 10:00:00 |            91 |
+-----------+-----------+---------------------+---------------+
1 row in set (0.00 sec)

```

##### 比较运算符

| 运算符      | 语法              | 描述                     |
| ----------- | ----------------- | ------------------------ |
| IS NULL     | a IS NULL         | 如果操作符未NULL，true   |
| IS NOT NULL | a IS NOT NULL     | 如果操作符不为NULL，true |
| BETWEEN     | a BETWEEN b AND c | a 在 [b, c] 之间，true   |
| LIKE        | a LIKE b          | a 匹配 b， true          |
| IN          | a IN (b, c, d)    | a 在 b, c, d 之中，true  |

```mysql
-- % 0到任意字符 _一个字符
SELECT studentname, studentno FROM student WHERE studentname LIKE '%张_';
+-------------+-----------+
| studentname | studentno |
+-------------+-----------+
| 张伟        |      1000 |
+-------------+-----------+
1 row in set (0.00 sec)
-- IN 需要一个具体的值
SELECT studentname,studentno FROM student WHERE studentno IN(1000, 1001);
+-------------+-----------+
| studentname | studentno |
+-------------+-----------+
| 张伟        |      1000 |
| 赵强        |      1001 |
+-------------+-----------+
2 rows in set (0.00 sec)
-- NOT
SELECT studentname,studentno FROM student WHERE studentno NOT IN(1000);
+-------------+-----------+
| studentname | studentno |
+-------------+-----------+
| 赵强        |      1001 |
+-------------+-----------+
1 row in set (0.00 sec)
-- IS NULL
SELECT studentname,borndate FROM student WHERE borndate IS NULL
+-------------+----------+
| studentname | borndate |
+-------------+----------+
| 陈夏雨      | NULL     |
+-------------+----------+
1 row in set (0.00 sec)
SELECT studentname,borndate FROM student WHERE borndate IS NOT NULL;
+-------------+---------------------+
| studentname | borndate            |
+-------------+---------------------+
| 张伟        | 1980-01-01 00:00:00 |
| 赵强        | 1990-01-01 00:00:00 |
+-------------+---------------------+
2 rows in set (0.00 sec)
-- BETWEEN
SELECT * FROM result WHERE studentresult BETWEEN 91 AND 98;
+-----------+-----------+---------------------+---------------+
| studentno | subjectno | examdate            | studentresult |
+-----------+-----------+---------------------+---------------+
|      1000 |         4 | 2013-11-13 16:00:00 |            98 |
|      1001 |         5 | 2020-05-02 10:00:00 |            91 |
+-----------+-----------+---------------------+---------------+
2 rows in set (0.00 sec)
```

### 连表查询

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200607171605956.png" alt="image-20200607171605956" style="zoom:50%;" />

```mysql
-- INNER JOIN
SELECT s.studentno, s.studentname, r.subjectno, r.studentresult FROM student AS s INNER JOIN result AS r ON s.studentno = r.studentno
+-----------+-------------+-----------+---------------+
| studentno | studentname | subjectno | studentresult |
+-----------+-------------+-----------+---------------+
|      1000 | 张伟        |         1 |            85 |
|      1000 | 张伟        |         2 |            70 |
|      1000 | 张伟        |         3 |            68 |
|      1000 | 张伟        |         4 |            98 |
|      1000 | 张伟        |         5 |            58 |
|      1001 | 赵强        |         5 |            91 |
+-----------+-------------+-----------+---------------+
6 rows in set (0.00 sec)
-- RIGHT JOIN
SELECT s.studentno, s.studentname, r.subjectno, r.studentresult FROM student AS s RIGHT JOIN result AS r ON s.studentno = r.studentno;
+-----------+-------------+-----------+---------------+
| studentno | studentname | subjectno | studentresult |
+-----------+-------------+-----------+---------------+
|      1000 | 张伟        |         1 |            85 |
|      1000 | 张伟        |         2 |            70 |
|      1000 | 张伟        |         3 |            68 |
|      1000 | 张伟        |         4 |            98 |
|      1000 | 张伟        |         5 |            58 |
|      1001 | 赵强        |         5 |            91 |
+-----------+-------------+-----------+---------------+
6 rows in set (0.00 sec)
-- LEFT JOIN
SELECT s.studentno, s.studentname, r.subjectno, r.studentresult FROM student AS s LEFT JOIN result AS r ON s.studentno = r.studentno
+-----------+-------------+-----------+---------------+
| studentno | studentname | subjectno | studentresult |
+-----------+-------------+-----------+---------------+
|      1000 | 张伟        |         1 |            85 |
|      1000 | 张伟        |         2 |            70 |
|      1000 | 张伟        |         3 |            68 |
|      1000 | 张伟        |         4 |            98 |
|      1000 | 张伟        |         5 |            58 |
|      1001 | 赵强        |         5 |            91 |
|      1002 | 陈夏雨      |      NULL |          NULL |
+-----------+-------------+-----------+---------------+
7 rows in set (0.00 sec)
SELECT s.studentno, s.studentname, g.gradename FROM student as s LEFT JOIN grade AS g ON s.gradeid = g.gradeid;
+-----------+-------------+-----------+
| studentno | studentname | gradename |
+-----------+-------------+-----------+
|      1000 | 张伟        | 大二      |
|      1001 | 赵强        | 大三      |
|      1002 | 陈夏雨      | 大三      |
+-----------+-------------+-----------+
SELECT s.subjectname, g.gradename FROM `subject` as s INNER JOIN grade AS g ON s.gradeid = g.gradeid;
+--------------------+-----------+
| subjectname        | gradename |
+--------------------+-----------+
| 高等数学-1         | 大一      |
| 高等数学-2         | 大二      |
| 高等数学-3         | 大三      |
| 高等数学-4         | 大四      |
| C语言-1            | 大一      |
| C语言-2            | 大二      |
| C语言-3            | 大三      |
| C语言-4            | 大四      |
| Java程序设计-1     | 大一      |
| Java程序设计-2     | 大二      |
| Java程序设计-3     | 大三      |
| Java程序设计-4     | 大四      |
| 数据库结构-1       | 大一      |
| 数据库结构-2       | 大二      |
| 数据库结构-3       | 大三      |
| 数据库结构-4       | 大四      |
| C#基础             | 大一      |
+--------------------+-----------+
SELECT s.studentno, s.studentname, sub.subjectname, r.studentresult FROM student AS s INNER JOIN result AS r ON s.studentno = r.studentno INNER JOIN `subject` AS sub ON r.subjectno = sub.subjectno WHERE sub.subjectno = 5;
+-----------+-------------+-------------+---------------+
| studentno | studentname | subjectname | studentresult |
+-----------+-------------+-------------+---------------+
|      1000 | 张伟        | C语言-1     |            58 |
|      1001 | 赵强        | C语言-1     |            91 |
+-----------+-------------+-------------+---------------+
```

| 操作       | 描述                                       |
| ---------- | ------------------------------------------ |
| INNER JOIN | 只要表中至少有一个匹配就返回               |
| LEFT JOIN  | 会从左表中返回所有的值，即使右表中没有匹配 |
| RIGHT JOIN | 会从右表中返回所有的值，即使左表中没有匹配 |

```mysql
-- student 右链接 result 查询结果 内链接 subject 表
SELECT s.studentno, s.studentname, sub.subjectno, sub.subjectname, r.studentresult FROM student s RIGHT JOIN result r ON r.studentno = s.studentno INNER JOIN `subject` sub ON r.subjectno = sub.subjectno
+-----------+-------------+-----------+----------------+---------------+
| studentno | studentname | subjectno | subjectname    | studentresult |
+-----------+-------------+-----------+----------------+---------------+
|      1000 | 张伟        |         1 | 高等数学-1     |            85 |
|      1000 | 张伟        |         2 | 高等数学-2     |            70 |
|      1000 | 张伟        |         3 | 高等数学-3     |            68 |
|      1000 | 张伟        |         4 | 高等数学-4     |            98 |
|      1000 | 张伟        |         5 | C语言-1        |            58 |
|      1001 | 赵强        |         5 | C语言-1        |            91 |
+-----------+-------------+-----------+----------------+---------------+
6 rows in set (0.00 sec)
```

#### 自连接

自己跟自己连接，核心，**一张表拆成两张一样的表**

```mysql
+------------+-----+--------------+
| categoryid | pid | categoryname |
+------------+-----+--------------+
|          2 |   1 | 信息技术     |
|          3 |   1 | 软件开发     |
|          4 |   3 | 数据库       |
|          5 |   1 | 美术设计     |
|          6 |   3 | web开发      |
|          7 |   5 | ps技术       |
|          8 |   2 | 办公信息     |
+------------+-----+--------------+
7 rows in set (0.00 sec)
父类
+------------+--------------+
| categoryid | categoryname |
+------------+--------------+
|          2 | 信息技术     |
|          3 | 软件开发     |
|          5 | 美术设计     |
+------------+--------------+
子类
+------------+-----+--------------+
| categoryid | pid | categoryname |
+------------+-----+--------------+
|          4 |   3 | 数据库       |
|          6 |   3 | web开发      |
|          7 |   5 | ps技术       |
|          8 |   2 | 办公信息     |
+------------+-----+--------------+
SELECT sup.`categoryname` AS '父类', sub.`categoryname` AS '子类' FROM `category` AS sup, `category` AS sub WHERE sub.pid = sup.categoryid;
+--------------+--------------+
| 父类         | 子类         |
+--------------+--------------+
| 软件开发     | 数据库       |
| 软件开发     | web开发      |
| 美术设计     | ps技术       |
| 信息技术     | 办公信息     |
+--------------+--------------+
```

### 分页、排序

limit、order by

```mysql
-- ORDER BY key ASC / DESC
SELECT * FROM result ORDER BY studentresult ASC
+-----------+-----------+---------------------+---------------+
| studentno | subjectno | examdate            | studentresult |
+-----------+-----------+---------------------+---------------+
|      1000 |         5 | 2013-11-14 16:00:00 |            58 |
|      1000 |         3 | 2013-11-11 09:00:00 |            68 |
|      1000 |         2 | 2013-11-12 16:00:00 |            70 |
|      1000 |         1 | 2013-11-11 16:00:00 |            85 |
|      1001 |         5 | 2020-05-02 10:00:00 |            91 |
|      1003 |         5 | 2020-05-02 10:00:00 |            96 |
|      1000 |         4 | 2013-11-13 16:00:00 |            98 |
+-----------+-----------+---------------------+---------------+
SELECT * FROM result ORDER BY studentresult DESC
+-----------+-----------+---------------------+---------------+
| studentno | subjectno | examdate            | studentresult |
+-----------+-----------+---------------------+---------------+
|      1000 |         4 | 2013-11-13 16:00:00 |            98 |
|      1003 |         5 | 2020-05-02 10:00:00 |            96 |
|      1001 |         5 | 2020-05-02 10:00:00 |            91 |
|      1000 |         1 | 2013-11-11 16:00:00 |            85 |
|      1000 |         2 | 2013-11-12 16:00:00 |            70 |
|      1000 |         3 | 2013-11-11 09:00:00 |            68 |
|      1000 |         5 | 2013-11-14 16:00:00 |            58 |
+-----------+-----------+---------------------+---------------+
-- LIMIT 0,5 下标 条数 (pageNo-1)*pageSize, pageSize
SELECT * FROM result ORDER BY studentresult DESC LIMIT 0,5
+-----------+-----------+---------------------+---------------+
| studentno | subjectno | examdate            | studentresult |
+-----------+-----------+---------------------+---------------+
|      1000 |         4 | 2013-11-13 16:00:00 |            98 |
|      1003 |         5 | 2020-05-02 10:00:00 |            96 |
|      1001 |         5 | 2020-05-02 10:00:00 |            91 |
|      1000 |         1 | 2013-11-11 16:00:00 |            85 |
|      1000 |         2 | 2013-11-12 16:00:00 |            70 |
+-----------+-----------+---------------------+---------------+
SELECT s.studentno, s.studentname, sub.subjectname, r.studentresult FROM student as s INNER JOIN result as r ON s.studentno = r.studentno INNER JOIN `subject` AS sub ON sub.subjectno = r.subjectno WHERE sub.subjectno = 5 ORDER BY r.studentresult DESC LIMIT 0, 2; -- 第一页
+-----------+-------------+-------------+---------------+
| studentno | studentname | subjectname | studentresult |
+-----------+-------------+-------------+---------------+
|      1003 | 小火龙      | C语言-1     |            96 |
|      1001 | 赵强        | C语言-1     |            91 |
+-----------+-------------+-------------+---------------+

SELECT s.studentno, s.studentname, sub.subjectname, r.studentresult FROM student as s INNER JOIN result as r ON s.studentno = r.studentno INNER JOIN `subject` AS sub ON sub.subjectno = r.subjectno WHERE sub.subjectno = 5 ORDER BY r.studentresult DESC LIMIT 2, 2; -- 第二页
+-----------+-------------+-------------+---------------+
| studentno | studentname | subjectname | studentresult |
+-----------+-------------+-------------+---------------+
|      1000 | 张伟        | C语言-1     |            58 |
+-----------+-------------+-------------+---------------+
```

### 子查询

在 WHERE 语句中嵌套一个子查询语句 WHERE (SELECT * FROM)

```mysql
SELECT DISTINCT s.studentno, s.studentname, r.subjectno FROM student AS s INNER JOIN result AS r ON r.studentno = s.studentno WHERE r.studentresult >= 80 AND r.subjectno = (SELECT subjectno FROM `subject` WHERE subjectno = 5)
+-----------+-------------+-----------+
| studentno | studentname | subjectno |
+-----------+-------------+-----------+
|      1001 | 赵强        |         5 |
|      1003 | 小火龙      |         5 |
+-----------+-------------+-----------+
```

## MySQL 函数

#### 常用函数

```mysql
-- 数学计算函数
SELECT ABS(-1) -- 绝对值
SELECT CEILING(0.2) -- 向上取整
SELECT FLOOR(0.2) -- 向下取整
SELECT RAND() -- 随机数
SELECT SIGN(0) -- - -1 + 1 0 0
-- 字符串
SELECT CHAR_LENGTH('123ha哈哈哈') --字符串长度
SELECT CONCAT(1,2,3) --拼接字符串
SELECT INSERT('1-1-1',3, 1, '3') -- 插入字符
SELECT REPLACE('1-1-1','-1-','-3-') -- 替换字符串
SELECT LOWER('aDc') -- 小写
SELECT UPPER('aDc') -- 大写
SELECT SUBSTR('123456',2, 4) -- 截取字符串
SELECT REVERSE('12342') -- 反转字符串
-- 时间日期函数
SELECT CURRENT_DATE() -- YYYY-mm-DD
SELECT CURRENT_TIME() -- HH:MM:SS 
SELECT NOW() -- YYYY-mm-DD HH:MM:SS 当前时间
SELECT LOCALTIME()  -- YYYY-mm-DD HH:MM:SS 本地时间
SELECT SYSDATE() --  YYYY-mm-DD HH:MM:SS 系统时间
SELECT YEAR(CURRENT_DATE()) -- 年
-- 系统
SELECT SYSTEM_USER() -- 用户
SELECT VERSION() -- 用户
```

#### 聚合函数

| 函数    | 描述   |
| ------- | ------ |
| COUNT() | 计数   |
| AVG()   | 求和   |
| MAX()   | 最大值 |
| MIN()   | 最小值 |
| ...     |        |

```mysql
-- GROUP BY 分组
SELECT sub.subjectname, AVG(r.studentresult) as '平均分', MAX(r.studentresult), MIN(r.studentresult) FROM result r INNER JOIN `subject` sub ON r.subjectno = sub.subjectno GROUP BY r.subjectno HAVING 平均分 > 80
+----------------+-----------+----------------------+----------------------+
| subjectname    | 平均分    | MAX(r.studentresult) | MIN(r.studentresult) |
+----------------+-----------+----------------------+----------------------+
| 高等数学-1     |   85.0000 |                   85 |                   85 |
| 高等数学-4     |   98.0000 |                   98 |                   98 |
| C语言-1        |   81.6667 |                   96 |                   58 |
+----------------+-----------+----------------------+----------------------+
```

```mysql
SELECT [ALL|DISTINCT] { * | table.* | table.field [as alias1]...}
FROM table_name [as table_alias]
	[LEFT | RIGHT | INNER JOIN table_name2 [as table_alias2]] -- 联合查询
	[WHERE ...] -- 条件
	[GROUP BY] -- 分组
	[HAVING] -- 过滤分组记录必须满足的次要条件
	[ORDER BY ... DESC | ASC] -- 排序
	[LIMIT {[OFFSET,] ROW_COUNT | ROW_COUNTOFFSET OFFSET}]; -- 查询记录，分页
```

## 事务

要么都成功，要么都失败！mysql 默认是开启事务的。

```mysql
SET autocommit = 0 -- 关闭
SET autocommit = 1 -- 开启
```

```mysql
-- 事务开启
START TRANSACTION -- 标记一个事务的开始，从这里开始后的 sql 都在同一个事务
INSERT ...
INSERT ...
COMMIT -- 提交
ROLLBACK -- 回滚
SAVEPOINT point_name -- 保存点
ROLLBACK TO SAVEPOINT point_name -- 回滚到保存点
RELEASE SAVEPOINT point_name
-- 事务结束
```

```mysql
SET autocommit = 0
START TRANSACTION
UPDATE account SET money=money-500 WHERE `name` = 'A'
UPDATE account SET money=money+500 WHERE `name` = 'B'

COMMIT
ROLLBACK
SET autocommit = 1
```

#### 事务原则

**ACID**原则：**原子性(Atomicity)**，**一致性(Consistency)**，**隔离性(Isolation）**，**持久性(Durability）**。

**原子性**： 是指一个事务要么全部执行，要么不执行。（**要么都成功要么都失败**）

**一致性**：是指事务的运行并不改变数据库中数据的一致性。（**事务前后的数据保持完整性**）

**隔离性**：事务的独立性也称作隔离性，是指两个以上的事务不会出现交错执行的状态。（**多个用户并发读取，为每个用户开启单独事务，不能被其他事务感染**）

**持久性**：事务的持久性是指事务执行成功以后，该事务对数据库所作的更改便是持久的保存在数据库之中，不会无缘无故的回滚。（**事务一旦提交就不可逆**）

#### 脏读

一个事务读取了另一个事务未提交的数据。

#### 不可重复读

在一个事务读取表中某一行数据，多次读取结果不同

#### 幻读（虚读）

一个事务内读到别的事务插入的数据，导致前后结果不一致。

| 隔离级别        | 脏读   | 不可重复读 | 幻读   | 加锁读 |
| --------------- | ------ | ---------- | ------ | ------ |
| read uncommited | 可能   | 可能       | 可能   | 无     |
| read commited   | 不可能 | 可能       | 可能   | 无     |
| repeatable read | 不可能 | 不可能     | 不可能 | 无     |
| serializable    | 不可能 | 不可能     | 不可能 | 有     |

## 索引

索引是**帮助MySQL更高效的获取数据的数据结构。**

### 分类

主键索引只能有一个，唯一索引可以有很多个

#### 主键索引（PRIMARY KEY）

* 唯一标识，不可重复，只能有一个列作为主键

#### 唯一索引（UNIQUE KEY）

* 避免重复列出现，唯一索引可以重复，多个列都可以表识为唯一索引

#### 常规索引（KEY / INDEX）

* 默认的，INDEX、KEY关键字索引

#### 全文索引（FULLTEXT）

* 特定的数据库引擎才能有的，MyISAM
* 快速定位数据

```mysql
显示所有的索引信息
show index from student
增加一个索引
ALTER TABLE school.student ADD FULLTEXT INDEX `studentname` (`studentname`)
EXPLAIN 分析sql执行状况
EXPLAIN SELECT * FROM student -- 非全文索引
SELECT * FROM student WHERE MATCH(studentname) AGAINST('陈')
```

```mysql
CREATE TABLE `app_user` (
`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
`name` varchar(50) DEFAULT '',
`email` varchar(50) NOT NULL,
`phone` varchar(20) DEFAULT '',
`gender` tinyint(4) unsigned DEFAULT '0',
`password` varchar(100) NOT NULL DEFAULT '',
`age` tinyint(4) DEFAULT NULL,
`create_time` datetime DEFAULT CURRENT_TIMESTAMP,
`update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

DROP FUNCTION IF EXISTS mock_data;
DELIMITER $$
-- 写函数之前必须要写，标志
CREATE FUNCTION mock_data ()
RETURNS INT
BEGIN
	DECLARE num INT DEFAULT 1000000;
	DECLARE i INT DEFAULT 0;
	WHILE i<num DO
		INSERT INTO `app_user` (`name`, `email`, `phone`, `gender`, `password`, `age`) VALUES(CONCAT('用户', i), CONCAT('100',i,'@qq.com'), CONCAT('13', FLOOR(RAND()*(999999999-100000000)+100000000)), FLOOR(RAND()*2), '123', FLOOR(RAND()*100));
		SET i=i+1;
	END WHILE;
	RETURN i;
END;

SELECT mock_data() -- 执行此函数 生成一百万条数据

SELECT * FROM app_user WHERE `name` = '用户9999' -- 0.5s
EXPLAIN SELECT * FROM app_user WHERE `name` = '用户9999' -- 994590 
CREATE INDEX id_app_user_name ON app_user(`name`) 	-- 建立索引
SELECT * FROM app_user WHERE `name` = '用户9999' -- 0.001s
EXPLAIN SELECT * FROM app_user WHERE `name` = '用户9999' -- 1
```

#### 索引原则

* 索引不是越多越好
* 不要对经常变动的数据加索引
* 小数据量的表不需要加索引
* 索引一般加在常用来查询的字段上

#### 索引的数据结构

Hash 类型

Btree：InnoDB 的默认数据结构

## 数据库管理

#### 用户管理

```mysql
-- 创建用户 CREATE USER name IDENTIFIED BY password
CREATE USER xhl IDENTIFIED BY '123456'
-- 修改当前用户密码
SET PASSWORD = PASSWORD('123456')
-- 修改其他用户密码
SET PASSWORD FOR xhl = PASSWORD('11111')
-- 重命名
RENAME USER xhl TO cxy
-- 授予全部权限
GRANT ALL PRIVILEGES ON *.* TO cxy
-- 查看权限
SHOW GRANTS FOR root@localhost
```

#### 数据库备份

* 直接备份物理文件
* 可视化工具手动导出
* 命令行导出

## 规范数据库设计

糟糕的数据库设计

	* 数据冗余，浪费空间
	* 数据库插入删除都很麻烦，屏蔽外键
	* 程序性能差

良好的数据库设计

* 节省空间
* 保证数据库的完整性
* 方便我们开发系统

设计数据库的步骤（个人博客）

* 收集消息，分析需求
  * 用户表（用户登陆注销，用户的个人信息，写博客，创建分类）
  * 分类表（文章分类，谁创建）
  * 文章表（文章的信息）
  * 友情链接表（友链表）
* 标识实体
* 标识实体之间的关系

### 数据库三大范式

为什么需要规范化

* 信息重复
* 更新异常
* 插入异常
* 删除异常

#### 第一范式（1NF）

原子性：保证每一列都是不可再分的原子数据项

#### 第二范式（2NF）

满足第一范式的情况下，每张表只描述一件事情

#### 第三范式（3NF）

满足第一范式跟第二范式的情况下，需要确保数据表的每一列数据都和主键直接相关，而不能间接相关

#### 规范性跟性能问题

关联查询不得超过三张表

* 考虑商业化需求和目标，（成本，用户体验）数据库的性能更加重要
* 在规范性能问题的时候，需要适当考虑规范性
* 故意给一些表增加冗余字段（从多表查询变为单表查询）
* 故意设计一些计算列（从大数据量的计算将为小数据量的查询：索引）
/*
 * @Author: xiaohuolong
 * @Date: 2020-06-05 19:25:19
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-06-08 10:51:01
 * @FilePath: /study-demo/redis-demo/string.js
 */ 
const redis = require("redis")
const client = redis.createClient({ port:6380 })
const pub = redis.createClient({ port:6380 })
client.on("error", function(error) {
    console.error(error)
})
const print = redis.print
// 清空数据库
client.flushall()
// 设置值
client.set("key1", "value1", print)
client.set("key2", "value2", print)
// 获取key
client.get("key1", print)
client.get("key2", print)
// 获取符合规则的key
client.keys('*', print)
// 判断 key 是否存在 1 存在 0 不存在
client.exists('key1', print)
client.exists('key3', print)
// 移动到目标数据库
client.move('key1', 1)
client.get("key1", print)
// 切换数据库
client.select(1, print)
client.get("key1", print)
client.get("key2", print)
client.move('key1', 0)
client.select(0, print)
// 设置 key 过期时间，单位秒
client.expire('key1', 10, print)
// 查看剩余时间
client.ttl('key1', print)
// 查看 value 类型
client.type('key1', print)
// setTimeout(() => {
//     console.log('5s after')
//     client.get("key1", print)
//     client.ttl('key1', print)
// },5000)
// setTimeout(() => {
//     console.log('10s after')
//     client.get("key1", print)
//     client.ttl('key1', print)
// },10000)
// 追加字符串内容，如果 key 不存在，则相当于 set key > append key
console.log('string')
client.append('key1', '-value1', print)
client.get("key1", print) // 'value1-value1'
// 字符串长度
client.strlen('key1', print) // 13
// 自增 1
client.incr('incr-key', print) // 1
// 自减 1
client.decr('incr-key', print) // 0
// 自增 N 
client.incrby('incr-key', 10, print) // 10
// 自减 N
client.decrby('incr-key', 10, print) // 0
// 截取字符串
client.getrange('key1', 0, 4, print) // value
// 替换指定位置开始的字符串
client.setrange('key1', 1, '***', print) // v***e1-value1
// 设置带过期时间的键值
client.setex('key-time', 2, 'time', print) // time 两秒后删除
// 不存在则设置，存在则失败
client.setnx('key5', 10, print) // 1
client.setnx('key1', 10, print) // 0
// 设置多个值
let kvs = ['key1', 'val1', 'key2', 'val2', 'key3', 'val3', 'key4', 'val4']
// 设置多个值
client.mset(kvs, print)
// 获取多个值
client.mget(['key1', 'key2', 'key3', 'key4'], print)
// 设置多个值 原子性，要么一起成功，要么一起失败
client.msetnx(kvs, print) // 0
client.msetnx(['key7', 'val7', 'key6', 'val6'], print) //1
client.mget(['key7', 'key6'], print)
client.getset('key7', 'val-7', print) // key7
// list
console.log('list')
// 将一个值或者多个值插入列表头部（左）
client.lpush('list', 5, 4, 3, 2, 1, print) // 1,2,3,4,5
// 将一个值或者多个值插入列表尾部（右）
client.rpush('list', 6, 7, 8, 9, 10, print) // 1,2,3,4,5,6,7,8,9,10
// 通过区间获取
client.lrange('list', 0, -1, print) // 1,2,3,4,5,6,7,8,9,10
// 从头部弹出一个值（左）
client.lpop('list', print) // 2,3,4,5,6,7,8,9,10
// 从尾部弹出一个值（右）
client.rpop('list', print) // 2,3,4,5,6,7,8,9
// 获取索引 index 的值
client.lindex('list', 1, print) // 3
// 获取 list 长度
client.llen('list', print) // 8
// 在某个值的前/后插入值
client.linsert('list', 'AFTER', 4, 1, print) // 2,3,4,1,5,6,7,8,9
client.lpush('list', 1) // 1,2,3,4,1,5,6,7,8,9
client.rpush('list', 1) // 1,2,3,4,1,5,6,7,8,9,1
client.lrange('list', 0, -1, print) // 1,2,3,4,1,5,6,7,8,9,1
// 删除 N 个指定的值 
client.lrem('list', 1, 1, print) // 2,3,4,1,5,6,7,8,9,1
client.lrange('list', 0, -1, print) // 2,3,4,1,5,6,7,8,9,1
// 截取指定长度的值
client.ltrim('list', 0, 5, print) // 2,3,4,1,5,6
client.lrange('list', 0, -1, print) // 2,3,4,1,5,6
// 移除列表尾部到另一个列表头部
client.rpoplpush('list', 'newList', print) // 6
client.lrange('newList', 0, -1, print) // 6
// 更新数组某个索引值 需要在数组存在，且索引存在时才能更新值
client.lset('newList', 0, 1, print) // 1
client.lrange('newList', 0, -1, print) // 1

// set
console.log('set')
// 给set新增一个值
client.sadd('set', 1,2,3,4,5,6,7,8,9,10,10,9,8,7,6,5,4,3,2,1) // 10
// 获取集合所有的值
client.smembers('set', print) // 1,2,3,4,5,6,7,8,9,10
// 判断某个值在不在集合中
client.sismember('set', 1, print) // 1
client.sismember('set', 11, print) // 0
// 获取集合个数
client.scard('set', print) // 10
// 删除某个值
client.srem('set', 1, print) // 1
// client.sismember('set', 1, print) // 0
// 随机抽一个元素
// client.srandmember('set', print)
// 随机删除某个元素
// client.spop('set', print)
client.smembers('set', print) // 
// 把元素从 source 移动到 destination 中
client.smove('set', 'set1', 3)
client.sadd('set1', 1, 2, 5, 6) // 10
client.smembers('set', print) // 
client.smembers('set1', print) // 
// 获取 N 个集合的差集
client.sdiff('set', 'set1', print) //
// 获取 N 个集合的交集
client.sinter('set', 'set1', print) //
// 获取 N 个集合的并集
client.sunion('set', 'set1', print) //
// hash
console.log('hash')
// 设置一个具体的 key-value
client.hset('hash', 'k1', 'v1', print) // 1
// 获取值
client.hget('hash', 'k1', print) // v1
// 设置一批键值数据
client.hmset('hash', ['id', 1, 'name', 'xhl', 'age', 24], print) // ok
// 获取一组键值的值
client.hmget('hash', ['id', 'name', 'age'], print) // 1, xhl, 24
client.hgetall('hash', (err, reply) => {
    console.log(reply) // { k1: 'v1', id: '1', name: 'xhl', age: '24' }
})
// 判断键值是否存在
client.hexists('hash', 'id', print) // 1
client.hexists('hash', 'id2', print) // 0
// HKEYS key 获取键
client.hkeys('hash', print) // k1, id, name, age
// HVALS key 获取值
client.hvals('hash', print) // v1, 1, xhl, 24
// 自增
client.hincrby('hash', 'id', 1, print) // 2
// 不存在则设置，存在则失败 
client.hsetnx('hash', 'k2', 1, print) // 1
client.hsetnx('hash', 'k1', 1, print) // 0
client.hgetall('hash', (err, reply) => {
    console.log(reply) // { k1: 'v1', id: '2', name: 'xhl', age: '24', k2: '1' }
})
// zset
// 新增一个值
client.zadd('zset', 1, 'xhl', 2, 'hdq', 3, 'cxy', 5, 'ldh', print) // 4
// 获取正序
client.zrange('zset',0, -1, 'WITHSCORES', print) // xhl,1,hdq,2,cxy,3,ldh,5
// 获取倒序
client.zrevrange('zset',0, -1, 'WITHSCORES', print) // ldh,5,cxy,3,hdq,2,xhl,1
// 最小值到最大值之间的数据
client.zrangebyscore('zset', 2, 5, 'WITHSCORES', print) // hdq,2,cxy,3,ldh,5
client.zrangebyscore('zset', 2, 5, 'WITHSCORES', 'LIMIT', 0, 2, print) // hdq,2,cxy,3
// 最大值到最小值之间的数据
client.zrevrangebyscore('zset', 5, 2, 'WITHSCORES', print) // ldh,5,cxy,3,hdq,2
// 删除一个或多个值
client.zrem('zset', 'ldh', print) // 5
// ZCOUNT key min max 获取指定分数区间
client.zcount('zset', 1, 6, print) // 3
// 获取排名
client.zrank('zset', 'xhl', print) // 0
// 获取排名
client.zrevrank('zset', 'xhl', print) // 2
client.zrange('zset',0, -1, 'WITHSCORES', print) // xhl,1,hdq,2,cxy,3,ldh,5
// geospatial
const geos = [
    113.280637,23.125178, 'gz', 
    113.382391, 22.521113, 'zs', 
    121.472644,31.231706, 'shh',
    114.085947, 22.547, 'sz',
    120.153576, 30.287459, 'hz',
    109.08816, 34.53483, 'xa'
]
// 经度 纬度 名称
client.geoadd('geo', geos, print)
// 获取指定城市的经度纬度
client.geopos('geo', 'sz', 'gz', print)
// 两地的距离
client.geodist('geo', 'sz', 'gz', 'km', print)
// 以某一个纬度为中心，查看半径多少的城市
client.georadius('geo', 110, 30, 1000, 'km', 'WITHCOORD', 'WITHDIST', 'WITHHASH', 'COUNT', 3, 'DESC', print)
client.georadiusbymember('geo', 'sz', 1000, 'km', 'WITHCOORD', 'WITHDIST', 'WITHHASH', 'COUNT', 3, 'DESC', print)
// Hyperloglog 基数（不重复的元素），可以接受误差
// 创建一组元素
client.pfadd('hlog', [1,2,3,4,5])
client.pfadd('hlog2', [6,7,8,9,10])
// 计算元素个数
client.pfcount('hlog', print) //  10
client.pfcount('hlog2', print) //  10
// 合并两个组
client.pfmerge('hlog3', 'hlog', 'hlog2', print) // ok
client.pfcount('hlog3', print) // 10
// 位存储，bitmaps 位图，使用二进制来记录，只有0或1的状态
// 设置某个位置的状态
client.setbit('bit', 0, 0, print)
client.setbit('bit', 1, 1, print)
client.setbit('bit', 2, 0, print)
client.setbit('bit', 3, 1, print)
client.setbit('bit', 4, 0, print)
client.setbit('bit', 5, 1, print)
client.setbit('bit', 6, 0, print)
// BITCOUNT key [start end] 1的次数
client.bitcount('bit', print) // 3
// 获取某个位置的状态
client.getbit('bit', 3, print) // 1
client.getbit('bit', 2, print) // 0
// 事务
const multi = client.multi()
try {
    client.set('mu-key1', 'value1',print)
    client.set('mu-key2', 'value2',print)
    client.set('mu-key3', 'value3',print)
    multi.exec()
} catch (error) {
    multi.discard()
    console.log(error)
}
client.get('mu-key1', print)
client.get('mu-key2', print)
client.get('mu-key3', print)

client.set('money', 100, print)
client.set('out', 0, print)
client.watch('money', print)
// 如果变动，事务执行失败
client.set('money', 120, print)
// 需要解绑监听，再监听
client.unwatch('money', print)
client.watch('money', print)

const multi2 = client.multi()
try {
    client.decrby('money', 20, print)
    client.incrby('out', 20, print)
    multi2.exec()
} catch (error) {
    multi2.discard()
    console.log(error)
}
client.get('money', print)
client.get('out', print)

client.subscribe('xhl',print)
client.on('subscribe', (channel, message) => print(`channel=${channel} message=${message}`))
client.on('message', (channel, message) => print(`channel=${channel} message=${message}`))
setTimeout(()=>{
    pub.publish('xhl', 'by pub: 123321', print)
}, 2000)
setTimeout(()=>{
    client.unsubscribe('xhl')
    client.quit()
}, 5000)
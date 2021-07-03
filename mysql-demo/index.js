/*
 * @Author: xiaohuolong
 * @Date: 2020-06-08 11:46:35
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-06-11 00:10:05
 * @FilePath: /study-demo/mysql-demo/index.js
 */ 

(async () => {
    const mysql = require('mysql')

    const MYSQL_CONF = {
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        database : 'school'
    }
    /**
     * get the connection pool of database
     * 获取数据库连接池
     */
    let pool = null
    const getPool =  () => {
        if (!pool) {
            pool = mysql.createPool(MYSQL_CONF);
        }
        return pool;
    }
    
    const exec = async (...args) => {
        try {
            console.log(args)
            return await new Promise((resolve, reject) => {
                getPool().query(...args, (err, result) => {
                    if (err) {
                        return reject(err)
                    }
                    resolve(result)
                })
            })
        } catch (error) {
            return error
        }
    }
    
    // const user = {
    //     loginpwd: '123456',
    //     studentname: '赵强-2-2-2-1',
    //     sex: 1,
    //     gradeid: 3,
    //     phone: '13800002222',
    //     address: '广东深圳',
    //     borndate: '1989-12-20 16:00:00',
    //     email: 'text111@qq.com',
    //     identitycard: '123456199001011234'
    // }
    // const query2Insert = (tableName, query) => {
    //     const keys = '`' + Object.keys(query).join('`,`') + '`'
    //     const values = "'" + Object.values(query).join("','") + "'"
    //     return `insert into ${`${tableName}`} (${keys}) values(${values})`
    // }
    // const query2Update = (tableName, query, where) => {
    //     let keyValue = ``
    //     Object.keys(query).forEach(key => keyValue += `${'`' + key + '`'}=${query[key]}, `)
    //     keyValue = keyValue.substr(0, keyValue.length - 2)
    //     return `update ${`${tableName}`} set ${keyValue} where ${where}`
    // }
    // const query2Delete = (tableName, where) => {
    //     return `delete from ${tableName}  where ${where}`
    // }
    // console.log(query2Update('student', user, 'studentno = 1003'))
    // const insertData = await exec(query2Insert('student', user))
    // const updateData = await exec(query2Update('student', user, 'studentno = 1004'))
    // const deleteData = await exec(query2Delete('student', 'studentno = 1004'))
    const queryData = await exec("SELECT sup.`categoryname` AS '父类', sub.`categoryname` AS '子类' FROM `category` AS sup, `category` AS sub WHERE sub.pid = sup.categoryid;")
    console.log(queryData)

    // queryData.map(item => {
    //     console.log(item)
    // })

    // const transaction = connection.beginTransaction(async (err) => {
    //     try {
    //         const queryData2 = await exec(query2Update('shop', { money: 'money+500' }, 'id = 2'))
    //         const queryData1 = await exec(query2Update('shop', { money: 'money-500' }, 'id = 1'))
    //         setTimeout(()=>{
    //             connection.commit((err) => {
    //                 console.log(err)
    //             })
    //         }, 5000)
    //     } catch (error) {
    //         console.log(error)
    //         connection.rollback(transaction)
    //     }
    // })
    // console.log(updateData)
})()
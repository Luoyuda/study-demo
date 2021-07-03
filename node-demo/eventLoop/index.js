// /*
//  * @Author: xiaohuolong
// //  * @Date: 2020-07-26 15:50:00
// //  * @LastEditors: xiaohuolong
// //  * @LastEditTime: 2020-07-26 15:53:14
// //  * @FilePath: /study-demo/node-demo/eventLoop/index.js
// //  */ 
const fs = require('fs')
console.log('start')

fs.writeFile('text.txt', '我写的数据', (err) => {
    if (err) throw err;
    console.log('text1');
});

setTimeout(() => {
    console.log('setTimeout 1')
    Promise.resolve()
    .then(()=> {
        console.log('promise 3')
    })
})

setTimeout(() => {
    console.log('setTimeout 2')
    Promise.resolve()
    .then(()=> {
        console.log('promise 4')
        Promise.resolve()
        .then(()=> {
        console.log('promise 5')
        })
    })
    .then(()=> {
        console.log('promise 6')
    })
    .then(()=> {
        fs.writeFile('text1.txt', '我写的数据', (err) => {
        if (err) throw err;
        console.log('text2');
        });
        setTimeout(()=>{
        console.log('setTimeout 3')
        Promise.resolve()
        .then(()=> {
            console.log('promise 7')
        })
        .then(()=> {
            console.log('promise 8')
        })
        }, 1000)
    })
}, 0);

Promise.resolve()
.then(()=> {
    console.log('promise 1')
})
.then(()=> {
    console.log('promise 2')
})
console.log('end')

// console.log(1)
// Promise.resolve().then(() => {
//     console.log('promise one')
//     process.nextTick(() => {
//         console.log('nextTick one end')
//     })
// })
// process.nextTick(() => {
//     console.log('nextTick one')
// })

// setTimeout(() => {
//     process.nextTick(() => {
//         console.log('nextTick two')
//     })
//     console.log(3)
//     Promise.resolve().then(()=> {
//         console.log('promise two')
//         process.nextTick(() => {
//             console.log('nextTick two end')
//         })
//         setTimeout(() => {
//             Promise.resolve().then(()=> {
//                 console.log('promise three')
//                 process.nextTick(() => {
//                     console.log('nextTick three end')
//                 })
//             })
//         })
//     })
//     console.log(4)
// }, 3);
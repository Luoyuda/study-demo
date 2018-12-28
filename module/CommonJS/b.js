const {a, b} = require('./a');
a() //a
module.exports.b = () => {
    console.log('b')
    a() //a
}
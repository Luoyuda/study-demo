define(function(require, exports) {
    var c = require('./c.js').c
    exports.sayHi = function(){
        console.log(c)
    }
});
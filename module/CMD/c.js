define(function(require, exports) {
    var b = require('./b.js').b
    var c = b + '-c'
    exports.c = c
});
define(function(require, exports) {
    var a = require('./a.js').a
    var b = a + '-b'
    exports.b = b
});
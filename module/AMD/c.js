define([
    './a.js',
    './b.js'
], function(a, b) {
    console.log(a,b)
    a.a++
    b.b++
    return {
        c: a.a + b.b
    }
});
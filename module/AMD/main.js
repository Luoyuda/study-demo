require(["./a","./b","./c.js"], function(a,b,c) {
    console.log(a,b,c)
    a.sayHi() //Hi-a
    b.sayHi() //Hi-b
    console.log(c.c) //5
})
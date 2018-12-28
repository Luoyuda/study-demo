const bf = require('./b').b;
var {a, b} = require('./a');
a() //a
b()
bf() //b
b() 
var {a, b} = require('./a');
b() 

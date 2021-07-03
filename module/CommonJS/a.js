let b =  {
    count: 1
}
exports.a = () => {
    console.log('a')
    b.count+=1
}
exports.bCount = b
exports.b = () => {
    console.log(b)
}
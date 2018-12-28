let b = 0
exports.a = () => {
    console.log('a')
    b+=1
}
exports.b = () => {
    console.log(b)
}
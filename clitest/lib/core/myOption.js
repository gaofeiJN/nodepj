const myOption=function(program){
    program.option('-t --taotao','淘淘小宝贝');
    program.option('-c --city','我在济南很想你');
    program.option('-w --world','你好，世界！');
}

module.exports = myOption;
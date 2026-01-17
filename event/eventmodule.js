// 导入events
let events=require('events');

// 创建EventEmitter类的对象，并将其导出
exports.timer=new events.EventEmitter();

// 在对象上触发事件
let count=0;
let intervalID=setInterval(function(){
    count+=1;
    exports.timer.emit("gfevent", count);
},1000);

// 停止
setTimeout(function(){
    clearInterval(intervalID);
},8100);
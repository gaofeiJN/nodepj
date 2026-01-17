const EventEmitter=require("node:events");
const util=require("util");

const obj=new EventEmitter();
console.log(obj);
console.log(util.inspect(obj));
console.log(obj.eventNames());      // []
console.log(obj.listenerCount('event1'));   // 0
console.log(obj.listenerCount('event2'));   // 0
console.log('-----------------------');

// 设置对象监听器
obj.addListener('event1',function listener1(){
    console.log('listener1');
});
obj.prependListener('event1',function listener2(){
    console.log('listener2');
});
var listener3=function (){
    console.log('listener3');
}
obj.addListener('event1',listener3);
obj.on('event2',function listener4(){
    console.log('listener4');
});

console.log(obj.eventNames());      // [ 'event1', 'event2' ]
console.log(obj.listenerCount('event1'));   // 3
console.log(obj.listenerCount('event2'));   // 1
console.log('-----------------------');

obj.removeListener('event1',listener3);
obj.removeAllListeners('event2');

console.log(obj.eventNames());      // [ 'event1' ]
console.log(obj.listenerCount('event1'));   // 2
console.log(obj.listenerCount('event2'));   // 0
console.log('-----------------------');
// 导入EventEmitter对象
let events=require("./eventmodule.js");
let timer=events.timer;

// 为对象设置事件监听器
timer.on("gfevent", function (count) {
    console.log(`淘淘第${count}次哭了，哇~~~`);
});
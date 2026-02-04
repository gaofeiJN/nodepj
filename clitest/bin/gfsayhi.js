#! /usr/bin/env node
const { program } = require("commander");

console.log("hi,tao tao~");

// commander
program.option("-t --taotao", "淘淘小帅哥");
program.option("-l --livelove", "二刺猿赛高");
program.option("-m --money", "钱越多越好");

// gfsayhi -h
//
// Usage: gfsayhi [options]
//
// Options:
//     -t --taotao    淘淘小帅哥
//     -l --livelove  二刺猿赛高
//     -m --money     钱越多越好
//     -h, --help     display help for command

program
  .command("sayhello <name> [other...]")
  .alias("echo") // 别名
  .option("-c --city")
  .description("说点什么")
  .action(function (name, other) {
    console.log(name + "，你好啊~");
    console.log(other);
  });

program.parse(process.argv);

// gfsayhi -h
//     Commands:
//         sayhello|echo [options] <name> [other...]  说点什么
//         help [command]                   display help for command

// gfsayhi sayhello gaofei 1 2 3 gou mao
// hi,tao tao~
// gaofei，你好啊~
// [ '1', '2', '3', 'gou', 'mao' ]

#! /usr/bin/env node

console.log("Hello World!");
// console.log(process.argv);

const argarr = [...process.argv];
if (argarr.includes("-gougou")) {
  console.log("wang wang~");
}
if (argarr.includes("-love")) {
  console.log("bang bang~");
}
if (argarr.includes("-money")) {
  console.log("钱钱钱~");
}

const ora = require("ora");
const chalk = require("chalk");

const spinner = ora().start();
spinner.text = chalk.blue("Loading...");
spinner.color = "yellow";
// spinner.spinner = "dots";
// spinner.spinner = "line";
// spinner.spinner = "circle";
spinner.spinner = "growHorizontal";

setTimeout(() => {
  spinner.succeed(chalk.red("Loaded"));
}, 5000);

console.log(chalk.blue("This is a blue text"));

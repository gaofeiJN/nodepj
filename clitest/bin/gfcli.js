#! /usr/bin/env node

const {program}=require('commander');

// options
const myOption=require('../lib/core/myOption')
myOption(program);

// commands
const myCommand=require('../lib/core/myCommand')
myCommand(program);

// 解析参数
program.parse(process.argv);
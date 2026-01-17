import * as gf from './mjs.mjs';

console.log(gf);
console.log(gf.name);
console.log(gf.getName());
// (node:13560) Warning: Failed to load the ES module: E:\nodetst\module-test\mjs-main.js. Make sure to set "type": "module" in the nearest package.json file or use the .mjs extension.
// (Use `node --trace-warnings ...` to show where the warning was created)

// 在node.js中使用ES的模块标准，方法：
// 1. 文件后缀'.js' ==> '.mjs'
// 2. package.json文件中添加【"type" : "module"】   type : module (ES标准) ， commonjs (commonjs标准)

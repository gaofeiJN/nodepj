let fs = require('fs');

// read
fs.readFile('./kyklist.txt','utf-8',function(err,data){
    if(err){
        console.log(`error : ${err}`);
    }
    else {
        console.log(data);
    }
});

// write
fs.readFile('./kyklist.txt','utf-8',function(err,data){
    if(err){
        console.log(`error : ${err}`);
    }
    else {
        console.log(data);
        let wdata = data + 'Hello world! 2026.01.10';
        fs.writeFile('./kyklist.txt',wdata,function(err){
            if(err){
                console.log(`error : ${err}`);
            }
        });
    }
});
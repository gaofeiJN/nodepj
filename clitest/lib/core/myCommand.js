const myAction=require('./myAction');

const myCommand=function(program){
    program
        .command('sayhi <name> [other...]')         // other后面必须3个点，否则【other..】被视为一个参数
        .option('-y --yell','大声喊出来')
        .alias('echo')
        .description('Sayhi command')
        .action(myAction)
}

module.exports = myCommand;
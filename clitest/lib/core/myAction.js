// 使用inquirer进行命令交互
const inquirer=require('inquirer');
const config=require('../../config')

const myAction=function(name){
    inquirer.prompt([{
        type:'list',
        name:'name',
        message:`${name}的大名叫什么?`,
        choices:config.name
    }])
        .then(answers=>{
            console.log(answers);
            if(answers.name!=='高钰城'){
                console.log('哈哈，答错了！');
            } else {
                console.log('恭喜，答对了！');
                inquirer.prompt([{
                    type:'list',
                    name:'sex',
                    message:'淘淘是男孩还是女孩？',
                    choices:config.sex
                }])
                    .then(answers=>{
                        console.log(answers);
                        if (answers.sex!=='男'){
                            console.log('很可惜，答错了！');
                        } else {
                            console.log('恭喜，答对了！');
                            inquirer.prompt([{
                                type:'input',
                                name:'birthday',
                                message:'淘淘的生日是哪一天(yyyymmdd)？'
                            }])
                            .then(answers=>{
                                console.log(answers);
                                if (answers.birthday !=='20240917'){
                                    console.log('答错了！');
                                } else {
                                    console.log('恭喜，答对了！');
                                }
                            })
                        }
                    })
            }
        })

}

module.exports=myAction;
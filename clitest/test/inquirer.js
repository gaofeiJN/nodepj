const inquirer = require('inquirer');

// console.log(inquirer);
// console.log(typeof(inquirer));
// console.log(typeof(inquirer.prompt));

inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'What is your name?',
}]).then(answers => {
    console.log(`Hello, ${answers.name}!`);
});
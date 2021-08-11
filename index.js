// 引入
const homedir = require('os').homedir();
const home = process.env.HOME || homedir;
const { fstat } = require('fs');
const p = require('path')
const fs = require('fs')
const dbPath = p.join(home, '.todo')
const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async(title) => {
    // 读取之前的任务
    const list = await db.read()
        // 往里面添加一个 title 任务
    list.push({ title, done: false })
        // 存储任务到文件
    await db.write([])
}

function markAsDone(list, index) {
    list[index].done = true
    db.write(list)
}

function markAsUndone(list, index) {
    list[index].done = false
    db.write(list)
}

function updateTitle() {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '新的标题'
    }).then(answers => {
        list[index].title = answer.title
        db.write(list)
    })
}

module.exports.clear = async() => {
    await db.write([])
}

function createTask(list) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '输入任务标题'
    }).then(answers => {
        list.push({
            title: answer.title,
            done: false
        })
        db.write(list)

    })

}

function askForAction(list, index) {
    // 只把if里面的剪切过来
    inquirer.prompt({
        type: 'list',
        name: 'title',
        message: '请选择操作',
        choices: [
            { name: '退出', value: 'quit' },
            { name: '已完成', value: 'markAsDone' },
            { name: '未完成', value: 'markAsUndone' },
            { name: '改标题', value: 'updateTitle' },
            { name: '删除', value: 'remove' },
        ]
    }).then(answer2 => {
        switch (answer2.action) {
            case 'markAsDone':
                markAsDone(list, index);
                break;
            case 'markAsUndone':
                markAsUnDone(list, index);
                break;
            case 'updateTitle':
                inquirer.prompt({
                    type: 'input',
                    name: 'title',
                    message: '新的标题',
                    default: list[index].title
                }).then(answers => {
                    list[index].title = answer.title
                    db.write(list)
                })
                break;
            case 'remove':
                list.splice(index, 1)
                db.write(list)
                break;
        }
    })

}

function printTasks(list) {
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: '请选择你想操作的任务',
            choices: [{ name: '退出', value: '-1' }, list.map((task, index) => {
                return { name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`, value: index, toString() }
            }), {
                name: '+创建任务',
                value: '-2'
            }]
        })
        .then(answers => {
            const index = parseInt(answer.index)
            if (index >= 0) {
                //选中了一个任务
                askForAction(list, index)
            } else if (index === -2) {
                askForCreateTask(list)
            }
        })

}

module.exports.showAll = async() => {
    // 读取之前的任务
    const list = await db.read()
        // 打印之前的任务
        // printTasks
    printTeaks(list)
}
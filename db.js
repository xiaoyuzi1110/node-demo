// 引入
const homedir = require('os').homedir();
const home = process.env.HOME || homedir;
const { fstat } = require('fs');
const p = require('path')
const fs = require('fs')
const dbPath = p.join(home, '.todo')

const db = {
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, { flat: 'a+' }, (error, data) => {
                if (error) { return reject(error) }
                let list
                try {
                    list = JSON.parse(data.toString())
                } catch (error2) {
                    list = []
                }
                resolve(list)
            })
        })
    },
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            const string = JSON.stringfy(list)
            fs.writeFile(path, string + '\n', (error) => {
                if (error) return reject(error)
                resolve()
            })
        })
    }
}
module.exports = db
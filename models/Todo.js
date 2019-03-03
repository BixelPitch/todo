const mysql = require('../mysql/MySQL')

class Todo {
    static deserialize (rows) {
        let result = []
        rows.forEach(row => {
            if (result[row.TODO_ID] === undefined) {
                result[row.TODO_ID] = {
                    TODO_ID: row.TODO_ID,
                    TEXT: row.TEXT,
                    DONE: row.DONE,
                    CREATED: row.CREATED,
                    UPDATED: row.UPDATED
                }
                result[row.TODO_ID].USER = {
                    USER_ID: row.USER_ID,
                    USERNAME: row.USERNAME
                }
            }
        })
        result = result.filter(a => { return a })
        return result
    }

    static find (obj) {
        return new Promise((resolve, reject) => {
            obj = obj || {}
            let objKeys = Object.keys(obj)
            let query = objKeys.length === 0
                ? 'SELECT * FROM TODOS LEFT JOIN USERS ON USERS.USER_ID=TODOS.USER;'
                : 'SELECT * FROM TODOS LEFT JOIN USERS ON USERS.USER_ID=TODOS.USER WHERE'
            objKeys.forEach((key, index) => {
                switch (key) {
                case 'TODO_ID':
                    query += ' TODOS.TODO_ID=' + obj.TODO_ID.toString()
                    break
                case 'DONE':
                    query += ' TODOS.DONE=' + obj.DONE.toString()
                    break
                case 'TEXT':
                    query += ' TODOS.TEXT=' + obj.TEXT.toString()
                    break
                case 'USER':
                    query += ' TODOS.USER=' + obj.USER.toString()
                    break
                }
                if (index === objKeys.length - 1) {
                    query += ';'
                } else {
                    query += ' AND'
                }
            })
            mysql.query(query)
                .then(rows => {
                    resolve(this.deserialize(rows))
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    static findOneAndUpdate (id, obj) {
        return new Promise((resolve, reject) => {
            obj = obj || {}
            let objKeys = Object.keys(obj)
            if (objKeys.length === 0) return reject(new Error('Invalid parameter "obj"'))
            let query = 'UPDATE TODOS SET'
            objKeys.forEach((key, index) => {
                switch (key) {
                case 'DONE':
                    query += ' DONE=' + obj.DONE.toString()
                    break
                case 'TEXT':
                    query += ' TEXT="' + obj.TEXT.toString() + '"'
                    break
                }
                if (index === objKeys.length - 1) {
                    query += ' WHERE TODOS.TODO_ID=' + id.toString() + ';'
                } else {
                    query += ' AND'
                }
            })
            mysql.query(query)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    static findOneAndDelete (id) {
        return new Promise((resolve, reject) => {
            mysql.query('DELETE FROM TODOS WHERE TODO_ID=' + id.toString() + ';')
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    static findOne (id) {
        return new Promise((resolve, reject) => {
            mysql.query('SELECT * FROM USERS, TODOS WHERE USERS.USER_ID = TODOS.USER AND TODOS.TODO_ID = ' + id.toString() + ';')
                .then(rows => {
                    let todos = this.deserialize(rows)
                    let result = null
                    todos.forEach(todo => {
                        if (todo.TODO_ID === id) {
                            result = todo
                        }
                    })
                    resolve(result)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    static create (text, userid) {
        return new Promise((resolve, reject) => {
            mysql.query('INSERT INTO TODOS(TEXT, USER) VALUES("' + text.toString() + '","' + userid.toString() + '")')
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}

module.exports = Todo

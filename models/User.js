const mysql = require('../mysql/MySQL')

class User {
    static deserialize (rows) {
        let result = []
        rows.forEach(row => {
            if (result[row.USER_ID] === undefined) {
                result[row.USER_ID] = {
                    USER_ID: row.USER_ID,
                    USERNAME: row.USERNAME,
                    PASSWORD: row.PASSWORD,
                    TODOS: []
                }
            }
            if (row.TODO_ID) {
                result[row.USER_ID].TODOS.push({
                    TODO_ID: row.TODO_ID,
                    TEXT: row.TEXT,
                    DONE: row.DONE,
                    CREATED: row.CREATED,
                    UPDATED: row.UPDATED
                })
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
                ? 'SELECT * FROM USERS LEFT JOIN TODOS ON TODOS.USER=USERS.USER_ID;'
                : 'SELECT * FROM USERS LEFT JOIN TODOS ON TODOS.USER=USERS.USER_ID WHERE'
            objKeys.forEach((key, index) => {
                switch (key) {
                case 'USER_ID':
                    query += ' USERS.USER_ID=' + obj.USER_ID.toString()
                    break
                case 'USERNAME':
                    query += ' USERS.USERNAME="' + obj.USERNAME + '"'
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
            let query = 'UPDATE USERS SET'
            objKeys.forEach((key, index) => {
                switch (key) {
                case 'USERNAME':
                    query += ' USERNAME="' + obj[key] + '"'
                    break
                }
                if (index === objKeys.length - 1) {
                    query += ' WHERE USERS.USER_ID=' + id + ';'
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
            mysql.query('DELETE FROM USERS WHERE USER_ID=' + id.toString() + ';')
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
            mysql.query('SELECT * FROM USERS LEFT JOIN TODOS ON TODOS.USER=USERS.USER_ID WHERE USERS.USER_ID = ' + id.toString() + ';')
                .then(rows => {
                    let users = this.deserialize(rows)
                    let result = null
                    users.forEach(user => {
                        if (user.USER_ID === id) {
                            result = user
                        }
                    })
                    resolve(result)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    static create (username, password) {
        return new Promise((resolve, reject) => {
            mysql.query('INSERT INTO USERS(USERNAME, PASSWORD) VALUES("' + username + '","' + password + '")')
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}

module.exports = User

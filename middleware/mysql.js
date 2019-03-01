const fs = require('fs')
const path = require('path')

module.exports = function (mysql) {
    let createUserQuery = fs.readFileSync(path.join(__dirname, '../mysql/User.sql')).toString()
    let createTodoQuery = fs.readFileSync(path.join(__dirname, '../mysql/Todo.sql')).toString()
    let error = null
    let connected = false

    mysql.query(createUserQuery)
        .then(() => {
            mysql.query(createTodoQuery)
                .then(() => {
                    connected = true
                })
                .catch(err => {
                    error = err
                })
        })
        .catch(err => {
            error = err
        })

    return function (req, res, next) {
        if (error) return res.render('database-error', { error: error, i18n: req.i18n })
        if (!connected) return res.render('loading', { layout: 'layout-loading', i18n: req.i18n })
        req.mysql = mysql
        next()
    }
}

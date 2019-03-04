const mysql = require('mysql')
const config = require('../config')

const pool = mysql.createPool({
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    port: config.MYSQL_PORT,
    database: config.MYSQL_DB,
    connectionLimit: config.MYSQL_CONNECTION_LIMIT
})

let query = function (query) {
    return new Promise((resolve, reject) => {
        pool.query(query, (err, rows) => {
            if (err) return reject(err)
            resolve(rows)
        })
    })
}

let escape = function (s) {
    return mysql.escape(s)
}

module.exports = {
    query: query,
    escape
}

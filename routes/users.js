const express = require('express')
const router = express.Router()
const User = require('../models/User')
const createError = require('http-errors')

router.get('/', (req, res, next) => {
    User.find()
        .then(users => {
            users.map(user => {
                user.EDITABLE = user.USER_ID === req.user.USER_ID
                user.i18n = req.i18n
                return user
            })
            res.render('users', { users: users, i18n: req.i18n })
        })
        .catch(err => {
            next(createError(500, err))
        })
})

module.exports = router

const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.get('/', (req, res, next) => {
    User.find()
        .then(users => {
            users.map(user => {
                user.EDITABLE = user.USER_ID === req.user.USER_ID
                user.i18n = req.i18n
                return user
            })
            res.render('users', { users: users })
        })
        .catch(() => {
            res.sendStatus(500)
        })
})

module.exports = router

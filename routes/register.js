const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator/check')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10
const User = require('../models/User')

router.get('/', function (req, res, next) {
    res.render('register')
})

router.post('/', [
    body('password')
        .isLength({ min: 1 })
        .custom((value, { req, loc, path }) => {
            if (value !== req.body.passwordConfirmation) {
                throw new Error("passwords don't match")
            } else {
                return value
            }
        }),
    body('username')
        .isLength({ min: 1, max: 64 })
        .custom(async (value, { req, loc, path }) => {
            User.find({ USERNAME: req.body.username })
                .then(users => {
                    if (users.length > 0) {
                        throw new Error('username is already taken')
                    } else {
                        return value
                    }
                })
                .catch(err => {
                    throw new Error(err)
                })
        })
], function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return res.sendStatus(500)

        bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) return res.sendStatus(500)

            User.create(req.body.username, hash)
                .then(() => {
                    res.redirect('/login')
                })
                .catch(() => {
                    res.sendStatus(500)
                })
        })
    })
})

module.exports = router

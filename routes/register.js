const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator/check')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10
const User = require('../models/User')
const createError = require('http-errors')

router.get('/', function (req, res, next) {
    if (req.query.errors) {
        let errors = []
        req.query.errors.split('+').forEach(item => {
            if (req.i18n[item]) errors.push(req.i18n[item])
        })
        return res.render('register', {
            i18n: req.i18n,
            error: {
                message: req.i18n.casualErrorText,
                errors: errors
            }
        })
    }
    res.render('register', { i18n: req.i18n })
})

router.post('/', [
    body('password', 'passwordValidation')
        .isLength({ min: 1 })
        .custom((value, { req, loc, path }) => {
            if (value !== req.body.passwordConfirmation) {
                throw new Error('passwordsNotEqual')
            } else {
                return value
            }
        }),
    body('username', 'usernameValidation')
        .isLength({ min: 1, max: 64 })
        .custom(async (value, { req, loc, path }) => {
            User.find({ USERNAME: req.body.username })
                .then(users => {
                    if (users.length > 0) {
                        throw new Error('usernameTaken')
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
        let query = '?errors='
        errors.array().forEach((error, index) => {
            query += error.msg
            if (index < errors.array().length - 2) query += '+'
        })
        return res.redirect('/register' + query)
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(createError(500, err))

        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) return next(createError(500, err))

            User.create(req.body.username, hash)
                .then(() => {
                    res.redirect('/login')
                })
                .catch(err => {
                    next(createError(500, err))
                })
        })
    })
})

module.exports = router

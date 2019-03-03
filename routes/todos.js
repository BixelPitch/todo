const express = require('express')
const router = express.Router()
const Todo = require('../models/Todo')
const { body, param, validationResult } = require('express-validator/check')
const { sanitizeBody, sanitizeParam } = require('express-validator/filter')
const createError = require('http-errors')

router.post('/', [
    body('userid', 'useridValidation').isLength({ min: 1 }).isNumeric(),
    body('text', 'textValidation').isLength({ min: 1 }),
    sanitizeBody('userid').toInt(),
    sanitizeBody('text').toString()
], function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return next(createError(400, errors.array().pop()))
    if (req.body.userid !== req.user.USER_ID) return next(createError(403))

    Todo.create(req.body.text, req.body.userid)
        .then(() => {
            res.redirect(req.landingPage)
        })
        .catch(err => {
            next(createError(500, err))
        })
})

router.post('/:todoid', [
    param('todoid', 'todoid is invalid').isNumeric(),
    sanitizeBody('text').toString(),
    sanitizeBody('done').toInt(),
    sanitizeParam('todoid').toInt()
], function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return next(createError(400, errors.array().pop()))
    if (req.body.text === undefined && req.body.done === undefined) return next(createError(400, req.i18n.textOrDoneRequired))
    if (req.body.text !== undefined) {
        if (req.body.text.length > 0) {
            Todo.findOneAndUpdate(req.params.todoid, { TEXT: req.body.text })
                .then(() => {
                    res.redirect(req.landingPage)
                })
                .catch(err => {
                    next(createError(500, err))
                })
        } else {
            Todo.findOneAndDelete(req.params.todoid)
                .then(() => {
                    res.redirect(req.landingPage)
                })
                .catch(err => {
                    next(createError(500, err))
                })
        }
    } else {
        Todo.findOneAndUpdate(req.params.todoid, { DONE: req.body.done })
            .then(() => {
                res.redirect(req.landingPage)
            })
            .catch(err => {
                next(createError(500, err))
            })
    }
})

module.exports = router

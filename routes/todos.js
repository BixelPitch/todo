const express = require('express')
const router = express.Router()
const Todo = require('../models/Todo')
const { body, param, validationResult } = require('express-validator/check')
const { sanitizeBody, sanitizeParam } = require('express-validator/filter')

router.post('/', [
    body('userid', 'userid is invalid').isLength({ min: 1 }),
    body('text', 'text is invalid').isLength({ min: 1 }),
    sanitizeBody('userid').toInt(),
    sanitizeBody('text').toString()
], function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })
    if (req.body.userid !== req.user.USER_ID) return res.sendStatus(403)

    Todo.create(req.body.text, req.body.userid)
        .then(() => {
            res.redirect(req.landingPage)
        })
        .catch(() => {
            res.sendStatus(500)
        })
})

router.post('/:todoid', [
    param('todoid', 'todoid is invalid').isNumeric(),
    sanitizeBody('text').toString(),
    sanitizeBody('done').toInt(),
    sanitizeParam('todoid').toInt()
], function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })
    if (req.body.text === undefined && req.body.done === undefined) return res.sendStatus(400)
    if (req.body.text !== undefined) {
        if (req.body.text.length > 0) {
            Todo.findOneAndUpdate(req.params.todoid, { TEXT: req.body.text })
                .then(() => {
                    res.redirect(req.landingPage)
                })
                .catch(() => {
                    res.sendStatus(500)
                })
        } else {
            Todo.findOneAndDelete(req.params.todoid)
                .then(() => {
                    res.redirect(req.landingPage)
                })
                .catch(() => {
                    res.sendStatus(500)
                })
        }
    } else {
        Todo.findOneAndUpdate(req.params.todoid, { DONE: req.body.done })
            .then(() => {
                res.redirect(req.landingPage)
            })
            .catch(() => {
                res.sendStatus(500)
            })
    }
})

module.exports = router

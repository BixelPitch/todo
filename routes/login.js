const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', function (req, res, next) {
    res.render('login')
})

router.post('/', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: false }),
(req, res) => {
    res.redirect(req.landingPage)
})

module.exports = router

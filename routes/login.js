const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', function (req, res, next) {
    if (req.query.error) {
        return res.render('login', {
            i18n: req.i18n,
            error: {
                message: req.i18n.loginError
            }
        })
    }
    res.render('login', { i18n: req.i18n, error: req.query.error !== undefined })
})

router.post('/', passport.authenticate('local', {
    failureRedirect: '/login?error=true',
    failureFlash: false }),
(req, res) => {
    res.redirect(req.landingPage)
}
)

module.exports = router

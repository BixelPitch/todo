const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    req.logout()
    res.render('logout', { i18n: req.i18n })
})

module.exports = router

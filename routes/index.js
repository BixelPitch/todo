var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
    res.redirect(req.landingPage)
})

router.use('/users', require('./users'))
router.use('/todos', require('./todos'))

module.exports = router

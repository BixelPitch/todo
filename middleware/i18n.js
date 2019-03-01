const parser = require('accept-language-parser')
const fs = require('fs')
const path = require('path')

module.exports = function (req, res, next) {
    const languages = req.header('Accept-Language') ? parser.parse(req.header('Accept-Language')) : []
    let selectedLanguage = languages.find(language => {
        return fs.existsSync(path.join(__dirname, '../i18n', language.code + '.json'))
    }) || { code: 'default' }
    req.i18n = require(path.join(__dirname, '../i18n', selectedLanguage.code + '.json'))
    next()
}
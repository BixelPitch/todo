const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const sassMiddleware = require('node-sass-middleware')
const mysqlMiddleware = require('./middleware/mysql')
const mysql = require('./mysql/MySQL')
const bcrypt = require('bcrypt')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const hbs = require('hbs')
const config = require('./config')
const User = require('./models/User')

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    function (username, password, done) {
        User.find({ USERNAME: username })
            .then(users => {
                if (users.length !== 1) return done(null, false, { message: 'incorrect username' })
                let user = users[0]
                if (!bcrypt.compareSync(password, user.PASSWORD)) {
                    return done(null, false, { message: 'incorrect password' })
                }
                return done(null, user)
            })
            .catch(err => {
                done(err)
            })
    }
))

passport.serializeUser(function (user, done) {
    done(null, user.USER_ID)
})

passport.deserializeUser(function (id, done) {
    User.findOne(id)
        .then(user => {
            if (user === null) return done(null, false, { message: 'user does not exist' })
            done(null, user)
        })
        .catch(err => {
            done(err)
        })
})

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, '/views/partials'))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false,
    sourceMap: true
}))
app.use(mysqlMiddleware(mysql))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    req.landingPage = '/users'
    next()
})

app.use('/login', require('./routes/login'))
app.use('/register', require('./routes/register'))
app.use('/logout', require('./routes/logout'))
app.use((req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.redirect('/login')
    }
})

app.use('/', require('./routes/index'))

app.use(function (req, res, next) {
    next(createError(404))
})

app.use(function (err, req, res, next) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
    res.render('error')
})

module.exports = app

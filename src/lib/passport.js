const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../database')
const helpers = require('./helpers')

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    const rows = await db.query('SELECT * FROM promotores WHERE username = ?', [username])
    if (rows.length > 0) {
      const user = rows[0]
      const validPassword = await helpers.matchPassword(password, user.password)
      if (validPassword) {
        done(null, user, req.flash('success', 'Bienvenido ' + user.nombre))
      } else {
        done(null, false, req.flash('message', 'Password Incorrecto'))
      }
    } else {
      return done(null, false, req.flash('message', 'El Username No Existe.'))
    }
  }));

passport.use('local.register', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { nombre } = req.body
    const newUser = {
        nombre,
        username,
        password
    }

    newUser.password = await helpers.encryptPassword(password)
    const result = await db.query('INSERT INTO promotores SET ?', [newUser])
    newUser.id = result.insertId
    return done(null, newUser)
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser( async (id, done) => {
    const rows = await db.query('SELECT * FROM promotores WHERE id = ?', [id])
    done(null, rows[0])
})
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const passport = require('passport')
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth')

/**
 * muestra la vista de registro
 */
router.get('/register', isNotLoggedIn, (req, res) => {
    res.render('auth/register')
})

/**
 * añaded un nuevo promotor
 */
router.post('/register', isNotLoggedIn, passport.authenticate('local.register', {
    successRedirect: 'prospectos/',
    failureRedirect: 'auth/register',
    failureFlash: true
}))

/**
 * vista del formulario login
 */
router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login')
})
  
/**
 * Valida los compos y hace el login 
 */
router.post('/login',check('username', 'usuario requerido').notEmpty(),check('password', 'password requerida').notEmpty(), (req, res, next) => {
    const errors = validationResult(req)
    if (errors.errors.length > 0) {
        console.log('entro');
        req.flash('message', errors.errors[0].msg)
    }
    passport.authenticate('local.login', {
      successRedirect: 'prospectos/',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next)
})


/**
 * Cierra Sesión
 */
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})


module.exports = router
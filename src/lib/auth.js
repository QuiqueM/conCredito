
/**
 * Funciones para proteger las rutas y no puedan acceder si no estan logeados
 */
module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        return res.redirect('/login')
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next()
        }
        return res.redirect('prospectos')
    }
};
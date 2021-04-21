const express = require('express')
const router = express.Router()

/**
 * pagina principal
 */
router.get('/', (req, res) => {
    res.render('index')
})


module.exports = router
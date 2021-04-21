const express = require('express')
const router = express.Router()
const db = require('../database')
const { isLoggedIn } = require('../lib/auth')
const multer = require('multer')
//alamcenar los archivos en una carpeta
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/files')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({storage})

/**
 * Muestra el formulario para agregar un nuevo prospecto
 */
router.get('/nuevo', (req, res) => {
    res.render('prospectos/agregar')
})

/**
 * Agrega un nuevo prospecto con su documentación
 */
router.post('/nuevo', upload.array('archivos[]'), async (req, res) => {
 
    const { nombre, apellidoPaterno, apellidoMaterno,calle,numero,cp,colonia,telefono,rfc, nombres } = req.body
    const newProspecto = {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        calle,
        numero,
        colonia,
        cp,
        telefono,
        rfc,
        id_promotor: req.user.id,
        estatus: 'Enviado'
    }
    const prospecto = await db.query('INSERT INTO prospectos SET ?', [newProspecto])
    let newDocumentos = {}
    for (var i = 0; i < nombres.length; i++){
        newDocumentos = {
            nombre: nombres[i],
            documento: req.files[i].filename,
            id_prospecto: prospecto.insertId
        }
        await db.query('INSERT INTO documentos SET ?', [newDocumentos])
    }
    req.flash('success', 'Prospecto guardado con exito')
    res.redirect('/prospectos')
})

/**
 * Muestra el listado de los prospectos
 */
router.get('/', isLoggedIn, async (req, res) => {
    const prospectos = await db.query('SELECT * FROM prospectos WHERE id_promotor = ?', [req.user.id])
    res.render('prospectos/listado', { prospectos })
})


/**
 * Muestra la informacion del prospecto para su posible aceptación o rechazo
 */
router.get('/ver/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params
    const prospecto = await db.query('SELECT * FROM prospectos WHERE id = ?', [id])
    const documentos = await db.query('SELECT * FROM documentos WHERE id_prospecto = ?', [id])
    console.log(documentos)
    res.render('prospectos/mostrar', {prospecto: prospecto[0], documentos: documentos})
})

/**
 * Acepta a un prospecto
 */
router.post('/aceptar', async (req, res) => {
    console.log(req.body)
    const { id } = req.body
    await db.query('UPDATE prospectos SET estatus = "Aceptado"  WHERE id = ?', [id])
    req.flash('success', 'Prospecto Aceptado')
    res.redirect('/prospectos')
})

/**
 * Rechaza a un prospecto
 */
router.post('/rechazar', async (req, res) => {
    const { id, observaciones } = req.body
    await db.query('UPDATE prospectos SET estatus = "Rechazado", observaciones = ?  WHERE id = ?', [observaciones, id])
    req.flash('success', 'Prospecto Rechazado')
    res.redirect('/prospectos')
})
module.exports = router
const mysql = require('mysql')
const { promisify } = require('util')
const { database } = require('./keys')


const db = mysql.createPool(database)

/**
 * Conexion a la base de datos
 */
db.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST ') {
            console.error('DATABASE CONNECTION WAS CLOSED')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTION')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION REFUSED')
        }
    }
    if (connection) connection.release()
    console.log('DB Conectada')
    return
})

//promisifay pool querys
db.query = promisify(db.query)
module.exports = db
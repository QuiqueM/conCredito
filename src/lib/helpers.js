const bycrypt = require('bcryptjs')
const helpers = {}

/**
 * Encripta las contraseñas
 */
helpers.encryptPassword = async (password) => {
    const salt = await bycrypt.genSalt(10)
    const hash = await bycrypt.hash(password, salt)

    return hash
}

/**
 * Valida que las contraseñas coincidad
 * @param {string} password 
 * @param {string} savedPassword 
 * @returns 
 */
helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bycrypt.compare(password, savedPassword)
    } catch (error) {
        console.error(error)
    }
}

module.exports = helpers
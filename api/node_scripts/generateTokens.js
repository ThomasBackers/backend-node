const crypto = require('crypto')

const generateToken = () => crypto.randomBytes(64).toString('hex')

console.log(`
ACCESS_TOKEN_SECRET:
${generateToken()}

REFRESH_TOKEN_SECRET:
${generateToken()}
`)

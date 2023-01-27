const bcrypt = require('bcryptjs')

export const encryptString = async (string) => {
    const saltRounds = 10
    const hash = await new Promise((resolve, reject) => {
        bcrypt.hash(string, saltRounds, function(err, hash) {
            if (err) reject(err)
            resolve(hash)
        })
    })
    return hash
}
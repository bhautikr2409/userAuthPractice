const mongoose = require("mongoose")


const dbConnect = async (url, name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await mongoose.connect(`${url}/${name}`)
            resolve(connection)
        }
        catch (err) {
            reject(err)
        }
    })
}

module.exports = dbConnect
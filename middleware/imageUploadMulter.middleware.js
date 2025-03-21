const multer = require("multer")
const crypto = require("crypto")
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, "..", "public", "uploadImage")
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, (err, bytes) => {
            const fn = bytes.toString("hex") + path.extname(file.originalname)
            cb(null, fn)
        })
    }
})


// const storage = multer.memoryStorage()


const upload = multer({
    storage: storage
});


module.exports = upload
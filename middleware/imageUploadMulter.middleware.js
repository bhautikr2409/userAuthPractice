const multer = require("multer")
const crypto = require("crypto")
const path = require("path")
const fs = require("fs")
const uploadDir = path.join(__dirname, "..", "public", "uploadImage")
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, (err, bytes) => {
            const fn = bytes.toString("hex") + path.extname(file.originalname)
            console.log("fn>>>>>", fn)
            cb(null, fn)
        })
    }
})



const upload = multer({
    storage: storage
});


module.exports = upload
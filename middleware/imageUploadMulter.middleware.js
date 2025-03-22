const multer = require("multer")
const crypto = require("crypto")
const path = require("path")
const fs = require("fs")
const os = require("os")
const osTempDir = fs.realpathSync(os.tmpdir())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, osTempDir)
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

console.log("upload.single>>", upload.single)

module.exports = upload
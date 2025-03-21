const cloudinary = require("../utils/cloudinary.utils")

const handleCloudinaryImageUpload = (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, (err, result) => {
        try {
            if (err) {
                console.log("error in handleCloudinaryImageUpload >>>", err)
                return res.json({ massege: "error", success: false })
            }
            req.cloudinaryResult = result;
            next();
        }
        catch (error) {
            return res.status(500).json({
                message: "Error uploading image",
                success: false
            });
        }
    })
}


module.exports = handleCloudinaryImageUpload
const express = require("express")
const { validateUser, userValidationSchema } = require("../validation/user.validation")
const handelUserSignup = require("../controller/user.controller")
const authenticateUser = require("../middleware/auth.middleware")
const userRouter = express.Router()
const upload = require("../middleware/imageUploadMulter.middleware")
const User = require("../model/user.model")
const handleCloudinaryImageUpload = require("../middleware/cloudibary.middleware")


userRouter.post("/signup",
    upload.single("image"),
    handleCloudinaryImageUpload,
    validateUser(userValidationSchema.register),
    handelUserSignup.handleUserSignup,
),

    userRouter.post("/login", handelUserSignup.handleUserLogin)
userRouter.post("/logout", handelUserSignup.handelUserLogout)
userRouter.post('/refresh-token', authenticateUser, handelUserSignup.handleTokenRefresh);



userRouter.get("/image/:userId", handelUserSignup.handleImage);

module.exports = userRouter
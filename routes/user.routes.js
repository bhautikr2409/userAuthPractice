const express = require("express")
const { validateUser, userValidationSchema } = require("../validation/user.validation")
const handelUserSignup = require("../controller/user.controller")
const authenticateUser = require("../middleware/auth.middleware")
const userRouter = express.Router()

userRouter.post("/signup",
    validateUser(userValidationSchema.register),
    handelUserSignup.handleUserSignup)

userRouter.post("/login", handelUserSignup.handleUserLogin)
userRouter.post("/logout", handelUserSignup.handelUserLogout)
userRouter.post('/refresh-token', authenticateUser, handelUserSignup.handleTokenRefresh);

module.exports = userRouter
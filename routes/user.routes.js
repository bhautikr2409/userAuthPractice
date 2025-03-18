const express = require("express")
const { validateUser, userValidationSchema } = require("../validation/user.validation")
const handelUserSignup = require("../controller/user.controller")
const userRouter = express.Router()

userRouter.post("/signup",
    validateUser(userValidationSchema.register),
    handelUserSignup.handleUserSignup)
userRouter.post("/login", handelUserSignup.handleUserLogin)

module.exports = userRouter
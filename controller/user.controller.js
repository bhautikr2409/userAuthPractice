const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const { setUserToken, refreshToken } = require("../service/token");
const crypto = require("crypto")
const path = require("path");
const { access } = require("fs");


const handleUserSignup = async (req, res) => {
    try {
        const { firstname, lastname, age, email, password, image } = req.body;

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                message: "user is already exist with this email"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // const imageName = crypto.randomBytes(12).toString("hex") + path.extname(req.file.originalname)

        console.log("req.cloudinaryResult >>>", req.cloudinaryResult)

        const imageData = req.cloudinaryResult ? req.cloudinaryResult.secure_url : undefined;

        console.log("imagedata >>", imageData)

        const newUser = await User.create({
            firstname,
            lastname,
            age,
            email,
            password: hashedPassword,
            imageURL: imageData
        });


        const token = setUserToken(newUser); // WORKING

        return res
            .cookie("accesstoken", token, {
                httpOnly: false,
                maxAge: 24 * 60 * 60 * 1000,
                path: '/'
            })
            .status(201).json({
                access_token: token,
                message: "User created successfully",
                newUser
            })

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
};


const handleUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const varifyUser = await User.findOne({ email })

        if (!varifyUser) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPassValid = await bcrypt.compare(password, varifyUser.password);
        if (!isPassValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = setUserToken(varifyUser);

        return res
            .cookie("accesstoken", token, {
                httpOnly: true,
                maxAge: 5 * 60 * 1000,
                path: '/'
            })
            .status(200)
            .json({
                message: "Login successful",
                token
            });
    }
    catch (err) {
        console.log('error in login>>>', err.message)
        throw err
    }
}


const handelUserLogout = async (req, res) => {
    try {
        res.clearCookie("accesstoken")
        return res.status(200).json({
            message: "Logged out successfully"
        });
    }
    catch (err) {
        console.log('error in login>>>', err.message)
        throw err
    }
}

const handleTokenRefresh = async (req, res) => {
    try {
        const userId = req.user.id;
        const newToken = refreshToken(userId);

        return res
            .cookie("accesstoken", newToken, {
                httpOnly: false,
                maxAge: 24 * 60 * 60 * 1000,
                path: '/'
            })
            .status(200)
            .json({
                message: "Token refreshed successfully"
            });
    } catch (error) {
        return res.status(500).json({
            message: "Error refreshing token",
            error: error.message
        });
    }
};

const handleImage = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user || !user.imageName) {
            return res.status(404).json({
                message: "Image not found"
            });
        }

        return res.send(user.imageName);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving image",
            error: error.message
        });
    }
}


module.exports = {
    handleUserSignup,
    handleUserLogin,
    handelUserLogout,
    handleTokenRefresh,
    handleImage
};
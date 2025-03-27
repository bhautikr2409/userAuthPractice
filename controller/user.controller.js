const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const { setUserToken, refreshToken } = require("../service/token");
const { validateUser, userValidationSchema } = require("../validation/user.validation");



const handleUserSignup = async (req, res) => {
    try {
        const { firstname, lastname, age, email, password } = req.body;

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                message: "user is already exist with this email"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const imageData = req.cloudinaryResult ? req.cloudinaryResult.secure_url : undefined;

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
                newUser,
                isLogin: true
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
                token,
                isLogin: true
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
            message: "Logged out successfully",
            isLogin: false
        });
    }
    catch (err) {
        console.log('error in login>>>', err.message)
        throw err
    }
}



const handleResetPass = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            res.json({ message: "user not found" })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        if (req.cookies.accesstoken) {
            await User.findOneAndUpdate({ password })
        }

        const newToken = refreshToken(user._id);

        const updatedUser = await User.findOne({ email })
        updatedUser.password = hashedPassword


        res.json({ token: newToken, user: updatedUser })

    }
    catch (err) {
        console.log("error in getting user", err)
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



module.exports = {
    handleUserSignup,
    handleUserLogin,
    handelUserLogout,
    handleTokenRefresh,
    handleResetPass
};
const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const setUserToken = require("../service/token");
const cookie = require("cookie-parser")


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
        const ismatch = await bcrypt.compare(password, hashedPassword)

        const newUser = await User.create({
            firstname,
            lastname,
            age,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User created successfully",
            newUser
        });

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

        // Generate token
        const token = setUserToken(varifyUser);

        return res
            .cookie("uid", token, {
                httpOnly: false,
                maxAge: 24 * 60 * 60 * 1000,
                path: '/'
            })
            .status(200)
            .json({
                message: "Login successful"
            });
    }
    catch (err) {
        console.log('error in login>>>', err.message)
        throw err
    }
}


module.exports = {
    handleUserSignup,
    handleUserLogin
};
const User = require("../model/user.model");
const bcrypt = require("bcrypt");

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
        console.log("ismatch>>>", ismatch)


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

        const isPassValid = await bcrypt.compare(password, varifyUser.password)

        if (varifyUser && isPassValid) {
            res.json({ message: "login successfully" })
        } else {
            res.json({ message: "invalid email or password" })
        }
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
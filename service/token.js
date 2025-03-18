
const jwt = require("jsonwebtoken")
const jwtSecretToken = process.env.JWT_TOKEN

const setUserToken = (user) => {
    const payload = {
        firstname: user.firstname,
        lasyname: user.lastname,
        age: user.age,
        email: user.email
    }

    return jwt.sign(payload, jwtSecretToken)
}


const getUserToken = (token) => {
    if (!token) return null

    return jwt.verify(token, jwtSecretToken)
}

module.exports = setUserToken
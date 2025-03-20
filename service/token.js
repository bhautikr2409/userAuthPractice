const jwt = require("jsonwebtoken")
const registerTokretSecret = process.env.REGISTER_TOKEN_SECRET
const reseTokenSecret = process.env.RESET_TOKEN_SECRET

const setUserToken = (user) => {
    try {
        const payload = {
            firstname: user.firstname,
            lasyname: user.lastname,
            age: user.age,
            email: user.email
        }

        return jwt.sign(payload, registerTokretSecret)
    }
    catch (err) {
        console.log("user not found", err)
        throw err
    }
}


const refreshToken = (userID) => {
    try {
        const payload = {
            id: userID
        }
        return jwt.sign(payload, reseTokenSecret)
    }
    catch (err) {
        console.log("error  in refresh token", err)
        throw err
    }
}

const getUserToken = (token) => {
    if (!token) return null

    return jwt.verify(token, registerTokretSecret)
}

module.exports = {
    setUserToken,
    refreshToken,
    getUserToken
}
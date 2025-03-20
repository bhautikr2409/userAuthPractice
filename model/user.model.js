const { string, number, required } = require("joi")
const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }

}, { timestamps: true })

const User = mongoose.model("User", userSchema)

module.exports = User
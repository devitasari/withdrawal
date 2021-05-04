const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    bussinesName: {
        type: String,
        required: [ true, `bussines name can't be empty`]
    },
    email: {
        type: String,
        required: [ true, `email can't be empty`]
    },
    lastWithdrawal: {
        type: Date
    },
    balances: {
        type: Array
    }
})

const User = model("User", userSchema)

module.exports = User
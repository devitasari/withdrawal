const { Schema, model } = require("mongoose")

const withdrawalSchema = new Schema({
    userId: {
        type: String,
        required: [true, `user id can't be empty`]
    },
    bankDetail: {
        type: Object,
        required: [true, `bank id can't be empty`]
    },
    amount: {
        type: Number,
        required: [true, `amount can't be empty`]
    },
    status: {
        type: String,
        required: [true, `status can't be empty`]
    },
    createdAt: {
        type: Date,
        required: [true, `timestamps can't be empty`]
    }
})

const Withdrawal = model("Withdrawal", withdrawalSchema)

module.exports = Withdrawal
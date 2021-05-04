const { Schema, model } = require("mongoose")

const withdrawalSchema = new Schema({
    userId: {
        type: String,
        required: [true, `user id can't be empty`]
    },
    bankId: {
        type: String,
        required: [true, `bank id can't be empty`]
    },
    amount: {
        type: Number,
        required: [true, `amount can't be empty`]
    },
    timestamps: {
        type: Date,
        required: [true, `timestamps can't be empty`]
    }
})

const Withdrawal = model("Withdrawal", withdrawalSchema)

module.exports = Withdrawal
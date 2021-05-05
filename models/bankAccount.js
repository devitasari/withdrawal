const { Schema, model } = require("mongoose")

function isCurrencyUnique(val) {
    return BankAccount.findOne({userId: this.userId, currency: val })
        .then(found => {
            if (found) return false
            else return true
        })
}

const bankAccountSchema = new Schema({
    userId: {
        type: String,
        required: [true, `user id can't be empty`]
    },
    currency: {
        type: String,
        required: [true, `currency can't be empty`],
        validate: [
            { validator: isCurrencyUnique, message: `currency is duplicate` }
        ]
    },
    bankCode: {
        type: String,
        required: [true, `bank code can't be empty`]
    },
    accountNumber: {
        type: String,
        required: [true, `account number can't be empty`],
        minLength: [10, `account number minimal 10 chars`]
    },
    accountHolderName: {
        type: String,
        required: [true, `account holder name can't be empty`],
        minLength: [3, `account holder name minimal 3 chars`]
    }
})

const BankAccount = model("BankAccount", bankAccountSchema)

module.exports = BankAccount
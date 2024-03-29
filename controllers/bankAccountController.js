const BankAccount = require("../models/bankAccount")

class BankAccountController {
    static register(req, res, next) {
        const { bankCode, accountNumber, accountHolderName, currency, userId } = req.body
        BankAccount.create({
            bankCode, accountNumber, accountHolderName, currency, userId
        })
        .then(newBankAccount => {
            res.status(201).json(newBankAccount)
        })
        .catch(next)

    }

    static update(req, res, next) {
        const { bankCode, accountNumber, accountHolderName } = req.body

        BankAccount.findByIdAndUpdate(
            { _id: req.params.id},
            { bankCode, accountNumber, accountHolderName },
            { new: true }
        )
        .then(bankAccount => {
            if (bankAccount) res.status(200).json(bankAccount)
            else {
                next({ status: 404 , message: `data not found`})
            }
        })
        .catch(next)
    }
}

module.exports = BankAccountController
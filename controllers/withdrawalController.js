const Withdrawal = require("../models/withdrawal")
const BankAccount = require("../models/bankAccount")
const User = require("../models/user")
const start = require("../helpers/transaction")

class WithdrawalController {
    static create(req, res, next) {
        let bank
        // is bank belong to user?
        BankAccount.findById(req.body.bankAccountId)
            .then(foundedBank => {
                if (foundedBank && foundedBank.userId == req.body.userId) {
                    bank = foundedBank
                    // is balance enough
                    return User.findById(req.body.userId)
                } else {
                    throw {
                        message: `unauthorized`
                    }
                }
            })
            .then(user => {
                if (user) {
                    if (user.balance && user.balance[bank.currency] >= req.body.amount) {
                        // is time valid
                        if (user.lastWithdrawal.toISOString().split('T')[0] !== new Date().toISOString().split('T')[0]) {
                            // transaction begin
                            start(req, res, user, bank)

                        } else {
                            throw {
                                message: `only once a day withdrawal allowed`
                            }
                        }
                    } else {
                        throw {
                            message: `balance is less than amount`
                        }
                    }
                }
            })
            .catch(next)
    }

    static history(req, res, next) { 
        Withdrawal.find({
            userId: req.params.userId
        })
            .then(withdrawals => {
                res.status(200).json(withdrawals)
            })
            .catch(next)
    }
}

module.exports = WithdrawalController
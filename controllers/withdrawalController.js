const Withdrawal = require("../models/withdrawal")
const BankAccount = require("../models/bankAccount")
const User = require("../models/user")
const { use } = require("../routes")

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
                                let newBalance = user.balance 
                                newBalance[bank.currency] -= +req.body.amount

                                return User.updateOne(
                                    { _id: user._id },
                                    {
                                        $set: {
                                            balance : newBalance,
                                            lastWithdrawal: new Date()
                                        }
                                    }
                                )
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
            .then(() => {
                return Withdrawal.create({
                    userId: req.body.userId,
                    bankId: req.body.bankAccountId,
                    amount: +req.body.amount,
                    status: 'finish',
                    timestamps: new Date()
                })
            })
            .then(withdrawal => {
                res.status(201).json(withdrawal)
            })
            .catch(next)
    }

    static history(req, res, next) {
        BankAccount.find()
    }
}

module.exports = WithdrawalController
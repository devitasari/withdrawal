const Withdrawal = require("../models/withdrawal")
const BankAccount = require("../models/bankAccount")
const User = require("../models/user")
const start = require("./transaction")

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
                                        balance: newBalance,
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

    static async createTransaction(req, res, next) {
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

                            // transaction begin
                            start(req, newBalance, user, res)
                            
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
        let result = []
        let withdrawData
        Withdrawal.find({
            userId: req.params.userId
        })
            .then(withdrawals => {
                withdrawData = withdrawals
                return BankAccount.find({
                    userId: req.params.userId
                })
            })
            .then(bank => {
                for (let i = 0; i < withdrawData.length; i++) {
                    for (let j = 0; j < bank.length; j++) {
                        if (withdrawData[i].bankId == bank[j]._id) {
                            let el = {
                                _id: withdrawData[i]._id,
                                amount: withdrawData[i].amount,
                                timestamps: withdrawData[i].timestamps,
                                bankDetail: bank[j]
                            }
                            result.push(el)
                            break
                        }
                    }
                }
                res.status(200).json(result)
            })
            .catch(next)
    }
}

module.exports = WithdrawalController
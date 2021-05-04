const Withdrawal = require("../models/withdrawal")
const BankAccount = require("../models/bankAccount")
const User = require("../models/user")

class WithdrawalController {
    static create(req, res, next) {
        let bank
        // is bank belong to user?
        BankAccount.findById(req.body.bankAccountId)
            .then(foundedBank => {
                console.log(`foundedBank: `, foundedBank)
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
                console.log(`user:`, user)
                if (user) {
                    for (let i = 0; i < user.balances.length; i++) {
                        if (user.balances[i].currency === bank.currency && user.balances[i].amount >= req.body.amount) {
                            // is time valid
                            if (user.lastWithdrawal.toISOString().split('T')[0] !== new Date().toISOString().split('T')[0]) {
                                user.lastWithdrawal = new Date()
                                user.save()
                                return User.updateOne(
                                    { _id: user._id, balances: user.balances[i] },
                                    {
                                        $set: {
                                            "balances.$": {
                                                currency: user.balances[i].currency,
                                                amount: user.balances[i].amount - Number(req.body.amount)
                                            }
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
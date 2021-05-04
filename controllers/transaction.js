const Transaction = require("mongoose-transactions")
const transaction = new Transaction()

const Withdrawal = require("../models/withdrawal")

async function start(req, newBalance, user, res) {
    try {
        const idNewWithdrawal = transaction.insert(`Withdrawal`, {
            userId: req.body.userId,
            bankId: req.body.bankAccountId,
            amount: +req.body.amount,
            status: 'finish',
            timestamps: new Date()
        })
        transaction.update(`User`, req.body.userId, {
            lastWithdrawal: new Date(),
            balance: newBalance,
            bussinesName: user.bussinesName,
            email: user.email
        })
        const final = await transaction.run()
        Withdrawal.findById(idNewWithdrawal)
        .then(data => {
            res.status(201).json(data)
        })
    } catch(err) {
        const rollbackObj = await transaction.rollback().catch(console.log)
        transaction.clean()
        throw {
            message: err
        }
    }
}

module.exports = start
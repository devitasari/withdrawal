const Transaction = require("mongoose-transactions")
const transaction = new Transaction()
const Withdrawal = require("../models/withdrawal")

async function start(req, res, user, bank) {
    try {
        let newBalance = user.balance
        newBalance[bank.currency] -= +req.body.amount

        const idNewWithdrawal = transaction.insert(`Withdrawal`, {
            userId: req.body.userId,
            bankDetail: bank,
            amount: +req.body.amount,
            status: `finish`,
            createdAt: new Date()
        })

        transaction.update(`User`, user._id, {
            lastWithdrawal: new Date(),
            balance: newBalance,
            bussinesName: user.bussinesName,
            email: user.email
        })

        const final = await transaction.run()

        Withdrawal.findById(idNewWithdrawal)
        .then(data => {
            res.status(200).json(data)
        })

    } catch (err) {
        const rollbackObj = await transaction.rollback().catch(console.log)
        transaction.clean()
        throw new Error(err)
    }
}

module.exports = start
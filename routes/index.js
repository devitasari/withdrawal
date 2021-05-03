const express = require("express")
const router = express.Router()
const bankAccountsRoutes = require("./bankAccounts")
const withdrawalsRoutes = require("./withdrawals")

router.use("/bank-accounts", bankAccountsRoutes)
router.use("/withdrawals", withdrawalsRoutes)

module.exports = router
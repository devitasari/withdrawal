const express = require("express")
const router = express.Router()
const bankAccountsRoutes = require("./bankAccount")
const withdrawalsRoutes = require("./withdrawal")

router.use("/bank-accounts", bankAccountsRoutes)
router.use("/withdrawals", withdrawalsRoutes)

module.exports = router
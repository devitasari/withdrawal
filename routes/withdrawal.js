const express = require("express")
const WithdrawalController = require("../controllers/withdrawalController")
const start = require("../controllers/transaction")

const router = express.Router()

// router.post("/", WithdrawalController.create)
router.post("/", WithdrawalController.createTransaction)
router.get("/:userId", WithdrawalController.history)

module.exports = router
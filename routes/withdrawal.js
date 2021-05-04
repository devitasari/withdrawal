const express = require("express")
const WithdrawalController = require("../controllers/withdrawalController")

const router = express.Router()

router.post("/", WithdrawalController.create)
router.get("/:userId", WithdrawalController.history)

module.exports = router
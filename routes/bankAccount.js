const express = require("express")
const BankAccountController = require("../controllers/bankAccountController")

const router = express.Router()

router.post("/", BankAccountController.register)
router.patch("/:id", BankAccountController.update)

module.exports = router
const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../app")
const BankAccounts = require("../models/bankAccounts")
const { ObjectId } = require('mongodb');

const userId = ObjectId("60900e6d6c5acb11e5122b99")
const invalidUserId = Object("60900e6d6c5acb11e5122b90")

chai.use(chaiHttp)
const expect = chai.expect

after(done => {
    BankAccounts.deleteMany()
    .then(() => {
        console.log(`testing: delete all bank accounts succes!`)
    })
    .catch((err) => {
        console.log(`error: ${err}`)
    })
    .finally(() => {
        done()
    })
})

describe(`bank accounts routes`, () => {
    
})


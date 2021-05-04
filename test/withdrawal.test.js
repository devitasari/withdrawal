const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../app")
const withdrawals = require("../models/withdrawal")
const BankAccounts = require("../models/bankAccount")

const userId = "60900e6d6c5acb11e5122b99"
const invalidUserId = "60900e6d6c5acb11e5122b90"
let bankId 
const invalidBankId = "1234567890"

chai.use(chaiHttp)
const expect = chai.expect

before(done => {
    BankAccounts.create({
        bankCode: `BNI`,
        accountNumber: `1234567890`,
        accountHolderName: `Putri`,
        currency: `IDR`,
        userId
    })
    .then(bankAccount => {
        console.log(`testing: success create bank account for withdrawal test`)
        bankId = bankAccount._id
    })
    .catch(err => {
        console.log(err)
    })
})

describe(`withdrawal routes`, () => {
    describe(`POST /withdrawals`, () => {
        describe(`success process`, () => {
            it(`should send an object (new withdrawal) with status code 201`, (done) => {
                chai.request(app)
                .post(`/withdrawals`)
                .send({
                    amount: 300000,
                    bankAccountId: bankId, 
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`_id`, `amount`, `bankId`,  `bankCode`, `accountNumber`, `accountHolderName`,`currency`, `status`)
                })
            })
        })
        describe(`error process`, () => {
            it(`should send error with status code 400 if balance is less than amount`, (done) => {
                chai.request(app)
                .post(`/withdrawal`)
                .send({
                    amount: 2000000,
                    bankAccountId: bankId,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`messages`)
                })
            })
            it(`should send error with status code 400 if withdraw more than onec a day`, (done) => {
                chai.request(app)
                .post(`/withdrawal`)
                .send({
                    amount: 200000,
                    bankAccountId: bankId,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`messages`)
                })
            })
        })
    })
    describe(`GET /withdrawal`, () => {
        describe(`success process`, () => {
            it(`should send array of object withdrawal history with status code 200`, () => {
                chai.request(app)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an(`object`)
                })
            })
        })
    })
})
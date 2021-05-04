const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../app")
const BankAccounts = require("../models/bankAccount")

const userId = "60900e6d6c5acb11e5122b99"
const invalidUserId = "60900e6d6c5acb11e5122b90"
let bankId 
const invalidBankId = "1234567890"

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
    describe(`POST /bank-accounts`, () => {
        describe(`success process`, () => {
            it(`should send an object (new bank account) with status code 201`, (done) => {
                chai.request(app)
                .post(`/bank-accounts`)
                .send({
                    bankCode: `BNI`,
                    accountNumber: `1234567890`,
                    accountHolderName: `Putri`,
                    currency: `IDR`,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`_id`, `bankCode`, `accountNumber`, `accountHolderName`,`currency`)
                })
            })
        })
        describe(`error process`, () => {
            it(`should send error with status code 422 if account number less than 10 chars`, (done) => {
                chai.request(app)
                .post(`/bank-accounts`)
                .send({
                    bankCode: `BNI`,
                    accountNumber: `123456789`,
                    accountHolderName: `Putri`,
                    currency: `IDR`,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(422)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`messages`)
                })
            })
            it(`should send error with status code 422 if account holder name less than 3 chars`, (done) => {
                chai.request(app)
                .post(`/bank-accounts`)
                .send({
                    bankCode: `BNI`,
                    accountNumber: `1234567890`,
                    accountHolderName: `Pu`,
                    currency: `IDR`,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(422)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`messages`)
                })
            })
            it(`should send error with status code 422 if currency is duplicate`, (done) => {
                chai.request(app)
                .post(`/bank-accounts`)
                .send({
                    bankCode: `BNI`,
                    accountNumber: `1234567891`,
                    accountHolderName: `Putri`,
                    currency: `IDR`,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(422)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`messages`)
                })            
            })
        })
    })
    describe(`PATCH /bank-accounts/:id`, () => {
        describe(`succes process`, () => {
            it(`should send an object bank account with particular id with status code 200`, (done) => {
                chai.request(app)
                .patch(`/bank-accounts/${bankId}`)
                .send({
                    bankCode: `BRI`,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`_id`, `bankCode`, `accountNumber`, `accountHolderName`, `currency`)
                })
            })
        })
        describe(`error process`, () => {
            it(`should send error with status code 404 if id not found`, (done) => {
                chai.request(app)
                .patch(`/bank-accounts/${invalidBankId}`)
                .send({
                    bankCode: `BRI`,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`messages`)
                })
            })
        })
    })
})


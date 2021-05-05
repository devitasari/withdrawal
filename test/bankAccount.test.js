const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../app")
const BankAccount = require("../models/bankAccount")
const User = require("../models/user")

let userId, bankId
const invalidBankId = "1234567890"

chai.use(chaiHttp)
const expect = chai.expect

before(function (done) {
    User.create({
        bussinesName: `test`,
        email: `test@mail.com`,
        lastWithdrawal: new Date(),
        balance: {
            IDR : 1000000
        }
    })
    .then(user => {
        userId = user._id
        done()
    })
    .catch(console.log)
})

after(function (done) {
    BankAccount.deleteMany()
        .then(() => {
            console.log(`testing: delete all bank accounts succes!`)
            return User.deleteMany()
        })
        .then(() => {
            console.log(`testing: delete all users succes!`)
            done()
        })
        .catch(console.log)
})

describe(`BANK ACCOUNT ROUTES`, () => {
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
                        bankId = res.body._id
                        expect(err).to.be.null
                        expect(res).to.have.status(201)
                        expect(res.body).to.be.an(`object`).to.have.any.keys(`_id`, `bankCode`, `accountNumber`, `accountHolderName`,`currency`, `userId`)
                        expect(res.body.bankCode).to.equal(`BNI`)
                        expect(res.body.accountNumber).to.equal(`1234567890`)
                        expect(res.body.accountHolderName).to.equal(`Putri`)
                        expect(res.body.currency).to.equal(`IDR`)
                        done()
                    })
            })
        })
        describe(`error process`, () => {
            it(`should send error with status code 422 if bank code is empty`, (done) => {
                chai.request(app)
                .post(`/bank-accounts`)
                .send({
                    accountNumber: `1234567890`,
                    accountHolderName: `Putri`,
                    currency: `IDR`,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(422)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`messages`)
                    expect(res.body.messages[0]).to.equal(`bank code can't be empty`)
                    done()
                })
            })
            it(`should send error with status code 422 if account number is empty`, (done) => {
                chai.request(app)
                .post(`/bank-accounts`)
                .send({
                    bankCode: `BNI`,
                    accountHolderName: `Putri`,
                    currency: `IDR`,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(422)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`messages`)
                    expect(res.body.messages[0]).to.equal(`account number can't be empty`)
                    done()
                })
            })
            it(`should send error with status code 422 if account holder name is empty`, (done) => {
                chai.request(app)
                .post(`/bank-accounts`)
                .send({
                    accountNumber: `1234567890`,
                    bankCode: `BNI`,
                    currency: `IDR`,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(422)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`messages`)
                    expect(res.body.messages[0]).to.equal(`account holder name can't be empty`)
                    done()
                })
            })
            it(`should send error with status code 422 if currency is empty`, (done) => {
                chai.request(app)
                .post(`/bank-accounts`)
                .send({
                    accountNumber: `1234567890`,
                    accountHolderName: `Putri`,
                    bankCode: `BNI`,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(422)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`messages`)
                    expect(res.body.messages[0]).to.equal(`currency can't be empty`)
                    done()
                })
            })
            it(`should send error with status code 422 if user id is empty`, (done) => {
                chai.request(app)
                .post(`/bank-accounts`)
                .send({
                    accountNumber: `1234567890`,
                    accountHolderName: `Putri`,
                    bankCode: `BNI`,
                    currency: `IDR`,
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(422)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`messages`)
                    expect(res.body.messages[0]).to.equal(`user id can't be empty`)
                    done()
                })
            })
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
                    expect(res.body.messages[0]).to.equal(`account number minimal 10 chars`)
                    done()
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
                    expect(res.body.messages[0]).to.equal(`account holder name minimal 3 chars`)
                    done()
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
                    expect(res.body.messages[0]).to.equal(`currency is duplicate`)
                    done()
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
                    accountNumber: `1234567890`,
                    accountHolderName: `Sari`,
                    currency: `IDR`,
                    userId
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`_id`, `bankCode`, `accountNumber`, `accountHolderName`, `currency`)
                    expect(res.body.bankCode).to.equal(`BRI`)
                    expect(res.body.accountNumber).to.equal(`1234567890`)
                    expect(res.body.accountHolderName).to.equal(`Sari`)
                    expect(res.body.currency).to.equal(`IDR`)
                    done()
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
                    expect(res).to.have.status(404)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`messages`)
                    expect(res.body.messages[0]).to.equal(`data not found`)
                    done()
                })
            })
        })
    })
})


const chai = require("chai")
const chaiHttp = require("chai-http")
const app = require("../app")
const BankAccount = require("../models/bankAccount")
const User = require("../models/user")
const Withdrawal = require("../models/withdrawal")

let bankId1, bankId2, userId1, userId2

chai.use(chaiHttp)
const expect = chai.expect

before(done => {
    User.create({
        bussinesName: `test`,
        email: `test@mail.com`,
        balance: {
            IDR : 1000000
        }
    })
    .then(user => {
        userId1 = user._id
        return User.create({
            bussinesName: `test2`,
            email: `test2@mail.com`,
            balance: {
                IDR : 1000000
            }
        })
    })
    .then(user => {
        userId2 = user._id
        return BankAccount.create({
            bankCode: `BNI`,
            accountNumber: `1234567890`,
            accountHolderName: `Putri`,
            currency: `IDR`,
            userId: userId1
        })
    })
    .then(bankAccount => {
        bankId1 = bankAccount._id
        return BankAccount.create({
            bankCode: `BRI`,
            accountNumber: `1234567891`,
            accountHolderName: `Putra`,
            currency: `IDR`,
            userId: userId2
        })

    })
    .then(bankAccount => {
        bankId2 = bankAccount._id
        done()
    })
    .catch(console.log)
})

after(done => {
    Withdrawal.deleteMany()
    .then(() => {
        return BankAccount.deleteMany()
    })
    .then(() => {
        return User.deleteMany()
    })
    .then(() => {
        done()
    })
    .catch(console.log)
})

describe(`WITHDRAWAL ROUTES`, () => {
    describe(`POST /withdrawals`, () => {
        describe(`success process`, () => {
            it(`should send an object (new withdrawal) with status code 201`, (done) => {
                chai.request(app)
                .post(`/withdrawals`)
                .send({
                    amount: 100000,
                    bankAccountId: bankId1, 
                    userId: userId1
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.an(`object`).to.have.any.keys(`_id`, `userId`, `amount`, `bankDetail`, `status`, `createdAt`)
                    expect(res.body.amount).to.equal(100000)
                    expect(res.body.bankDetail).to.be.an(`object`).to.have.any.keys(`_id`, `bankCode`, `accountNumber`, `accountHolderName`, `currency`, `userId`)
                    expect(res.body.status).to.equal(`finish`)
                    done()
                })
            })
        })
        describe(`error process`, () => {
            it(`should send error with status code 401 if bank id is invalid`, (done) => {
                chai.request(app)
                .post(`/withdrawals`)
                .send({
                    amount: 100000,
                    bankAccountId: bankId1,
                    userId: userId2                  
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    expect(res.body).to.have.any.keys(`messages`)
                    expect(Array.isArray(res.body.messages)).to.equal(true)
                    expect(res.body.messages[0]).to.equal(`unauthorized`)
                    done()
                })
            })
            it(`should send error with status code 400 if balance is less than amount`, (done) => {
                chai.request(app)
                .post(`/withdrawals`)
                .send({
                    amount: 2000000,
                    bankAccountId: bankId1,
                    userId: userId1
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.have.any.keys(`messages`)
                    expect(Array.isArray(res.body.messages)).to.equal(true)
                    expect(res.body.messages[0]).to.equal(`balance is less than amount`)
                    done()
                })
            })
            it(`should send error with status code 400 if withdraw more than once a day`, (done) => {
                chai.request(app)
                .post(`/withdrawals`)
                .send({
                    amount: 200000,
                    bankAccountId: bankId1,
                    userId: userId1
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.have.any.keys(`messages`)
                    expect(Array.isArray(res.body.messages)).to.equal(true)
                    expect(res.body.messages[0]).to.equal(`only once a day withdrawal allowed`)
                    done()
                })
            })
        })
    })
    describe(`GET /withdrawal`, () => {
        describe(`success process`, () => {
            it(`should send array of object withdrawal history with status code 200`, (done) => {
                chai.request(app)
                .get(`/withdrawals/${userId1}`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(Array.isArray(res.body)).to.equal(true)
                    done()
                })
            })
        })
    })
})
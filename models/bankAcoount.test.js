// const chai = require("chai")
// const sinon = require("sinon")
// const BankAccount = require("./bankAccount")
// const expect = chai.expect

// after((done) => {
//     BankAccount.deleteMany()
//         .then(() => {
//             done()
//         })
//         .catch(console.log)
// })

// describe(`Bank Account Model`, () => {
//     const stubValue = {
//         userId: `60916112e6ac7b74b6829ca7`,
//         bankCode: `BPI`,
//         accountNumber: `1234567890`,
//         accountHolderName: `Putri`,
//         currency: `PHP`,
//         _id: `anyid`
//     }
//     const input = {
//         userId: `60916112e6ac7b74b6829ca7`,
//         bankCode: `BPI`,
//         accountNumber: `1234567890`,
//         accountHolderName: `Putri`,
//         currency: `PHP`,
//     }
//     describe(`Create bank account`, () => {
//         it(`should create new bank account`, async () => {
//             const stub = sinon.stub(BankAccount, "create").returns(stubValue);
//             const bank = BankAccount.create(input)
//             expect(stub.calledOnce).to.be.true;
//             expect(bank._id).to.equal(stubValue._id)
//             expect(bank.bankCode).to.equal(stubValue.bankCode)
//             expect(bank.accountNumber).to.equal(stubValue.accountNumber)
//             expect(bank.accountHolderName).to.equal(stubValue.accountHolderName)
//             expect(bank.currency).to.equal(stubValue.currency)
//         })
//     })
// })
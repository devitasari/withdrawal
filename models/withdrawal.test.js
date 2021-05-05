// const chai = require("chai")
// const sinon = require("sinon")
// const Withdrawal = require("./withdrawal")
// const expect = chai.expect

// after((done) => {
//     Withdrawal.deleteMany()
//         .then(() => {
//             done()
//         })
//         .catch(console.log)
// })

// describe(`Withdrawal Model`, () => {
//     const stubValue = {
//         amount: 100000,
//         bankAccountId: `anyBankId`, 
//         userId: `anyUserId`,
//         _id: `anyId`,
//         bankDetail: {}
//     }
//     const input = {
//         amount: 100000,
//         bankAccountId: `anyBankId`, 
//         userId: `anyUserId`
//     }
//     describe(`Create withdrawal`, () => {
//         it(`should create new bank account`, async () => {
//             const stub = sinon.stub(Withdrawal, "create").returns(stubValue);
//             const withdrawal = Withdrawal.create(input)
//             expect(stub.calledOnce).to.be.true;
//             expect(withdrawal._id).to.equal(stubValue._id)
//             expect(withdrawal.amount).to.equal(stubValue.amount)
//             expect(withdrawal.bankAccountId).to.equal(stubValue.bankAccountId)
//             expect(withdrawal.userId).to.equal(stubValue.userId)
//         })
//     })
// })
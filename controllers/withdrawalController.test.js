const chai = require("chai")
const sinon = require("sinon")
const WithdrawalController = require("./withdrawalController")
const expect = chai.expect

describe(`Withdrawal Controller`, () => {
    let status, json, res

    beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

    describe(`Create withdrawal`, () => {
        it(`should call create`, async () => {
            const req = {
                body: {
                    userId: `60916112e6ac7b74b6829ca7`,
                    bankCode: `BNI`,
                    accountNumber: `1234567890`,
                    accountHolderName: `Putri`,
                    currency: `IDR`,
                }
            }

            const stubValue = {
                userId: `60916112e6ac7b74b6829ca7`,
                bankCode: `BNI`,
                accountNumber: `1234567890`,
                accountHolderName: `Putri`,
                currency: `IDR`,
                _id: `anyid`
            }

            const stub = sinon.stub(WithdrawalController, "create").returns(stubValue);
            expect(stub.calledOnce).to.be.false
            await WithdrawalController.create(req, res)
            expect(stub.calledOnce).to.be.true
        })
    })
    describe(`Withdrawal history`, () => {
        it(`should call history`, async () => {
            const req = {
                body: {
                    userId: `60916112e6ac7b74b6829ca7`,
                    bankCode: `BRI`,
                    accountNumber: `1234567890`,
                    accountHolderName: `Putri`,
                }
            }

            const stubValue = {
                userId: `60916112e6ac7b74b6829ca7`,
                bankCode: `BRI`,
                accountNumber: `1234567890`,
                accountHolderName: `Putri`,
                currency: `IDR`,
                _id: `anyid`
            }

            const stub = sinon.stub(WithdrawalController, "history").returns(stubValue);
            expect(stub.calledOnce).to.be.false
            await WithdrawalController.history(req, res)
            expect(stub.calledOnce).to.be.true
        })
    })
})
const chai = require("chai")
const sinon = require("sinon")
const BankAccountController = require("./bankAccountController")
const expect = chai.expect

describe(`Bank Account Controller`, () => {
    let status, json, res

    beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

    describe(`Create bank account`, () => {
        it(`should call register`, async () => {
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

            const stub = sinon.stub(BankAccountController, "register").returns(stubValue);
            expect(stub.calledOnce).to.be.false
            await BankAccountController.register(req, res)
            expect(stub.calledOnce).to.be.true
        })
    })
    describe(`Update bank account`, () => {
        it(`should call update`, async () => {
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

            const stub = sinon.stub(BankAccountController, "update").returns(stubValue);
            expect(stub.calledOnce).to.be.false
            await BankAccountController.update(req, res)
            expect(stub.calledOnce).to.be.true
        })
    })
})
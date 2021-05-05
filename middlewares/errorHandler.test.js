const errorHandler = require("./errorHandler")
const chai = require("chai")
const sinon = require("sinon")
const expect = chai.expect

describe(`Middleware Error Handler`, () => {
    let status, json, res

    beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

    it(`should call the errorHandler`, () => {
        
    })
})




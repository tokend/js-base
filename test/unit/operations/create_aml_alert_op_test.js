import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";
import isEqual from 'lodash/isEqual';

describe('Create AML alert request', function () {
    it("Success", function () {
        let opt = {
            balanceID: StellarBase.Keypair.random().balanceId(),
            amount: "1002",
            reason: "Because we can",
            reference: "Some random reference",
        }
        let op = StellarBase.CreateAMLRequestBuilder.createAMLAlert(opt);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.createAmlAlert().name);
        expect(obj.balanceID).to.be.equal(opt.balanceID);
        expect(obj.amount).to.be.equal(opt.amount);
        expect(obj.reason).to.be.equal(opt.reason);
        expect(obj.reference).to.be.equal(opt.reference);
    });
});
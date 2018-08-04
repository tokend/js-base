import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";
import isEqual from 'lodash/isEqual';

describe('Check sale state op', function () {
    it("Success", function () {
        let opt = {
            saleID: "123",
        }
        let op = StellarBase.SaleRequestBuilder.checkSaleState(opt);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.checkSaleState().name);
        expect(obj.saleID).to.be.equal(opt.saleID);
    });
});
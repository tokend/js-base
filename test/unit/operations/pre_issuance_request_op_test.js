import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";

describe('PreIssuance request op', function () {
    it("Success", function () {
        let amount = "200.123";
        let reference = "test";
        let asset = "BLC";
        let keyPair = StellarBase.Keypair.random();
        var preIssuanceRequest = StellarBase.PreIssuanceRequest.build({
            amount,
            reference,
            asset,
            keyPair
        });
        let op = StellarBase.PreIssuanceRequestOpBuilder.createPreIssuanceRequestOp({request: preIssuanceRequest});
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("createPreissuanceRequest");
        expect(reference).to.be.equal(obj.request.reference);
        expect(amount).to.be.equal(obj.request.amount);
        expect(asset).to.be.equal(obj.request.asset);
        expect(preIssuanceRequest.signature().toXDR('hex')).to.be.equal(obj.request.signature.toXDR('hex'));
    });
});
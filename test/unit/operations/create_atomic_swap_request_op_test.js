import { Hyper } from "js-xdr";

describe('Create ASwapBidCreation request', function () {
    it("Success", function () {
        let opts = {
            baseAmount: "911",
            bidID: "69",
            quoteAsset: "ETH",
        };
        let op = StellarBase.CreateAtomicSwapRequestBuilder.createASwapRequest(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.createAswapRequest().name);
        expect(obj.baseAmount).to.be.equal(opts.baseAmount);
        expect(obj.bidID).to.be.equal(opts.bidID);
        expect(obj.quoteAsset).to.be.equal(opts.quoteAsset);
    });
});
describe("cancel atomic swap bid ", function () {
    it("Success", function () {
        let bidID = "1408";
        let op = StellarBase.CancelAtomicSwapBidBuilder.cancelASwapBid({
            bidID
        });
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("cancelAswapBid");
        expect(obj.bidID).to.be.equal(bidID);
    });
});
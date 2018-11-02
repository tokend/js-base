import isEqual from "lodash/isEqual";

describe('Perform settlement op', function () {
    it("Success ", function () {
        let opts = {
            investmentTokenSaleID: "6451",
            newInvestmentToken: "FASHION1TOKEN",
            settlementAssets: [
                {
                    price: "12.21",
                    code: "ETH",
                },
                {
                    price: "21.12",
                    code: "USD",
                },
            ],
        };
        let op = StellarBase.PerformSettlementBuilder.performSettlement(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.performSettlement().name);
        expect(opts.investmentTokenSaleID).to.be.equal(obj.investmentTokenSaleID);
        expect(opts.newInvestmentToken).to.be.equal(obj.newInvestmentToken);
        expect(isEqual(opts.settlementAssets, obj.settlementAssets)).to.be.true;
    });
});
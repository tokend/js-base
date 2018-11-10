import isEqual from "lodash/isEqual";

describe('Manage ITSale Creation request op', function () {
    it("Success create", function () {
        let opts = {
            baseAsset: "BTC",
            amountToBeSold: "4321",
            tradingStartDate: "412342",
            settlementStartDate: "520000",
            settlementEndDate: "648251",
            defaultRedemptionAsset: "XRP",
            details: {
                short_description: "short description",
                description: "Token sale description",
                logo: "logo",
                name: "sale name",
            },
            quoteAssets: [
                {
                    price: "12.21",
                    asset: "ETH",
                },
                {
                    price: "21.12",
                    asset: "USD",
                },
            ],
            isProlongationAllowed: false
        };
        let op = StellarBase.ManageInvestmentTokenSaleCreationRequestBuilder
            .createITSaleCreationRequest(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.manageInvestmentTokenSaleCreationRequest().name);
        expect(opts.baseAsset).to.be.equal(obj.baseAsset);
        expect(opts.requestID).to.be.equal(obj.requestID);
        expect(opts.amountToBeSold).to.be.equal(obj.amountToBeSold);
        expect(opts.tradingStartDate).to.be.equal(obj.tradingStartDate);
        expect(opts.settlementStartDate).to.be.equal(obj.settlementStartDate);
        expect(opts.settlementEndDate).to.be.equal(obj.settlementEndDate);
        expect(opts.defaultRedemptionAsset).to.be.equal(obj.defaultRedemptionAsset);
        expect(opts.isProlongationAllowed).to.be.equal(obj.isProlongationAllowed);
        expect(isEqual(opts.quoteAssets, obj.quoteAssets)).to.be.true;
        expect(isEqual(opts.details, obj.details)).to.be.true;
    });
    it("Success update", function () {
        let opts = {
            requestID: "12345678",
            baseAsset: "BTC",
            amountToBeSold: "4321",
            tradingStartDate: "4123425",
            settlementStartDate: "520000",
            settlementEndDate: "648251",
            defaultRedemptionAsset: "XRP",
            details: {
                short_description: "short description",
                description: "Token sale description",
                logo: "logo",
                name: "sale name",
            },
            quoteAssets: [
                {
                    price: "12.21",
                    asset: "ETH",
                },
                {
                    price: "21.12",
                    asset: "USD",
                },
            ],
        };
        let op = StellarBase.ManageInvestmentTokenSaleCreationRequestBuilder
            .updateITSaleCreationRequest(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.manageInvestmentTokenSaleCreationRequest().name);
        expect(opts.baseAsset).to.be.equal(obj.baseAsset);
        expect(opts.amountToBeSold).to.be.equal(obj.amountToBeSold);
        expect(opts.tradingStartDate).to.be.equal(obj.tradingStartDate);
        expect(opts.settlementStartDate).to.be.equal(obj.settlementStartDate);
        expect(opts.settlementEndDate).to.be.equal(obj.settlementEndDate);
        expect(opts.defaultRedemptionAsset).to.be.equal(obj.defaultRedemptionAsset);
        expect(isEqual(opts.quoteAssets, obj.quoteAssets)).to.be.true;
        expect(isEqual(opts.details, obj.details)).to.be.true;
    });
    it("Success cancel", function () {
        let opts = {
            requestID: "2468",
        };
        let op = StellarBase.ManageInvestmentTokenSaleCreationRequestBuilder
            .cancelITSaleCreationRequest(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.manageInvestmentTokenSaleCreationRequest().name);
        expect(opts.requestID).to.be.equal(obj.requestID);
    });
});
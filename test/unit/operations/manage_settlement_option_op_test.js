import {Keypair} from "../../../src/keypair";

describe('Manage settlement option op', function () {
    it("Success create prolong", function () {
        let opts = {
            investmentTokenSaleID: "6451",
        };
        let op = StellarBase.ManageSettlementOptionBuilder.createProlongationSettlementOption(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.manageSettlementOption().name);
        expect(opts.investmentTokenSaleID).to.be.equal(obj.investmentTokenSaleID);
    });
    it("Success create redeem", function () {
        let opts = {
            investmentTokenSaleID: "6451",
            redemptionAsset: "USD"
        };
        let op = StellarBase.ManageSettlementOptionBuilder.createRedemptionSettlementOption(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.manageSettlementOption().name);
        expect(opts.investmentTokenSaleID).to.be.equal(obj.investmentTokenSaleID);
        expect(opts.redemptionAsset).to.be.equal(obj.redemptionAsset);
    });
    it("Success remove", function () {
        let opts = {
            settlementOptionID: "6451",
        };
        let op = StellarBase.ManageSettlementOptionBuilder.removeSettlementOption(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.manageSettlementOption().name);
        expect(opts.settlementOptionID).to.be.equal(obj.settlementOptionID);
    });
});
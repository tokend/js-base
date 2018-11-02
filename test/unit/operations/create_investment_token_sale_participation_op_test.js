import {Keypair} from "../../../src/keypair";

describe('Create ITSale Participation op', function () {
    it("Success create", function () {
        let opts = {
            quoteBalance: Keypair.random().balanceId(),
            baseAmount: "5200",
            investmentTokenSaleID: "6451",
        };
        let op = StellarBase.CreateInvestmentTokenSaleParticipationBuilder
            .createITSaleParticipation(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.createInvestmentTokenSaleParticipation().name);
        expect(opts.baseAmount).to.be.equal(obj.baseAmount);
        expect(opts.investmentTokenSaleID).to.be.equal(obj.investmentTokenSaleID);
        expect(opts.quoteBalance).to.be.equal(obj.quoteBalance);
    });
});
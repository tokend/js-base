import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";
import isEqual from 'lodash/isEqual'

describe(".payout()", function () {
    it("Success", function () {
        let opts = {};
        opts.asset = "USD";
        opts.sourceBalanceId = StellarBase.Keypair.random().balanceId();
        opts.maxPayoutAmount = "1000";
        opts.minPayoutAmount = "10";
        opts.minAssetHolderAmount = "1";
        opts.fee = {
            fixed: "15",
            percent: "5"
        };

        let operation = StellarBase.PayoutOpBuilder.payoutOp(opts);
        let xdr = operation.toXDR("hex");
        let op = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(op);

        expect(obj.type).to.be.equal("payout");
        expect(obj.asset).to.be.equal(opts.asset);
        expect(obj.sourceBalanceId).to.be.equal(opts.sourceBalanceId);
        expect(obj.maxPayoutAmount).to.be.equal(opts.maxPayoutAmount);
        expect(obj.minPayoutAmount).to.be.equal(opts.minPayoutAmount);
        expect(obj.minAssetHolderAmount).to.be.equal(opts.minAssetHolderAmount);
        expect(obj.fee.fixed).to.be.equal(opts.fee.fixed);
        expect(obj.fee.percent).to.be.equal(opts.fee.percent);
    });
});
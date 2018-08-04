import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";
import isEqual from "lodash/isEqual";

describe('Withdraw request op', function () {
    it("Success", function () {
        let amount = "1200.12";
        let fee = {
            fixed: "12.11",
            percent: "0.5"
        };
        let balance = StellarBase.Keypair.random().balanceId();
        let externalDetails = {a: "some details"};
        let destAsset = "USD";
        let expectedDestAssetAmount= "33333.12";
        let op = StellarBase.CreateWithdrawRequestBuilder.createWithdrawWithAutoConversion({
            balance: balance,
            amount: amount,
            fee: fee,
            externalDetails: externalDetails,
            destAsset: destAsset,
            expectedDestAssetAmount: expectedDestAssetAmount,
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
                expect(obj.type).to.be.equal("createWithdrawalRequest");
        expect(balance).to.be.equal(obj.balance);
        expect(amount).to.be.equal(obj.amount);
        expect(fee.fixed).to.be.equal(obj.fee.fixed);
        expect(fee.percent).to.be.equal(obj.fee.percent);
        expect(isEqual(externalDetails, obj.externalDetails)).to.be.true;
        expect(StellarBase.xdr.WithdrawalType.autoConversion()).to.be.equal(obj.details.type);
        expect(destAsset).to.be.equal(obj.details.autoConversion.destAsset);
        expect(expectedDestAssetAmount).to.be.equal(obj.details.autoConversion.expectedAmount);
    });
});
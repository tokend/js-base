import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";
import isEqual from "lodash/isEqual";

describe('Manage offer op', function () {
    it("Success", function () {
        var baseBalance = StellarBase.Keypair.random().balanceId();
            var quoteBalance = StellarBase.Keypair.random().balanceId();
            var amount = "1000";
            var price = "12.5";
            var fee = "0.01";
            var isBuy = true;
            var offerID = "0";
            var orderBookID = "123";
            let op = StellarBase.ManageOfferBuilder.manageOffer({
                baseBalance, quoteBalance,
                amount, price, isBuy, offerID, fee, orderBookID
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.manageOffer().name);
            expect(obj.baseBalance).to.be.equal(baseBalance);
            expect(obj.quoteBalance).to.be.equal(quoteBalance);
            expect(obj.amount).to.be.equal(amount);
            expect(obj.price).to.be.equal(price);
            expect(obj.fee).to.be.equal(fee);
            expect(obj.offerID).to.be.equal(offerID);
            expect(obj.isBuy).to.be.equal(isBuy);
            expect(obj.orderBookID).to.be.equal(orderBookID);
    });
    it("Cancel offer", function() {
        var baseBalance = StellarBase.Keypair.random().balanceId();
            var quoteBalance = StellarBase.Keypair.random().balanceId();
            var offerID = "321";
            var orderBookID = "123";
            let op = StellarBase.ManageOfferBuilder.cancelOffer({
                baseBalance, quoteBalance,
                offerID, orderBookID
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.manageOffer().name);
            expect(obj.baseBalance).to.be.equal(baseBalance);
            expect(obj.quoteBalance).to.be.equal(quoteBalance);
            expect(obj.offerID).to.be.equal(offerID);
            expect(obj.orderBookID).to.be.equal(orderBookID);
    })
});
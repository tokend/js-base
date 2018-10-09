import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";
import isEqual from 'lodash/isEqual';

describe('Create ASwapBidCreation request', function () {
    it("Success", function () {
        let opts = {
            balanceID: StellarBase.Keypair.random().balanceId(),
            amount: "911",
            details: {"reason":"Because we can"},
            quoteAssets: [
                {
                    price: "12.21",
                    asset: "ETH",
                },
                {
                    price: "21.12",
                    asset: "BTC",
                },
            ],
        };
        let op = StellarBase.CreateAtomicSwapBidCreationRequestBuilder.createASwapBidCreationRequest(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.createAswapBidRequest().name);
        expect(obj.balanceID).to.be.equal(opts.balanceID);
        expect(obj.amount).to.be.equal(opts.amount);
        expect(isEqual(obj.details, opts.details)).to.be.true;
        expect(isEqual(obj.quoteAssets, opts.quoteAssets)).to.be.true;
    });
});
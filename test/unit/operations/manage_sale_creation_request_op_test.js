import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";
import isEqual from 'lodash/isEqual';

describe('Manage Sale Creation request op', function () {
    it("Success create", function () {
        let opt = {
            requestID: "12",
            baseAsset: "XAAU",
            defaultQuoteAsset: "USD",
            startTime: "4123421",
            endTime: "4123425",
            softCap: "20000.21",
            hardCap: "648251",
            saleState: StellarBase.xdr.SaleState.promotion(),
            baseAssetForHardCap: "648251",
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
                    asset: "BTC",
                },
            ],
        }
        let op = StellarBase.SaleRequestBuilder.createSaleCreationRequest(opt);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.createSaleRequest().name);
        expect(opt.requestID).to.be.equal(obj.requestID);
        expect(opt.baseAsset).to.be.equal(obj.baseAsset);
        expect(opt.defaultQuoteAsset).to.be.equal(obj.defaultQuoteAsset);
        expect(opt.startTime).to.be.equal(obj.startTime);
        expect(opt.endTime).to.be.equal(obj.endTime);
        expect(opt.softCap).to.be.equal(obj.softCap);
        expect(opt.saleState).to.be.equal(obj.saleState);
        expect(JSON.stringify(opt.quoteAssets)).to.be.equal(JSON.stringify(obj.quoteAssets));
        expect(isEqual(opt.details, obj.details)).to.be.true;

    });
    it("Success create Crowdfund", function () {
        let opt = {
            requestID: "12",
            baseAsset: "XAAU",
            defaultQuoteAsset: "USD",
            startTime: "4123421",
            endTime: "4123425",
            softCap: "20000.21",
            hardCap: "648251",
            details: {
                short_description: "short description",
                description: "Token sale description",
                logo: "logo",
                name: "sale name",
            },
            quoteAssets: [
                {
                    price: "1",
                    asset: "ETH",
                },
                {
                    price: "1",
                    asset: "BTC",
                },
            ],
            saleType: true,
            baseAssetForHardCap: "648251"
        }
        let op = StellarBase.SaleRequestBuilder.createSaleCreationRequest(opt);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.createSaleRequest().name);
        expect(opt.requestID).to.be.equal(obj.requestID);
        expect(opt.baseAsset).to.be.equal(obj.baseAsset);
        expect(opt.defaultQuoteAsset).to.be.equal(obj.defaultQuoteAsset);
        expect(opt.startTime).to.be.equal(obj.startTime);
        expect(opt.endTime).to.be.equal(obj.endTime);
        expect(opt.softCap).to.be.equal(obj.softCap);
        expect(JSON.stringify(opt.quoteAssets)).to.be.equal(JSON.stringify(obj.quoteAssets));
        expect(isEqual(opt.details, obj.details)).to.be.true;
        expect(opt.baseAssetForHardCap).to.be.equal(obj.baseAssetForHardCap);
    });
    it("Success create basic sale", function () {
        let opt = {
            requestID: "12",
            baseAsset: "XAAU",
            defaultQuoteAsset: "USD",
            startTime: "4123421",
            endTime: "4123425",
            softCap: "20000.21",
            hardCap: "648251",
            details: {
                short_description: "short description",
                description: "Token sale description",
                logo: "logo",
                name: "sale name",
            },
            quoteAssets: [
                {
                    price: "1",
                    asset: "ETH",
                },
                {
                    price: "1",
                    asset: "BTC",
                },
            ],
            saleType: false,
            baseAssetForHardCap: "648251"
        }
        let op = StellarBase.SaleRequestBuilder.createSaleCreationRequest(opt);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.createSaleRequest().name);
        expect(opt.requestID).to.be.equal(obj.requestID);
        expect(opt.baseAsset).to.be.equal(obj.baseAsset);
        expect(opt.defaultQuoteAsset).to.be.equal(obj.defaultQuoteAsset);
        expect(opt.startTime).to.be.equal(obj.startTime);
        expect(opt.endTime).to.be.equal(obj.endTime);
        expect(opt.softCap).to.be.equal(obj.softCap);
        expect(JSON.stringify(opt.quoteAssets)).to.be.equal(JSON.stringify(obj.quoteAssets));
        expect(isEqual(opt.details, obj.details)).to.be.true;
        expect(opt.baseAssetForHardCap).to.be.equal(obj.baseAssetForHardCap);
    });
    it("Success cancel sale creation request", function () {
        let opt = {
            requestID: "120"
        };
        let op = StellarBase.SaleRequestBuilder.cancelSaleCreationRequest(opt);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.cancelSaleRequest().name);
        expect(opt.requestID).to.be.equal(obj.requestID);
    });
});
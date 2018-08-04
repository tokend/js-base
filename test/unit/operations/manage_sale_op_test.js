import isEqual from "lodash/isEqual";
import {ManageSaleBuilder} from "../../../src/operations/manage_sale";

describe("Manage sale", function () {
    it("Update sale details request op", function () {
        let opts = {
            saleID: "1",
            requestID: "0",
            newDetails: {
                short_description: "short description",
                description: "Token sale description",
                logo: {
                    url: "logo_url",
                    type: "logo_type",
                },
                name: "sale name",
            }
        };

        let op = StellarBase.ManageSaleBuilder.createUpdateSaleDetailsRequest(opts);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.saleID).to.be.equal(opts.saleID);
        expect(obj.requestID).to.be.equal(opts.requestID);
        expect(isEqual(obj.newDetails, opts.newDetails)).to.be.true;
    });
    it('Update sale end time request op', function () {
        let opts = {
            saleID: '1',
            requestID: '0',
            newEndTime: '1000'
        };

        let op = StellarBase.ManageSaleBuilder.createUpdateSaleEndTimeRequest(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.saleID).to.be.equal(opts.saleID);
        expect(obj.requestID).to.be.equal(opts.requestID);
        expect(obj.newEndTime).to.be.equal(opts.newEndTime);
    });
    it('Cancel sale', () => {
        let opts = {
            saleID: '1'
        }
        let op = ManageSaleBuilder.cancelSale(opts)
        let xdrOp = op.toXDR('hex')
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdrOp, 'hex'))
        let obj = StellarBase.Operation.operationToObject(operation)
        expect(obj.saleID).to.be.equal(opts.saleID)
    });
    it('Set sale state', () => {
        let opts = {
            saleID: '1',
            saleState: StellarBase.xdr.SaleState.promotion() 
        }
        let op = ManageSaleBuilder.setSaleState(opts)
        let xdrOp = op.toXDR('hex')
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdrOp, 'hex'))
        let obj = StellarBase.Operation.operationToObject(operation)
        expect(obj.saleID).to.be.equal(opts.saleID)
        expect(obj.saleState).to.be.equal(opts.saleState)
    });
    it('Update promotion', () => {
        let opts = {
            saleID: "1",
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
            isCrowdfunding: false,
            baseAssetForHardCap: "648251"
        };

        let op = ManageSaleBuilder.createPromotionUpdateRequest(opts);
        let xdrOp = op.toXDR('hex');
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdrOp, 'hex'));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.saleID).to.be.equal(opts.saleID);
        expect(obj.requestID).to.be.equal(opts.requestID);
        expect(obj.type).to.be.equal(StellarBase.xdr.OperationType.manageSale().name);
        expect(opts.requestID).to.be.equal(obj.requestID);
        expect(opts.baseAsset).to.be.equal(obj.baseAsset);
        expect(opts.defaultQuoteAsset).to.be.equal(obj.defaultQuoteAsset);
        expect(opts.startTime).to.be.equal(obj.startTime);
        expect(opts.endTime).to.be.equal(obj.endTime);
        expect(opts.softCap).to.be.equal(obj.softCap);
        expect(JSON.stringify(opts.quoteAssets)).to.be.equal(JSON.stringify(obj.quoteAssets));
        expect(isEqual(opts.details, obj.details)).to.be.true;
        expect(opts.baseAssetForHardCap).to.be.equal(obj.baseAssetForHardCap);
    });
});
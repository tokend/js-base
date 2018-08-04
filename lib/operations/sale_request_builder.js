"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var xdr = _interopRequire(require("../generated/stellar-xdr_generated"));

var isUndefined = _interopRequire(require("lodash/isUndefined"));

var BaseOperation = require("./base_operation").BaseOperation;

var Keypair = require("../keypair").Keypair;

var _jsXdr = require("js-xdr");

var UnsignedHyper = _jsXdr.UnsignedHyper;
var Hyper = _jsXdr.Hyper;

var SaleRequestBuilder = exports.SaleRequestBuilder = (function () {
    function SaleRequestBuilder() {
        _classCallCheck(this, SaleRequestBuilder);
    }

    _createClass(SaleRequestBuilder, null, {
        createSaleCreationRequest: {

            /**
             * Creates operation to create withdraw request with autoconversion
             * @param {object} opts
             * @param {string} opts.requestID - ID of the request. 0 - to create new;
             * @param {string} opts.baseAsset - asset for which sale will be performed
             * @param {string} opts.defaultQuoteAsset - asset in which hardcap/soft cap will be calculated
             * @param {string} opts.startTime - start time of the sale
             * @param {string} opts.endTime - close time of the sale
             * @param {string} opts.softCap - minimum amount of quote asset to be received at which sale will be considered a successful
             * @param {string} opts.hardCap - max amount of quote asset to be received
             * @param {object} opts.details - sale specific details
             * @param {object} opts.details.name - name of the sale
             * @param {object} opts.details.short_description - short description of the sale
             * @param {object} opts.details.desciption - sale specific details
             * @param {object} opts.details.logo - details of the logo
             * @param {array} opts.quoteAssets - accepted assets
             * @param {object} opts.quoteAssets.price - price for 1 baseAsset in terms of quote asset
             * @param {object} opts.quoteAssets.asset - asset code of the quote asset
             * @param {object} opts.isCrowdfunding - states if sale type is crowd funding
             * @param {string} opts.baseAssetForHardCap - specifies the amount of base asset required for hard cap
             * @param {SaleState} opts.saleState - specifies the initial state of the sale
             * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
             * @returns {xdr.CreateSaleCreationRequestOp}
             */

            value: function createSaleCreationRequest(opts) {
                var request = this.validateSaleCreationRequest(opts);

                var createSaleCreationRequestOp = new xdr.CreateSaleCreationRequestOp({
                    requestId: UnsignedHyper.fromString(opts.requestID),
                    request: request,
                    ext: new xdr.CreateSaleCreationRequestOpExt(xdr.LedgerVersion.emptyVersion())
                });
                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.createSaleRequest(createSaleCreationRequestOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        validateSaleCreationRequest: {
            value: function validateSaleCreationRequest(opts) {
                var attrs = {};

                if (!BaseOperation.isValidAsset(opts.baseAsset)) {
                    throw new Error("opts.baseAsset is invalid");
                }
                attrs.baseAsset = opts.baseAsset;

                if (!BaseOperation.isValidAsset(opts.defaultQuoteAsset)) {
                    throw new Error("opts.defaultQuoteAsset is invalid");
                }
                attrs.defaultQuoteAsset = opts.defaultQuoteAsset;

                if (isUndefined(opts.startTime)) {
                    throw new Error("opts.startTime is invalid");
                }
                attrs.startTime = UnsignedHyper.fromString(opts.startTime);

                if (isUndefined(opts.endTime)) {
                    throw new Error("opts.endTime is invalid");
                }
                attrs.endTime = UnsignedHyper.fromString(opts.endTime);

                if (!BaseOperation.isValidAmount(opts.softCap, true)) {
                    throw new Error("opts.softCap is invalid");
                }
                attrs.softCap = BaseOperation._toUnsignedXDRAmount(opts.softCap);

                if (!BaseOperation.isValidAmount(opts.hardCap, true)) {
                    throw new Error("opts.hardCap is invalid");
                }
                attrs.hardCap = BaseOperation._toUnsignedXDRAmount(opts.hardCap);

                SaleRequestBuilder.validateDetail(opts.details);
                attrs.details = JSON.stringify(opts.details);
                attrs.ext = new xdr.SaleCreationRequestExt(xdr.LedgerVersion.emptyVersion());

                var isCrowdfunding = !isUndefined(opts.isCrowdfunding) && opts.isCrowdfunding;
                var hasBaseAssetForHardCap = !isUndefined(opts.baseAssetForHardCap);

                var saleTypeExt = undefined;

                if (isCrowdfunding) {
                    var crowdFundingSale = new xdr.CrowdFundingSale({
                        ext: new xdr.CrowdFundingSaleExt(xdr.LedgerVersion.emptyVersion()) });
                    var saleTypeExtTypedSale = xdr.SaleTypeExtTypedSale.crowdFunding(crowdFundingSale);
                    saleTypeExt = new xdr.SaleTypeExt({
                        typedSale: saleTypeExtTypedSale });
                } else {
                    var basicSale = new xdr.BasicSale({
                        ext: new xdr.BasicSaleExt(xdr.LedgerVersion.emptyVersion()) });
                    var saleTypeExtTypedSale = xdr.SaleTypeExtTypedSale.basicSale(basicSale);
                    saleTypeExt = new xdr.SaleTypeExt({
                        typedSale: saleTypeExtTypedSale });
                }

                if (hasBaseAssetForHardCap && isUndefined(opts.saleState)) {
                    var extV2 = new xdr.SaleCreationRequestExtV2({
                        saleTypeExt: saleTypeExt,
                        requiredBaseAssetForHardCap: BaseOperation._toUnsignedXDRAmount(opts.baseAssetForHardCap) });

                    attrs.ext = xdr.SaleCreationRequestExt.allowToSpecifyRequiredBaseAssetAmountForHardCap(extV2);
                } else if (!isUndefined(opts.saleState)) {
                    var extV3 = new xdr.SaleCreationRequestExtV3({
                        saleTypeExt: saleTypeExt,
                        requiredBaseAssetForHardCap: BaseOperation._toUnsignedXDRAmount(opts.baseAssetForHardCap),
                        state: opts.saleState });

                    attrs.ext = xdr.SaleCreationRequestExt.statableSale(extV3);
                } else if (isCrowdfunding) {
                    attrs.ext = xdr.SaleCreationRequestExt.typedSale(saleTypeExt);
                }

                var request = new xdr.SaleCreationRequest(attrs);

                if (isUndefined(opts.requestID)) {
                    opts.requestID = "0";
                }

                if (isUndefined(opts.quoteAssets) || opts.quoteAssets.length == 0) {
                    throw new Error("opts.quoteAssets is invalid");
                }

                attrs.quoteAssets = [];
                for (var i = 0; i < opts.quoteAssets.length; i++) {
                    var quoteAsset = opts.quoteAssets[i];
                    var minAmount, maxAmount;
                    if (isCrowdfunding) {
                        minAmount = 1;
                        maxAmount = 1;
                    }

                    if (!BaseOperation.isValidAmount(quoteAsset.price, false, minAmount, maxAmount)) {
                        throw new Error("opts.quoteAssets[i].price is invalid: " + quoteAsset.price);
                    }

                    if (isUndefined(quoteAsset.asset)) {
                        throw new Error("opts.quoteAssets[i].asset is invalid");
                    }

                    attrs.quoteAssets.push(new xdr.SaleCreationRequestQuoteAsset({
                        price: BaseOperation._toUnsignedXDRAmount(quoteAsset.price),
                        quoteAsset: quoteAsset.asset,
                        ext: new xdr.SaleCreationRequestQuoteAssetExt(xdr.LedgerVersion.emptyVersion()) }));
                }

                return request;
            }
        },
        validateDetail: {
            value: function validateDetail(details) {
                if (isUndefined(details)) {
                    throw new Error("details is invalid");
                }

                if (isUndefined(details.short_description)) {
                    throw new Error("details.short_description is invalid");
                }

                if (isUndefined(details.description)) {
                    throw new Error("details.description is invalid");
                }

                if (isUndefined(details.logo)) {
                    throw new Error("details.logo is invalid");
                }

                if (isUndefined(details.name)) {
                    throw new Error("details.name is invalid");
                }
            }
        },
        crateSaleCreationRequestToObject: {
            value: function crateSaleCreationRequestToObject(result, attrs) {
                result.requestID = attrs.requestId().toString();
                var request = attrs.request();
                result.baseAsset = request.baseAsset();
                result.defaultQuoteAsset = request.defaultQuoteAsset();
                result.startTime = request.startTime().toString();
                result.endTime = request.endTime().toString();
                result.softCap = BaseOperation._fromXDRAmount(request.softCap());
                result.hardCap = BaseOperation._fromXDRAmount(request.hardCap());
                result.details = JSON.parse(request.details());
                result.quoteAssets = [];
                for (var i = 0; i < request.quoteAssets().length; i++) {
                    result.quoteAssets.push({
                        price: BaseOperation._fromXDRAmount(request.quoteAssets()[i].price()),
                        asset: request.quoteAssets()[i].quoteAsset() });
                }
                switch (request.ext()["switch"]()) {
                    case xdr.LedgerVersion.allowToSpecifyRequiredBaseAssetAmountForHardCap():
                        {
                            result.baseAssetForHardCap = BaseOperation._fromXDRAmount(request.ext().extV2().requiredBaseAssetForHardCap());
                            break;
                        }
                    case xdr.LedgerVersion.statableSale():
                        {
                            result.baseAssetForHardCap = BaseOperation._fromXDRAmount(request.ext().extV3().requiredBaseAssetForHardCap());
                            result.saleState = request.ext().extV3().state();
                            break;
                        }
                }
            }
        },
        checkSaleState: {

            /**
             * Creates operation to check sale state
             * @param {object} opts
             * @param {string} saleID - id of the sale to check
             * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
             * @returns {xdr.CheckSaleStateOp}
             */

            value: function checkSaleState(opts) {
                var attrs = {};

                if (isUndefined(opts.saleID)) {
                    throw new Error("Invalid opts.saleID");
                }

                var checkSaleStateOp = new xdr.CheckSaleStateOp({
                    saleId: UnsignedHyper.fromString(opts.saleID),
                    ext: new xdr.CheckSaleStateOpExt(xdr.LedgerVersion.emptyVersion())
                });
                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.checkSaleState(checkSaleStateOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        checkSaleStateToObject: {
            value: function checkSaleStateToObject(result, attrs) {
                result.saleID = attrs.saleId().toString();
            }
        }
    });

    return SaleRequestBuilder;
})();
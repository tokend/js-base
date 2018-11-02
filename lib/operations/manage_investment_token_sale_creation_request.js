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

var _jsXdr = require("js-xdr");

var UnsignedHyper = _jsXdr.UnsignedHyper;
var Hyper = _jsXdr.Hyper;

var SaleRequestBuilder = require("./sale_request_builder").SaleRequestBuilder;

var ManageInvestmentTokenSaleCreationRequestBuilder = exports.ManageInvestmentTokenSaleCreationRequestBuilder = (function () {
    function ManageInvestmentTokenSaleCreationRequestBuilder() {
        _classCallCheck(this, ManageInvestmentTokenSaleCreationRequestBuilder);
    }

    _createClass(ManageInvestmentTokenSaleCreationRequestBuilder, null, {
        createITSaleCreationRequest: {

            /**
             * Create investment token sale creation request
             * @param {object} opts
             * @param {string} opts.baseAsset - asset to be sold
             * @param {string} opts.amountToBeSold - amount of base asset
             * @param {object} opts.details - sale details
             * @param {array} opts.quoteAssets - accepted assets
             * @param {string} opts.quoteAssets.price - price for 1 baseAsset in terms of quote asset
             * @param {string} opts.quoteAssets.asset - asset code of the quote asset
             * @param {string} opts.tradingStartDate - start date of trading
             * @param {string} opts.settlementStartDate - start date of settlement
             * @param {string} opts.settlementEndDate - end date of settlement
             * @param {string} opts.defaultRedemptionAsset - asset in which redemption
             * will be performed if other redemption asset not specified
             * @param {string} [opts.source] - The source account for the operation.
             * Defaults to the transaction's source account.
             * @returns {xdr.ManageInvestmentTokenSaleCreationRequestOp}
             */

            value: function createITSaleCreationRequest(opts) {
                var requestAttr = ManageInvestmentTokenSaleCreationRequestBuilder.validateSaleCreationRequestDetails(opts);

                var data = new xdr.ManageItSaleCreationRequestOpData.create(new xdr.InvestmentTokenSaleCreationRequest(requestAttr));

                return ManageInvestmentTokenSaleCreationRequestBuilder.manageSaleCreationRequest(data, opts);
            }
        },
        updateITSaleCreationRequest: {

            /**
             * Update investment token sale creation request
             * @param {object} opts
             * @param {string} opts.requestID - id of request to be updated
             * @param {string} opts.baseAsset - asset to be sold
             * @param {string} opts.amountToBeSold - amount of base asset
             * @param {object} opts.details - sale details
             * @param {array} opts.quoteAssets - accepted assets
             * @param {string} opts.quoteAssets.price - price for 1 baseAsset in terms of quote asset
             * @param {string} opts.quoteAssets.asset - asset code of the quote asset
             * @param {string} opts.tradingStartDate - start date of trading
             * @param {string} opts.settlementStartDate - start date of settlement
             * @param {string} opts.settlementEndDate - end date of settlement
             * @param {string} opts.defaultRedemptionAsset - asset in which redemption
             * will be performed if other redemption asset not specified
             * @param {string} [opts.source] - The source account for the operation.
             * Defaults to the transaction's source account.
             * @returns {xdr.ManageInvestmentTokenSaleCreationRequestOp}
             */

            value: function updateITSaleCreationRequest(opts) {
                var requestAttr = ManageInvestmentTokenSaleCreationRequestBuilder.validateSaleCreationRequestDetails(opts);

                var data = new xdr.ManageItSaleCreationRequestOpData.update(new xdr.UpdateCreationRequestDetails({
                    requestId: UnsignedHyper.fromString(opts.requestID),
                    request: new xdr.InvestmentTokenSaleCreationRequest(requestAttr),
                    ext: new xdr.UpdateCreationRequestDetailsExt(xdr.LedgerVersion.emptyVersion())
                }));

                return ManageInvestmentTokenSaleCreationRequestBuilder.manageSaleCreationRequest(data, opts);
            }
        },
        cancelITSaleCreationRequest: {

            /**
             * Cancel investment token sale creation request
             * @param {object} opts
             * @param {string} opts.requestID - sale request id to cancel
             * @param {string} [opts.source] - The source account for the operation.
             * Defaults to the transaction's source account.
             * @returns {xdr.ManageInvestmentTokenSaleCreationRequestOp}
             */

            value: function cancelITSaleCreationRequest(opts) {
                var requestId = UnsignedHyper.fromString(opts.requestID);
                var details = xdr.ManageItSaleCreationRequestOpData.cancel(requestId);

                return ManageInvestmentTokenSaleCreationRequestBuilder.manageSaleCreationRequest(details, opts);
            }
        },
        validateSaleCreationRequestDetails: {

            /**
             * @private
             */

            value: function validateSaleCreationRequestDetails(opts) {
                SaleRequestBuilder.validateDetail(opts.details);

                var attrs = {
                    details: JSON.stringify(opts.details),
                    ext: new xdr.InvestmentTokenSaleCreationRequestExt(xdr.LedgerVersion.emptyVersion())
                };
                if (!BaseOperation.isValidAsset(opts.baseAsset)) {
                    throw new Error("base asset is invalid");
                }
                if (!BaseOperation.isValidAmount(opts.amountToBeSold, false)) {
                    throw new Error("amount to be sold is invalid");
                }
                if (isUndefined(opts.tradingStartDate)) {
                    throw new Error("trading start date is undefined");
                }
                if (isUndefined(opts.settlementStartDate)) {
                    throw new Error("settlement start date is undefined");
                }
                if (isUndefined(opts.settlementEndDate)) {
                    throw new Error("settlement end date is undefined");
                }

                attrs.baseAsset = opts.baseAsset;
                attrs.amountToBeSold = BaseOperation._toUnsignedXDRAmount(opts.amountToBeSold);
                attrs.tradingStartDate = UnsignedHyper.fromString(opts.tradingStartDate);
                attrs.settlementStartDate = UnsignedHyper.fromString(opts.settlementStartDate);
                attrs.settlementEndDate = UnsignedHyper.fromString(opts.settlementEndDate);
                attrs.defaultRedemptionAsset = opts.defaultRedemptionAsset;

                if (attrs.tradingStartDate >= opts.settlementStartDate) {
                    throw new Error("trading start date must be early " + "than settlement start date");
                }
                if (attrs.settlementStartDate >= opts.settlementEndDate) {
                    throw new Error("settlement start date must be early " + "than settlement end date");
                }

                attrs.quoteAssets = [];
                for (var i = 0; i < opts.quoteAssets.length; i++) {
                    var quoteAsset = opts.quoteAssets[i];

                    if (!BaseOperation.isValidAsset(quoteAsset.asset)) {
                        throw new Error("opts.quoteAssets[" + i + "].asset is invalid");
                    }
                    if (!BaseOperation.isValidAmount(quoteAsset.price, false)) {
                        throw new Error("opts.quoteAssets[" + i + "].price is invalid: " + quoteAsset.price);
                    }

                    attrs.quoteAssets.push(new xdr.SaleCreationRequestQuoteAsset({
                        price: BaseOperation._toUnsignedXDRAmount(quoteAsset.price),
                        quoteAsset: quoteAsset.asset,
                        ext: new xdr.SaleCreationRequestQuoteAssetExt(xdr.LedgerVersion.emptyVersion())
                    }));
                }

                return attrs;
            }
        },
        manageSaleCreationRequest: {

            /**
             * @private
             */

            value: function manageSaleCreationRequest(data, opts) {
                var manageSaleCreationRequestOp = new xdr.ManageItSaleCreationRequestOp({
                    data: data,
                    ext: new xdr.ManageItSaleCreationRequestOpExt(xdr.LedgerVersion.emptyVersion()) });

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.manageInvestmentTokenSaleCreationRequest(manageSaleCreationRequestOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        saleCreationRequestToObject: {

            /**
             * @private
             */

            value: function saleCreationRequestToObject(result, request) {
                result.baseAsset = request.baseAsset();
                result.defaultRedemptionAsset = request.defaultRedemptionAsset();
                result.amountToBeSold = BaseOperation._fromXDRAmount(request.amountToBeSold());
                result.details = JSON.parse(request.details());
                result.tradingStartDate = request.tradingStartDate().toString();
                result.settlementStartDate = request.settlementStartDate().toString();
                result.settlementEndDate = request.settlementEndDate().toString();

                result.quoteAssets = [];
                for (var i = 0; i < request.quoteAssets().length; i++) {
                    result.quoteAssets.push({
                        price: BaseOperation._fromXDRAmount(request.quoteAssets()[i].price()),
                        asset: request.quoteAssets()[i].quoteAsset() });
                }
            }
        },
        manageITSaleCreationRequestOpToObject: {
            value: function manageITSaleCreationRequestOpToObject(result, attrs) {
                switch (attrs.data()["switch"]()) {
                    case xdr.ManageItSaleCreationRequestAction.create():
                        {
                            var request = attrs.data().creationRequest();

                            ManageInvestmentTokenSaleCreationRequestBuilder.saleCreationRequestToObject(result, request);
                            break;
                        }
                    case xdr.ManageItSaleCreationRequestAction.update():
                        {
                            var request = attrs.data().updateDetails().request();

                            result.requestID = attrs.data().updateDetails().requestId().toString();
                            ManageInvestmentTokenSaleCreationRequestBuilder.saleCreationRequestToObject(result, request);
                            break;
                        }
                    case xdr.ManageItSaleCreationRequestAction.cancel():
                        {
                            result.requestID = attrs.data().requestToCancelId().toString();
                            break;
                        }
                }
            }
        }
    });

    return ManageInvestmentTokenSaleCreationRequestBuilder;
})();
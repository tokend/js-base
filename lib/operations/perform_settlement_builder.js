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

var PerformSettlementBuilder = exports.PerformSettlementBuilder = (function () {
    function PerformSettlementBuilder() {
        _classCallCheck(this, PerformSettlementBuilder);
    }

    _createClass(PerformSettlementBuilder, null, {
        performSettlement: {

            /**
             * Perform all settlement options for investment token sale
             * @param {object} opts
             * @param {string} opts.investmentTokenSaleID - asset to be sold
             * @param {string} opts.newInvestmentToken - asset code of new investment tokens
             * @param {array} opts.settlementAssets - additional information about settlement assets
             * @param {string} opts.settlementAssets.code - asset code of the settlement asset
             * @param {number|string} opts.settlementAssets.price - price for 1 investment token in terms of settlement asset
             * @param {string} [opts.source] - The source account for the operation.
             * Defaults to the transaction's source account.
             * @returns {xdr.PerformSettlementOp}
             */

            value: function performSettlement(opts) {
                if (isUndefined(opts.investmentTokenSaleID)) {
                    throw new Error("investmentTokenSaleID is undefined");
                }
                if (!BaseOperation.isValidAsset(opts.newInvestmentToken)) {
                    throw new Error("newInvestmentToken is invalid");
                }

                var settlementAssets = [];
                for (var i = 0; i < opts.settlementAssets.length; i++) {
                    var settlementAsset = opts.settlementAssets[i];

                    if (!BaseOperation.isValidAsset(settlementAsset.code)) {
                        throw new Error("opts.settlementAssets[" + i + "].code is invalid: " + settlementAsset.code);
                    }

                    if (!BaseOperation.isValidAmount(settlementAsset.price)) {
                        throw new Error("opts.settlementAssets[" + i + "].price is invalid: " + settlementAsset.price);
                    }

                    settlementAssets.push(new xdr.SettlementAsset({
                        code: settlementAsset.code,
                        price: BaseOperation._toUnsignedXDRAmount(settlementAsset.price),
                        ext: new xdr.SettlementAssetExt(xdr.LedgerVersion.emptyVersion())
                    }));
                }

                var attrs = {
                    investmentTokenSaleId: UnsignedHyper.fromString(opts.investmentTokenSaleID),
                    newInvestmentToken: opts.newInvestmentToken,
                    settlementAssets: settlementAssets,
                    ext: new xdr.PerformSettlementOpExt(xdr.LedgerVersion.emptyVersion()) };

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.performSettlement(new xdr.PerformSettlementOp(attrs));
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        performSettlementOpToObject: {
            value: function performSettlementOpToObject(result, attrs) {
                result.investmentTokenSaleID = attrs.investmentTokenSaleId().toString();
                result.newInvestmentToken = attrs.newInvestmentToken();
                result.settlementAssets = [];
                for (var i = 0; i < attrs.settlementAssets().length; i++) {
                    result.settlementAssets.push({
                        code: attrs.settlementAssets()[i].code(),
                        price: BaseOperation._fromXDRAmount(attrs.settlementAssets()[i].price()) });
                }
            }
        }
    });

    return PerformSettlementBuilder;
})();
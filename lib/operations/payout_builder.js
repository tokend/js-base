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

var PayoutOpBuilder = exports.PayoutOpBuilder = (function () {
    function PayoutOpBuilder() {
        _classCallCheck(this, PayoutOpBuilder);
    }

    _createClass(PayoutOpBuilder, null, {
        payoutOp: {

            /**
             * Create a payout operation.
             * @param {object} opts
             * @param {string} opts.asset - Asset, whose holders will receive dividends
             * @param {string} opts.sourceBalanceId - Id of balance from
             * which payout will be performed
             * @param {string} opts.maxPayoutAmount -
             *                  The maximum amount of payout for all balances
             * @param {string} opts.minPayoutAmount -
             *                  The minimum amount of payout to each balance
             * @param {string} opts.minAssetHolderAmount -
             *                  The minimum amount of tokens on holders balances
             * @param {object} opts.fee - fee to be charged
             * @param {string} opts.fee.fixed - The fixed fee
             * @param {string} opts.fee.percent - The calculated payout fee
             * @param {string} [opts.source] - The source account for the payout.
             * @returns {xdr.PayoutOp}
             */

            value: function payoutOp(opts) {
                var attributes = {
                    ext: new xdr.PayoutOpExt(xdr.LedgerVersion.emptyVersion()) };

                if (!BaseOperation.isValidAsset(opts.asset)) {
                    throw new TypeError("opts.asset is invalid");
                }

                if (!Keypair.isValidBalanceKey(opts.sourceBalanceId)) {
                    throw new TypeError("opts.sourceBalanceId is invalid");
                }

                if (!BaseOperation.isValidAmount(opts.maxPayoutAmount)) {
                    throw new TypeError("opts.maxPayoutAmount is invalid");
                }

                if (!BaseOperation.isValidAmount(opts.minPayoutAmount, true)) {
                    throw new TypeError("opts.minPayoutAmount is invalid");
                }

                if (!BaseOperation.isValidAmount(opts.minAssetHolderAmount, true)) {
                    throw new TypeError("opts.minAssetHolderAmount is invalid");
                }

                if (!BaseOperation.isFeeValid(opts.fee)) {
                    throw new TypeError("opts.fee is invalid");
                }

                attributes.asset = opts.asset;
                attributes.sourceBalanceId = Keypair.fromBalanceId(opts.sourceBalanceId).xdrBalanceId();
                attributes.maxPayoutAmount = BaseOperation._toUnsignedXDRAmount(opts.maxPayoutAmount);
                attributes.minPayoutAmount = BaseOperation._toUnsignedXDRAmount(opts.minPayoutAmount);
                attributes.minAssetHolderAmount = BaseOperation._toUnsignedXDRAmount(opts.minAssetHolderAmount);
                attributes.fee = BaseOperation.feeToXdr(opts.fee);

                var payout = new xdr.PayoutOp(attributes);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.payout(payout);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        payoutOpToObject: {
            value: function payoutOpToObject(result, attrs) {
                result.asset = attrs.asset();
                result.sourceBalanceId = BaseOperation.balanceIdtoString(attrs.sourceBalanceId());
                result.maxPayoutAmount = BaseOperation._fromXDRAmount(attrs.maxPayoutAmount());
                result.minAssetHolderAmount = BaseOperation._fromXDRAmount(attrs.minAssetHolderAmount());
                result.minPayoutAmount = BaseOperation._fromXDRAmount(attrs.minPayoutAmount());
                result.fee = {
                    fixed: BaseOperation._fromXDRAmount(attrs.fee().fixed()),
                    percent: BaseOperation._fromXDRAmount(attrs.fee().percent()) };
            }
        }
    });

    return PayoutOpBuilder;
})();
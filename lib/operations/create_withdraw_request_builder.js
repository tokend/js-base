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

var CreateWithdrawRequestBuilder = exports.CreateWithdrawRequestBuilder = (function () {
    function CreateWithdrawRequestBuilder() {
        _classCallCheck(this, CreateWithdrawRequestBuilder);
    }

    _createClass(CreateWithdrawRequestBuilder, null, {
        createWithdrawWithAutoConversion: {

            /**
             * Creates operation to create withdraw request with autoconversion
             * @param {object} opts
             * @param {string} opts.balance - Balance ID from which withdraw will be perfromed
             * @param {string} opts.amount - amount to be withdrawn
             * @param {object} opts.fee - fee to be charged
             * @param {string} opts.fee.fixed - fixed fee to be charged
             * @param {string} opts.fee.percent - percent fee to be charged
             * @param {object} opts.externalDetails - External details needed for PSIM to process withdraw operation
             * @param {string} opts.destAsset - Asset in which specifed amount will be autoconverted
             * @param {string} opts.expectedDestAssetAmount - Expected dest asset amount
             * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
             * @returns {xdr.CreateWithdrawalRequestOp}
             */

            value: function createWithdrawWithAutoConversion(opts) {
                var attrs = {};

                if (!Keypair.isValidBalanceKey(opts.balance)) {
                    throw new Error("balance is invalid");
                }

                attrs.balance = Keypair.fromBalanceId(opts.balance).xdrBalanceId();

                if (!BaseOperation.isValidAmount(opts.amount, false)) {
                    throw new Error("opts.amount is invalid");
                }

                attrs.amount = BaseOperation._toUnsignedXDRAmount(opts.amount);
                attrs.universalAmount = BaseOperation._toUnsignedXDRAmount("0");

                if (!BaseOperation.isFeeValid(opts.fee)) {
                    throw new Error("opts.fee is invalid");
                }

                attrs.fee = BaseOperation.feeToXdr(opts.fee);

                if (isUndefined(opts.externalDetails)) {
                    throw new Error("externalDetails is invalid");
                }

                attrs.externalDetails = JSON.stringify(opts.externalDetails);

                if (!BaseOperation.isValidAsset(opts.destAsset)) {
                    throw new Error("opts.destAsset is invalid");
                }

                if (!BaseOperation.isValidAmount(opts.expectedDestAssetAmount, false)) {
                    throw new Error("opts.expectedDestAssetAmount is invalid");
                }

                var autoConversionDetails = new xdr.AutoConversionWithdrawalDetails({
                    destAsset: opts.destAsset,
                    expectedAmount: BaseOperation._toUnsignedXDRAmount(opts.expectedDestAssetAmount),
                    ext: new xdr.AutoConversionWithdrawalDetailsExt(xdr.LedgerVersion.emptyVersion())
                });

                attrs.details = new xdr.WithdrawalRequestDetails.autoConversion(autoConversionDetails);
                attrs.ext = new xdr.WithdrawalRequestExt(xdr.LedgerVersion.emptyVersion());

                attrs.preConfirmationDetails = "";
                var request = new xdr.WithdrawalRequest(attrs);
                var withdrawRequestOp = new xdr.CreateWithdrawalRequestOp({
                    request: request,
                    ext: new xdr.CreateWithdrawalRequestOpExt(xdr.LedgerVersion.emptyVersion())
                });
                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.createWithdrawalRequest(withdrawRequestOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        createWithdrawalRequestOpToObject: {
            value: function createWithdrawalRequestOpToObject(result, attrs) {
                var request = attrs.request();
                result.balance = BaseOperation.balanceIdtoString(request.balance());
                result.amount = BaseOperation._fromXDRAmount(request.amount());
                result.fee = {
                    fixed: BaseOperation._fromXDRAmount(request.fee().fixed()),
                    percent: BaseOperation._fromXDRAmount(request.fee().percent()) };
                result.externalDetails = JSON.parse(request.externalDetails());
                result.details = {
                    type: request.details()["switch"](),
                    autoConversion: {
                        destAsset: request.details().autoConversion().destAsset(),
                        expectedAmount: BaseOperation._fromXDRAmount(request.details().autoConversion().expectedAmount()) } };
            }
        }
    });

    return CreateWithdrawRequestBuilder;
})();
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

var PaymentV2Builder = exports.PaymentV2Builder = (function () {
    function PaymentV2Builder() {
        _classCallCheck(this, PaymentV2Builder);
    }

    _createClass(PaymentV2Builder, null, {
        prepareAttrs: {
            value: function prepareAttrs(opts) {
                var attrs = {};

                if (!Keypair.isValidBalanceKey(opts.sourceBalanceId)) {
                    throw new TypeError("sourceBalanceId is invalid");
                }

                if (Keypair.isValidPublicKey(opts.destination)) {
                    attrs.destination = new xdr.PaymentOpV2Destination.account(Keypair.fromAccountId(opts.destination).xdrAccountId());
                } else if (Keypair.isValidBalanceKey(opts.destination)) {
                    attrs.destination = new xdr.PaymentOpV2Destination.balance(Keypair.fromBalanceId(opts.destination).xdrBalanceId());
                } else {
                    throw new TypeError("opts.destination is invalid");
                }

                if (!BaseOperation.isValidAmount(opts.amount)) {
                    throw new TypeError("amount argument must be of type String and represent a positive number");
                }

                if (isUndefined(opts.feeData)) {
                    throw new Error("feeData argument must be defined");
                }

                try {
                    PaymentV2Builder.ensureFeeValid(opts.feeData.sourceFee);
                } catch (e) {
                    throw new TypeError("sourceFee." + e.message);
                }

                try {
                    PaymentV2Builder.ensureFeeValid(opts.feeData.sourceFee);
                } catch (e) {
                    throw new TypeError("destination." + e.message);
                }

                var sourceFee = new xdr.Fee({
                    percent: BaseOperation._toUnsignedXDRAmount(opts.feeData.sourceFee.percent),
                    fixed: BaseOperation._toUnsignedXDRAmount(opts.feeData.sourceFee.fixed),
                    ext: new xdr.FeeExt(xdr.LedgerVersion.emptyVersion())
                });
                var destinationFee = new xdr.Fee({
                    percent: BaseOperation._toUnsignedXDRAmount(opts.feeData.destinationFee.percent),
                    fixed: BaseOperation._toUnsignedXDRAmount(opts.feeData.destinationFee.fixed),
                    ext: new xdr.FeeExt(xdr.LedgerVersion.emptyVersion())
                });
                attrs.feeData = new xdr.PaymentFeeDataV2({
                    sourceFee: sourceFee,
                    destinationFee: destinationFee,
                    sourcePaysForDest: opts.feeData.sourcePaysForDest,
                    ext: new xdr.PaymentFeeDataV2Ext(xdr.LedgerVersion.emptyVersion())
                });

                if (!BaseOperation.isValidSubject(opts.subject)) {
                    throw new Error("subject argument must be of type String 0-256 long");
                }

                if (isUndefined(opts.reference)) {
                    opts.reference = "";
                }

                attrs.sourceBalanceId = Keypair.fromBalanceId(opts.sourceBalanceId).xdrBalanceId();
                attrs.amount = BaseOperation._toUnsignedXDRAmount(opts.amount);
                attrs.subject = opts.subject;
                attrs.reference = opts.reference;
                attrs.ext = new xdr.PaymentOpV2Ext(xdr.LedgerVersion.emptyVersion());

                return attrs;
            }
        },
        ensureFeeValid: {
            value: function ensureFeeValid(fee) {
                if (!BaseOperation.isValidAmount(fee.fixed)) {
                    throw new TypeError("fixed fee must be of type String and represent a positive number");
                }

                if (!BaseOperation.isValidAmount(fee.percent)) {
                    throw new TypeError("fixed fee must be of type String and represent a positive number");
                }
            }
        },
        paymentV2: {

            /**
             * Creates PaymentV2 operation where destination is AccountID or BalanceID
             * @param {object} opts
             * @param {string} opts.sourceBalanceId
             * @param {string} opts.destination
             * @param {number|string} opts.amount
             * @param {object} opts.feeData
             * * @param {object} opts.feeData.sourceFee
             * * * @param {number|string} opts.feeData.sourceFee.percent
             * * * @param {number|string} opts.feeData.sourceFee.fixed
             * * @param {object} opts.feeData.destinationFee
             * * * @param {number|string} opts.feeData.destinationFee.percent
             * * * @param {number|string} opts.feeData.destinationFee.fixed
             * * @param {bool} opts.feeData.sourcePaysForDest
             * @param {string} opts.subject
             * @param {string} opts.reference
             * @returns {xdr.PaymentOpV2}
             */

            value: function paymentV2(opts) {
                var attrs = PaymentV2Builder.prepareAttrs(opts);
                var paymentV2 = new xdr.PaymentOpV2(attrs);
                var opAttrs = {};
                opAttrs.body = xdr.OperationBody.paymentV2(paymentV2);
                BaseOperation.setSourceAccount(opAttrs, opts);
                return new xdr.Operation(opAttrs);
            }
        },
        paymentV2ToObject: {
            value: function paymentV2ToObject(result, attrs) {
                result.sourceBalanceId = BaseOperation.balanceIdtoString(attrs.sourceBalanceId());
                switch (attrs.destination()["switch"]()) {
                    case xdr.PaymentDestinationType.account():
                        {
                            result.destination = BaseOperation.accountIdtoAddress(attrs.destination().accountId());
                            break;
                        }
                    case xdr.PaymentDestinationType.balance():
                        {
                            result.destination = BaseOperation.balanceIdtoString(attrs.destination().balanceId());
                            break;
                        }
                }
                result.amount = BaseOperation._fromXDRAmount(attrs.amount());
                result.feeData = {
                    sourceFee: {
                        percent: BaseOperation._fromXDRAmount(attrs.feeData().sourceFee().percent()),
                        fixed: BaseOperation._fromXDRAmount(attrs.feeData().sourceFee().fixed()) },
                    destinationFee: {
                        percent: BaseOperation._fromXDRAmount(attrs.feeData().destinationFee().percent()),
                        fixed: BaseOperation._fromXDRAmount(attrs.feeData().destinationFee().fixed()) },
                    sourcePaysForDest: attrs.feeData().sourcePaysForDest()
                };
                result.subject = attrs.subject();
                result.reference = attrs.reference();
            }
        }
    });

    return PaymentV2Builder;
})();
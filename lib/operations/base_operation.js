"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var xdr = _interopRequire(require("../generated/stellar-xdr_generated"));

var Keypair = require("../keypair").Keypair;

var _jsXdr = require("js-xdr");

var UnsignedHyper = _jsXdr.UnsignedHyper;
var Hyper = _jsXdr.Hyper;

var hash = require("../hashing").hash;

var encodeCheck = require("../strkey").encodeCheck;

var BigNumber = _interopRequire(require("bignumber.js"));

var best_r = require("../util/continued_fraction").best_r;

var padEnd = _interopRequire(require("lodash/padEnd"));

var trimEnd = _interopRequire(require("lodash/trimEnd"));

var isEmpty = _interopRequire(require("lodash/isEmpty"));

var isUndefined = _interopRequire(require("lodash/isUndefined"));

var isString = _interopRequire(require("lodash/isString"));

var isNumber = _interopRequire(require("lodash/isNumber"));

var isFinite = _interopRequire(require("lodash/isFinite"));

var crypto = _interopRequire(require("crypto"));

var ONE = 1000000;
var DECIMAL_PLACES = 6;
var MAX_INT64 = "9223372036854775807";
var MAX_INT64_AMOUNT = "9223372036854.775807";

var BaseOperation = exports.BaseOperation = (function () {
    function BaseOperation() {
        _classCallCheck(this, BaseOperation);
    }

    _createClass(BaseOperation, null, {
        MAX_INT64: {
            get: function () {
                return MAX_INT64;
            }
        },
        ONE: {
            get: function () {
                return ONE;
            }
        },
        MAX_INT64_AMOUNT: {
            get: function () {
                return MAX_INT64_AMOUNT;
            }
        },
        isPayment: {
            value: function isPayment(op) {
                if (!(op instanceof xdr.Operation)) {
                    throw new Error("should be used for operations");
                }
                return op.body()["switch"]().name === "payment";
            }
        },
        isValidAsset: {
            value: function isValidAsset(value) {
                return BaseOperation.isValidString(value, 1, 16);
            }
        },
        isValidString: {
            value: function isValidString(value, minSize, maxSize) {
                if (!isString(value)) {
                    return false;
                }

                if (!isUndefined(minSize) && value.length < minSize) {
                    return false;
                }

                if (!isUndefined(maxSize) && value.length > maxSize) {
                    return false;
                }

                return true;
            }
        },
        isValidSubject: {
            value: function isValidSubject(value) {
                return BaseOperation.isValidString(value, 0, 256);
            }
        },
        isValidArray: {
            value: function isValidArray(value, minSize) {
                return Array.isArray(value) && value.length >= minSize;
            }
        },
        isValidArrayOfClass: {
            value: function isValidArrayOfClass(value, minSize, cls) {
                if (!BaseOperation.isValidArray(value, minSize)) {
                    return false;
                }
                for (var i = 0; i < value.length; i++) {
                    if (!(value[i] instanceof cls)) {
                        return false;
                    }
                }
                return true;
            }
        },
        isValidPeriod: {
            value: function isValidPeriod(value) {
                var allowZero = arguments[1] === undefined ? false : arguments[1];

                if (!isString(value)) {
                    return false;
                }

                var period = undefined;
                try {
                    period = new BigNumber(value);
                } catch (e) {
                    return false;
                }

                // == 0
                if (!allowZero && period.isZero()) {
                    return false;
                }

                // < 0
                if (period.isNegative()) {
                    return false;
                }

                if (period.decimalPlaces() > 0) {
                    return false;
                }

                // Infinity
                if (!period.isFinite()) {
                    return false;
                }

                // NaN
                if (period.isNaN()) {
                    return false;
                }

                return true;
            }
        },
        isValidAmount: {
            value: function isValidAmount(value) {
                var allowZero = arguments[1] === undefined ? false : arguments[1];
                var max = arguments[2] === undefined ? undefined : arguments[2];
                var min = arguments[3] === undefined ? undefined : arguments[3];

                if (!isString(value)) {
                    return false;
                }

                var amount = undefined;
                try {
                    amount = new BigNumber(value);
                } catch (e) {
                    return false;
                }

                // == 0
                if (!allowZero && amount.isZero()) {
                    return false;
                }

                // < 0
                if (amount.isNegative()) {
                    return false;
                }

                // > Max value
                if (amount.times(ONE).greaterThan(new BigNumber(MAX_INT64).toString())) {
                    return false;
                }

                if (max && amount.greaterThan(new BigNumber(max).toString())) {
                    return false;
                }

                if (min && new BigNumber(min).greaterThan(amount.toString())) {
                    return false;
                }

                // Decimal places
                if (amount.decimalPlaces() > DECIMAL_PLACES) {
                    return false;
                }

                // Infinity
                if (!amount.isFinite()) {
                    return false;
                }

                // NaN
                if (amount.isNaN()) {
                    return false;
                }

                return true;
            }
        },
        _checkUnsignedIntValue: {

            /**
             * Returns value converted to uint32 value or undefined.
             * If `value` is not `Number`, `String` or `Undefined` then throws an error.
             * Used in {@link Operation.setOptions}.
             * @private
             * @param {string} name Name of the property (used in error message only)
             * @param {*} value Value to check
             * @param {function(value, name)} isValidFunction Function to check other constraints (the argument will be a `Number`)
             * @returns {undefined|Number}
             * @private
             */

            value: function _checkUnsignedIntValue(name, value) {
                var isValidFunction = arguments[2] === undefined ? null : arguments[2];

                if (isUndefined(value)) {
                    return undefined;
                }

                if (isString(value)) {
                    value = parseFloat(value);
                }

                if (!isNumber(value) || !isFinite(value) || value % 1 !== 0) {
                    throw new Error("" + name + " value is invalid");
                }

                if (value < 0) {
                    throw new Error("" + name + " value must be unsigned");
                }

                if (!isValidFunction || isValidFunction && isValidFunction(value, name)) {
                    return value;
                }

                throw new Error("" + name + " value is invalid");
            }
        },
        calcPercentFee: {
            value: function calcPercentFee(amountValue, percentValue) {
                var amount = new BigNumber(amountValue);
                var rate = new BigNumber(percentValue).div(100);
                return amount.times(rate).toString();
            }
        },
        _toXDRAmount: {

            /**
             * @private
             */

            value: function _toXDRAmount(value) {
                var amount = new BigNumber(value).mul(ONE);
                return Hyper.fromString(amount.toString());
            }
        },
        _toUnsignedXDRAmount: {

            /**
             * @private
             */

            value: function _toUnsignedXDRAmount(value) {
                var amount = new BigNumber(value).mul(ONE);
                return UnsignedHyper.fromString(amount.toString());
            }
        },
        _fromXDRAmount: {

            /**
             * @private
             */

            value: function _fromXDRAmount(value) {
                return new BigNumber(value).div(ONE).toString();
            }
        },
        _fromXDRPrice: {

            /**
             * @private
             */

            value: function _fromXDRPrice(price) {
                var n = new BigNumber(price.n());
                return n.div(new BigNumber(price.d())).toString();
            }
        },
        _toXDRPrice: {

            /**
             * @private
             */

            value: function _toXDRPrice(price) {
                var xdrObject = undefined;
                if (price.n && price.d) {
                    xdrObject = new xdr.Price(price);
                } else {
                    price = new BigNumber(price);
                    var approx = best_r(price);
                    xdrObject = new xdr.Price({
                        n: parseInt(approx[0]),
                        d: parseInt(approx[1])
                    });
                }

                if (xdrObject.n() < 0 || xdrObject.d() < 0) {
                    throw new Error("price must be positive");
                }

                return xdrObject;
            }
        },
        _accountTypeFromNumber: {
            value: function _accountTypeFromNumber(rawAccountType) {
                if (!BaseOperation._isValidAccountType(rawAccountType)) {
                    throw new Error("XDR Read Error: Unknown AccountType member for value " + rawAccountType);
                }

                return xdr.AccountType._byValue.get(rawAccountType);
            }
        },
        _statsOpTypeFromNumber: {
            value: function _statsOpTypeFromNumber(rawStatsOpType) {
                if (!BaseOperation._isValidStatsOpType(rawStatsOpType)) {
                    throw new Error("XDR Read Error: Unknown StatsOpType member for value " + rawStatsOpType);
                }

                return xdr.StatsOpType._byValue.get(rawStatsOpType);
            }
        },
        _keyValueTypeFromNumber: {
            value: function _keyValueTypeFromNumber(rawKVType) {
                if (!BaseOperation._isValidKVType(rawKVType)) {
                    throw new Error("XDR Read Error: Unknown KeyValueType number for value " + rawKVType);
                }

                return xdr.KeyValueEntryType._byValue.get(rawKVType);
            }
        },
        _keyValueActionFromNumber: {
            value: function _keyValueActionFromNumber(rawKVAction) {
                if (!BaseOperation._isValidKVAction(rawKVAction)) {
                    throw new Error("XDR Read Error: Unknown KeyValueAction number for value " + rawKVAction);
                }

                return xdr.ManageKvAction._byValue.get(rawKVAction);
            }
        },
        isFeeValid: {
            value: function isFeeValid(fee) {
                return BaseOperation.isValidAmount(fee.fixed, true) && BaseOperation.isValidAmount(fee.percent, true);
            }
        },
        feeToXdr: {
            value: function feeToXdr(fee) {
                var attrs = {
                    fixed: BaseOperation._toUnsignedXDRAmount(fee.fixed),
                    percent: BaseOperation._toUnsignedXDRAmount(fee.percent),
                    ext: new xdr.FeeExt(xdr.LedgerVersion.emptyVersion())
                };

                return new xdr.Fee(attrs);
            }
        },
        _requestTypeFromNumber: {
            value: function _requestTypeFromNumber(rawRequestType) {
                if (!BaseOperation._isValidRequestType(rawRequestType)) {
                    throw new Error("XDR Read Error: Unknown RequestType member for value " + rawRequestType);
                }

                return xdr.RequestType._byValue.get(rawRequestType);
            }
        },
        _isValidAccountType: {
            value: function _isValidAccountType(rawAccountType) {
                return xdr.AccountType._byValue.has(rawAccountType);
            }
        },
        _isValidStatsOpType: {
            value: function _isValidStatsOpType(rawStatsOpType) {
                return xdr.StatsOpType._byValue.has(rawStatsOpType);
            }
        },
        _isValidKVType: {
            value: function _isValidKVType(rawKVType) {
                return xdr.KeyValueEntryType._byValue.has(rawKVType);
            }
        },
        _isValidKVAction: {
            value: function _isValidKVAction(rawKVAction) {
                return xdr.ManageKvAction._byValue.has(rawKVAction);
            }
        },
        _isValidRequestType: {
            value: function _isValidRequestType(rawRequestType) {
                return xdr.RequestType._byValue.has(rawRequestType);
            }
        },
        accountIdtoAddress: {
            value: function accountIdtoAddress(accountId) {
                return encodeCheck("accountId", accountId.ed25519());
            }
        },
        balanceIdtoString: {
            value: function balanceIdtoString(balanceId) {
                return encodeCheck("balanceId", balanceId.ed25519());
            }
        },
        setSourceAccount: {

            /**
             * This operation set SourceAccount
             * @param {object} [opts]
             * @returns undefined
             */

            value: function setSourceAccount(opAttributes, opts) {
                if (opts.source) {
                    if (!Keypair.isValidPublicKey(opts.source)) {
                        throw new Error("Source address is invalid");
                    }
                    opAttributes.sourceAccount = Keypair.fromAccountId(opts.source).xdrAccountId();
                }
            }
        }
    });

    return BaseOperation;
})();
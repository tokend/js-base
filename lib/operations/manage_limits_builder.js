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

var ManageLimitsBuilder = exports.ManageLimitsBuilder = (function () {
    function ManageLimitsBuilder() {
        _classCallCheck(this, ManageLimitsBuilder);
    }

    _createClass(ManageLimitsBuilder, null, {
        createLimits: {
            /**
             * Create limits for account or account type
             * @param {object} opts
             * @param {string} opts.accountID - account to create limits for
             * @param {string} opts.accountType - account type to create limits for
             * @param {string} opts.statsOpType - operation type of stats
             * @param {string} opts.assetCode - asset code of limits
             * @param {boolean} opts.isConvertNeeded - if true - can use another assets for stats
             * @param {number|string} opts.dailyOut - limit per day
             * @param {number|string} opts.weeklyOut - limit per week
             * @param {number|string} opts.monthlyOut - limit per month
             * @param {number|string} opts.annualOut - limit per year
             * @param {string} [opts.source] - The source account for the limits creation. Defaults to the transaction's source account.
             * @returns {xdr.ManageLimitsOp}
             */

            value: function createLimits(opts) {
                if (!isUndefined(opts.accountID) && !isUndefined(opts.accountType)) {
                    throw new Error("opts.accountID and opts.accountType cannot be set for same limits");
                }

                var rawLimitsCreateDetails = {};

                if (!isUndefined(opts.accountID)) {
                    if (!Keypair.isValidPublicKey(opts.accountID)) {
                        throw new Error("opts.accountID is invalid");
                    }
                    rawLimitsCreateDetails.accountId = Keypair.fromAccountId(opts.accountID).xdrAccountId();
                }

                if (!isUndefined(opts.accountType)) {
                    rawLimitsCreateDetails.accountType = BaseOperation._accountTypeFromNumber(opts.accountType);
                }

                if (isUndefined(opts.statsOpType)) {
                    throw new Error("opts.statsOpType cannot be empty");
                }
                rawLimitsCreateDetails.statsOpType = BaseOperation._statsOpTypeFromNumber(opts.statsOpType);

                if (isUndefined(opts.assetCode) || !BaseOperation.isValidAsset(opts.assetCode)) {
                    throw new Error("opts.assetCode is invalid");
                }
                rawLimitsCreateDetails.assetCode = opts.assetCode;

                if (isUndefined(opts.isConvertNeeded)) {
                    throw new Error("opts.isConvertNeeded cannot be empty");
                }
                rawLimitsCreateDetails.isConvertNeeded = opts.isConvertNeeded;

                rawLimitsCreateDetails.dailyOut = BaseOperation._toUnsignedXDRAmount(opts.dailyOut);
                rawLimitsCreateDetails.weeklyOut = BaseOperation._toUnsignedXDRAmount(opts.weeklyOut);
                rawLimitsCreateDetails.monthlyOut = BaseOperation._toUnsignedXDRAmount(opts.monthlyOut);
                rawLimitsCreateDetails.annualOut = BaseOperation._toUnsignedXDRAmount(opts.annualOut);

                var limitsCreateDetails = new xdr.LimitsCreateDetails(rawLimitsCreateDetails);

                var manageLimitsOp = new xdr.ManageLimitsOp({
                    details: new xdr.ManageLimitsOpDetails.create(limitsCreateDetails),
                    ext: new xdr.ManageLimitsOpExt(xdr.LedgerVersion.emptyVersion()) });

                var opAttrs = {};
                opAttrs.body = xdr.OperationBody.manageLimit(manageLimitsOp);
                BaseOperation.setSourceAccount(opAttrs, opts);
                return new xdr.Operation(opAttrs);
            }
        },
        removeLimits: {

            /**
             * Delete limits by given id
             * @param {object} opts
             * @param {number|string} opts.id - limits to remove id
             */

            value: function removeLimits(opts) {
                if (isUndefined(opts.id)) {
                    throw new Error("opts.id cannot be empty");
                }

                var manageLimitsOp = new xdr.ManageLimitsOp({
                    details: new xdr.ManageLimitsOpDetails.remove(UnsignedHyper.fromString(opts.id)),
                    ext: new xdr.ManageLimitsOpExt(xdr.LedgerVersion.emptyVersion()) });

                var opAttrs = {};
                opAttrs.body = xdr.OperationBody.manageLimit(manageLimitsOp);
                BaseOperation.setSourceAccount(opAttrs, opts);
                return new xdr.Operation(opAttrs);
            }
        },
        manageLimitsOpToObject: {
            value: function manageLimitsOpToObject(result, attrs) {
                switch (attrs.details()["switch"]()) {
                    case xdr.ManageLimitsAction.create():
                        {
                            var details = attrs.details().limitsCreateDetails();
                            if (details.accountId()) {
                                result.account = BaseOperation.accountIdtoAddress(details.accountId());
                            }
                            if (details.accountType()) {
                                result.accountType = details.accountType().value;
                            }

                            result.statsOpType = details.statsOpType().value;
                            result.assetCode = details.assetCode();
                            result.isConvertNeeded = details.isConvertNeeded();
                            result.dailyOut = BaseOperation._fromXDRAmount(details.dailyOut());
                            result.weeklyOut = BaseOperation._fromXDRAmount(details.weeklyOut());
                            result.monthlyOut = BaseOperation._fromXDRAmount(details.monthlyOut());
                            result.annualOut = BaseOperation._fromXDRAmount(details.annualOut());

                            break;
                        }
                    case xdr.ManageLimitsAction.remove():
                        {
                            result.id = attrs.details().id().toString();
                            break;
                        }
                }
            }
        }
    });

    return ManageLimitsBuilder;
})();
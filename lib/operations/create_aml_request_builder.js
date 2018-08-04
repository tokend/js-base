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

var CreateAMLRequestBuilder = exports.CreateAMLRequestBuilder = (function () {
    function CreateAMLRequestBuilder() {
        _classCallCheck(this, CreateAMLRequestBuilder);
    }

    _createClass(CreateAMLRequestBuilder, null, {
        createAMLAlert: {

            /**
             * Creates operation to create aml alert
             * @param {object} opts
             *
             * @param {string} opts.balanceID - balance for which specified amount will be locked
             * @param {string} opts.amount - amount to be locked
             * @param {string} opts.reason - reason due to which alert was raised
             * @param {string} opts.reference - Unique reference of the alert
             * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
             *
             * @returns {xdr.CreateAMLAlertRequestOp}
             */

            value: function createAMLAlert(opts) {
                var rawRequest = {};
                if (!BaseOperation.isValidAmount(opts.amount)) {
                    throw new Error("opts.amount is invalid");
                }

                rawRequest.amount = BaseOperation._toUnsignedXDRAmount(opts.amount);

                if (!Keypair.isValidBalanceKey(opts.balanceID)) {
                    throw new Error("opts.balanceID is invalid");
                }

                rawRequest.balanceId = Keypair.fromBalanceId(opts.balanceID).xdrBalanceId();
                rawRequest.reason = opts.reason;
                rawRequest.ext = new xdr.AmlAlertRequestExt(xdr.LedgerVersion.emptyVersion());
                var request = new xdr.AmlAlertRequest(rawRequest);

                if (isUndefined(opts.reference)) {
                    throw new Error("opts.reference is invalid");
                }

                var opAttributes = {};
                opAttributes.body = new xdr.OperationBody.createAmlAlert(new xdr.CreateAmlAlertRequestOp({
                    amlAlertRequest: request,
                    reference: opts.reference,
                    ext: new xdr.CreateAmlAlertRequestOpExt(xdr.LedgerVersion.emptyVersion()) }));
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        createAmlAlertToObject: {
            value: function createAmlAlertToObject(result, attrs) {
                result.balanceID = BaseOperation.balanceIdtoString(attrs.amlAlertRequest().balanceId());
                result.amount = BaseOperation._fromXDRAmount(attrs.amlAlertRequest().amount());
                result.reason = attrs.amlAlertRequest().reason().toString();
                result.reference = attrs.reference().toString();
            }
        }
    });

    return CreateAMLRequestBuilder;
})();
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

var CreateIssuanceRequestBuilder = exports.CreateIssuanceRequestBuilder = (function () {
    function CreateIssuanceRequestBuilder() {
        _classCallCheck(this, CreateIssuanceRequestBuilder);
    }

    _createClass(CreateIssuanceRequestBuilder, null, {
        createIssuanceRequest: {

            /**
             * Creates operation to create issuance request
             * @param {object} opts
             * @param {string} opts.asset - asset to be issued
             * @param {string} opts.amount - amount to be issued
             * @param {string} opts.receiver - balance ID of the receiver
             * @param {string} opts.reference - Reference of the request
             * @param {object} opts.externalDetails - External details needed for PSIM to process withdraw operation
             * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
             * @returns {xdr.CreateIssuanceRequestOp}
             */

            value: function createIssuanceRequest(opts) {
                var attrs = {};
                if (!BaseOperation.isValidAsset(opts.asset)) {
                    throw new Error("opts.asset is invalid");
                }

                attrs.asset = opts.asset;

                if (!BaseOperation.isValidAmount(opts.amount)) {
                    throw new Error("opts.amount is invalid");
                }

                attrs.amount = BaseOperation._toUnsignedXDRAmount(opts.amount);

                if (!Keypair.isValidBalanceKey(opts.receiver)) {
                    throw new Error("receiver is invalid");
                }

                attrs.receiver = Keypair.fromBalanceId(opts.receiver).xdrBalanceId();

                if (!BaseOperation.isValidString(opts.reference, 1, 64)) {
                    throw new Error("opts.reference is invalid");
                }

                if (isUndefined(opts.externalDetails)) {
                    throw new Error("externalDetails is invalid");
                }

                attrs.externalDetails = JSON.stringify(opts.externalDetails);

                var fee = {
                    fixed: "0",
                    percent: "0"
                };
                attrs.fee = BaseOperation.feeToXdr(fee);

                attrs.ext = new xdr.IssuanceRequestExt(xdr.LedgerVersion.emptyVersion());
                var request = new xdr.IssuanceRequest(attrs);
                var issuanceRequestOp = new xdr.CreateIssuanceRequestOp({
                    request: request,
                    reference: opts.reference,
                    externalDetails: request.externalDetails(),
                    ext: new xdr.CreateIssuanceRequestOpExt(xdr.LedgerVersion.emptyVersion())
                });
                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.createIssuanceRequest(issuanceRequestOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        createIssuanceRequestOpToObject: {
            value: function createIssuanceRequestOpToObject(result, attrs) {
                result.reference = attrs.reference();
                var request = attrs.request();
                result.asset = request.asset();
                result.amount = BaseOperation._fromXDRAmount(request.amount());
                result.receiver = BaseOperation.balanceIdtoString(request.receiver());
                result.externalDetails = JSON.parse(request.externalDetails());
            }
        }
    });

    return CreateIssuanceRequestBuilder;
})();
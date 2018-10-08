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

var ManageInvoiceRequestBuilder = exports.ManageInvoiceRequestBuilder = (function () {
    function ManageInvoiceRequestBuilder() {
        _classCallCheck(this, ManageInvoiceRequestBuilder);
    }

    _createClass(ManageInvoiceRequestBuilder, null, {
        createInvoiceRequest: {

            /**
             * Create invoice request
             * @param {object} opts
             * @param {string} opts.sender - payer account
             * @param {string} opts.asset - invoice asset
             * @param {string} opts.amount - invoice amount
             * @param {object} opts.details - invoice details
             * @param {string} [opts.contractID] - contract to which invoice will be attached
             * @param {string} [opts.source] - The source account for the invoice request. Defaults to the transaction's source account.
             * @returns {xdr.ManageInvoiceRequestOp}
             */

            value: function createInvoiceRequest(opts) {
                var invoiceRequestAttr = {
                    ext: new xdr.InvoiceCreationRequestExt(xdr.LedgerVersion.emptyVersion()),
                    details: JSON.stringify(opts.details) };
                if (!Keypair.isValidPublicKey(opts.sender)) {
                    throw new Error("sender is invalid");
                }
                if (!BaseOperation.isValidAsset(opts.asset)) {
                    throw new Error("receiverBalance is invalid");
                }
                if (!BaseOperation.isValidAmount(opts.amount)) {
                    throw new TypeError("amount argument must be of type String and represent a positive number");
                }
                invoiceRequestAttr.amount = BaseOperation._toUnsignedXDRAmount(opts.amount);
                invoiceRequestAttr.sender = Keypair.fromAccountId(opts.sender).xdrAccountId();
                invoiceRequestAttr.asset = opts.asset;

                if (!isUndefined(opts.contractID)) {
                    invoiceRequestAttr.contractId = UnsignedHyper.fromString(opts.contractID);
                }

                var invoiceRequest = new xdr.InvoiceCreationRequest(invoiceRequestAttr);

                var details = new xdr.ManageInvoiceRequestOpDetails.create(invoiceRequest);

                return ManageInvoiceRequestBuilder.manageInvoiceRequest(details, opts);
            }
        },
        removeInvoiceRequest: {

            /**
             * Remove invoice request
             * @param {object} opts
             * @param {string} opts.requestId - invoice request id to remove
             * @param {string} [opts.source] - The source account for the invoice request. Defaults to the transaction's source account.
             * @returns {xdr.ManageInvoiceRequestOp}
             */

            value: function removeInvoiceRequest(opts) {
                var requestId = UnsignedHyper.fromString(opts.requestId);
                var details = xdr.ManageInvoiceRequestOpDetails.remove(requestId);

                return ManageInvoiceRequestBuilder.manageInvoiceRequest(details, opts);
            }
        },
        manageInvoiceRequest: {
            value: function manageInvoiceRequest(details, opts) {
                var manageInvoiceRequestOp = new xdr.ManageInvoiceRequestOp({
                    details: details,
                    ext: new xdr.ManageInvoiceRequestOpExt(xdr.LedgerVersion.emptyVersion()) });

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.manageInvoiceRequest(manageInvoiceRequestOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        manageInvoiceRequestOpToObject: {
            value: function manageInvoiceRequestOpToObject(result, attrs) {
                switch (attrs.details()["switch"]()) {
                    case xdr.ManageInvoiceRequestAction.create():
                        {
                            var invoiceRequest = attrs.details().invoiceRequest();

                            result.sender = BaseOperation.accountIdtoAddress(invoiceRequest.sender());
                            result.asset = invoiceRequest.asset();
                            result.amount = BaseOperation._fromXDRAmount(invoiceRequest.amount());
                            result.details = JSON.parse(invoiceRequest.details());
                            if (!isUndefined(invoiceRequest.contractId())) {
                                result.contractID = invoiceRequest.contractId().toString();
                            }
                            break;
                        }
                    case xdr.ManageInvoiceRequestAction.remove():
                        {
                            result.requestId = attrs.details().requestId().toString();
                            break;
                        }
                }
            }
        }
    });

    return ManageInvoiceRequestBuilder;
})();
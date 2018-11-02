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

var ManageContractRequestBuilder = exports.ManageContractRequestBuilder = (function () {
    function ManageContractRequestBuilder() {
        _classCallCheck(this, ManageContractRequestBuilder);
    }

    _createClass(ManageContractRequestBuilder, null, {
        createContractRequest: {

            /**
             * Create contract request
             * @param {object} opts
             * @param {string} opts.customer - contract customer
             * @param {string} opts.escrow - contract escrow
             * @param {string} opts.startTime - contract start time
             * @param {string} opts.endTime - contract end time
             * @param {object} opts.details - contract details
             * @param {string} [opts.source] - The source account for the contract request. Defaults to the transaction's source account.
             * @returns {xdr.ManageContractRequestOp}
             */

            value: function createContractRequest(opts) {
                var contractRequestAttr = {
                    ext: new xdr.ContractRequestExt(xdr.LedgerVersion.emptyVersion()),
                    details: JSON.stringify(opts.details) };
                if (!Keypair.isValidPublicKey(opts.customer)) {
                    throw new Error("customer is invalid");
                }
                if (!Keypair.isValidPublicKey(opts.escrow)) {
                    throw new Error("escrow is invalid");
                }
                if (isUndefined(opts.startTime)) {
                    throw new Error("opts.startTime is invalid");
                }
                if (isUndefined(opts.endTime)) {
                    throw new Error("opts.endTime is invalid");
                }
                contractRequestAttr.startTime = UnsignedHyper.fromString(opts.startTime);
                contractRequestAttr.endTime = UnsignedHyper.fromString(opts.endTime);
                contractRequestAttr.customer = Keypair.fromAccountId(opts.customer).xdrAccountId();
                contractRequestAttr.escrow = Keypair.fromAccountId(opts.escrow).xdrAccountId();

                var contractRequest = new xdr.ContractRequest(contractRequestAttr);

                var details = new xdr.ManageContractRequestOpDetails.create(contractRequest);

                return ManageContractRequestBuilder.manageContractRequest(details, opts);
            }
        },
        removeContractRequest: {

            /**
             * Remove contract request
             * @param {object} opts
             * @param {string} opts.requestId - contract request id to remove
             * @param {string} [opts.source] - The source account for the contract request. Defaults to the transaction's source account.
             * @returns {xdr.ManageContractRequestOp}
             */

            value: function removeContractRequest(opts) {
                var requestId = UnsignedHyper.fromString(opts.requestId);
                var details = xdr.ManageContractRequestOpDetails.remove(requestId);

                return ManageContractRequestBuilder.manageContractRequest(details, opts);
            }
        },
        manageContractRequest: {
            value: function manageContractRequest(details, opts) {
                var manageContractRequestOp = new xdr.ManageContractRequestOp({
                    details: details,
                    ext: new xdr.ManageContractRequestOpExt(xdr.LedgerVersion.emptyVersion()) });

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.manageContractRequest(manageContractRequestOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        manageContractRequestOpToObject: {
            value: function manageContractRequestOpToObject(result, attrs) {
                switch (attrs.details()["switch"]()) {
                    case xdr.ManageContractRequestAction.create():
                        {
                            var contractRequest = attrs.details().contractRequest();

                            result.customer = BaseOperation.accountIdtoAddress(contractRequest.customer());
                            result.escrow = BaseOperation.accountIdtoAddress(contractRequest.escrow());
                            result.startTime = contractRequest.startTime().toString();
                            result.endTime = contractRequest.endTime().toString();
                            result.details = JSON.parse(contractRequest.details());
                            break;
                        }
                    case xdr.ManageContractRequestAction.remove():
                        {
                            result.requestId = attrs.details().requestId().toString();
                            break;
                        }
                }
            }
        }
    });

    return ManageContractRequestBuilder;
})();
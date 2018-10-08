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

var ManageContractBuilder = exports.ManageContractBuilder = (function () {
    function ManageContractBuilder() {
        _classCallCheck(this, ManageContractBuilder);
    }

    _createClass(ManageContractBuilder, null, {
        addDetails: {

            /**
             * Add contract details
             * @param {object} opts
             * @param {string} opts.contractID - contract id
             * @param {object} opts.details - contract details
             * @param {string} [opts.source] - The source account for the manage contract. Defaults to the transaction's source account.
             * @returns {xdr.ManageContractOp}
             */

            value: function addDetails(opts) {
                var details = xdr.ManageContractOpData.addDetail(JSON.stringify(opts.details));

                return ManageContractBuilder.manageContract(details, opts);
            }
        },
        confirmCompleted: {

            /**
             * Confirm completed
             * @param {object} opts
             * @param {string} opts.contractID - contract id
             * @param {string} [opts.source] - The source account for the confirm contract. Defaults to the transaction's source account.
             * @returns {xdr.ManageContractOp}
             */

            value: function confirmCompleted(opts) {
                var details = new xdr.ManageContractOpData(xdr.ManageContractAction.confirmCompleted());

                return ManageContractBuilder.manageContract(details, opts);
            }
        },
        startDispute: {

            /**
             * Start dispute
             * @param {object} opts
             * @param {string} opts.contractID - contract id
             * @param {object} opts.disputeReason - contract disputeReason
             * @param {string} [opts.source] - The source account for the manage contract. Defaults to the transaction's source account.
             * @returns {xdr.ManageContractOp}
             */

            value: function startDispute(opts) {
                var details = xdr.ManageContractOpData.startDispute(JSON.stringify(opts.disputeReason));

                return ManageContractBuilder.manageContract(details, opts);
            }
        },
        resolveDispute: {

            /**
             * Resolve dispute
             * @param {object} opts
             * @param {string} opts.contractID - contract id
             * @param {boolean} opts.isRevert - if true all invoice payment will be reverted
             * @param {string} [opts.source] - The source account for the confirm contract. Defaults to the transaction's source account.
             * @returns {xdr.ManageContractOp}
             */

            value: function resolveDispute(opts) {
                if (typeof opts.isRevert !== "boolean") {
                    throw new Error("isRevert must be boolean");
                }
                var details = xdr.ManageContractOpData.resolveDispute(opts.isRevert);

                return ManageContractBuilder.manageContract(details, opts);
            }
        },
        manageContract: {
            value: function manageContract(data, opts) {
                var manageContractOp = new xdr.ManageContractOp({
                    contractId: UnsignedHyper.fromString(opts.contractID),
                    data: data,
                    ext: new xdr.ManageContractOpExt(xdr.LedgerVersion.emptyVersion()) });

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.manageContract(manageContractOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        manageContractOpToObject: {
            value: function manageContractOpToObject(result, attrs) {
                result.contractID = attrs.contractId().toString();
                switch (attrs.data()["switch"]()) {
                    case xdr.ManageContractAction.addDetail():
                        {
                            result.details = JSON.parse(attrs.data().details());
                            break;
                        }
                    case xdr.ManageContractAction.confirmCompleted():
                        {
                            break;
                        }
                    case xdr.ManageContractAction.startDispute():
                        {
                            result.disputeReason = JSON.parse(attrs.data().disputeReason());
                            break;
                        }
                    case xdr.ManageContractAction.resolveDispute():
                        {
                            result.isRevert = attrs.data().isRevert();
                            break;
                        }
                }
            }
        }
    });

    return ManageContractBuilder;
})();
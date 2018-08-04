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

var CreateUpdateKYCRequestBuilder = exports.CreateUpdateKYCRequestBuilder = (function () {
    function CreateUpdateKYCRequestBuilder() {
        _classCallCheck(this, CreateUpdateKYCRequestBuilder);
    }

    _createClass(CreateUpdateKYCRequestBuilder, null, {
        createUpdateKYCRequest: {
            /**
             * Creates operation to create KYC request
             * @param {object} opts
             * @param {number|string} opts.requestID - set to zero to create new request
             * @param {string} opts.accountToUpdateKYC
             * @param {string} opts.accountTypeToSet
             * @param {number} opts.kycLevelToSet
             * @param {object} opts.kycData
             * @param {number|string} opts.allTasks
             * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
             * @returns {xdr.CreateUpdateKycRequestOp}
             */

            value: function createUpdateKYCRequest(opts) {
                var attrs = {};

                if (isUndefined(opts.requestID)) {
                    throw new Error("opts.requestID is invalid");
                }

                if (!Keypair.isValidPublicKey(opts.accountToUpdateKYC)) {
                    throw new Error("opts.accountToUpdateKYC is invalid");
                }

                attrs.accountToUpdateKyc = Keypair.fromAccountId(opts.accountToUpdateKYC).xdrAccountId();
                attrs.accountTypeToSet = BaseOperation._accountTypeFromNumber(opts.accountTypeToSet);
                attrs.kycLevelToSet = opts.kycLevelToSet;
                attrs.kycData = JSON.stringify(opts.kycData);
                attrs.allTasks = BaseOperation._checkUnsignedIntValue("allTasks", opts.allTasks);
                attrs.ext = new xdr.UpdateKycRequestDataExt(xdr.LedgerVersion.emptyVersion());

                var updateKYCRequestData = new xdr.UpdateKycRequestData(attrs);

                var kycRequestOp = new xdr.CreateUpdateKycRequestOp({
                    requestId: UnsignedHyper.fromString(opts.requestID),
                    updateKycRequestData: updateKYCRequestData,
                    ext: new xdr.CreateUpdateKycRequestOpExt(xdr.LedgerVersion.emptyVersion()) });
                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.createKycRequest(kycRequestOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        createUpdateKYCRequestOpToObject: {
            value: function createUpdateKYCRequestOpToObject(result, attrs) {
                result.requestID = attrs.requestId;
                result.accountToUpdateKYC = BaseOperation.accountIdtoAddress(attrs.updateKycRequestData().accountToUpdateKyc());
                result.accountTypeToSet = attrs.updateKycRequestData().accountTypeToSet().value;
                result.kycLevelToSet = attrs.updateKycRequestData().kycLevelToSet();
                result.kycData = JSON.parse(attrs.updateKycRequestData().kycData());
                result.allTasks = attrs.updateKycRequestData().allTasks();
            }
        }
    });

    return CreateUpdateKYCRequestBuilder;
})();
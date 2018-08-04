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

var Hasher = require("../util/hasher").Hasher;

var PreIssuanceRequest = require("../pre_issuance_request").PreIssuanceRequest;

var PreIssuanceRequestOpBuilder = exports.PreIssuanceRequestOpBuilder = (function () {
    function PreIssuanceRequestOpBuilder() {
        _classCallCheck(this, PreIssuanceRequestOpBuilder);
    }

    _createClass(PreIssuanceRequestOpBuilder, null, {
        createPreIssuanceRequestOp: {

            /**
             * Creates operation to review reviewable request
             * @param {object} opts
             * @param {xdr.PreIssuanceRequest} opts.request - signed pre issuance request
             * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
             * @returns {xdr.ManageAssetOp}
             */

            value: function createPreIssuanceRequestOp(opts) {
                var attrs = {};
                attrs.request = opts.request;
                attrs.ext = new xdr.CreatePreIssuanceRequestOpExt(xdr.LedgerVersion.emptyVersion());

                var preIssuanceRequestOp = new xdr.CreatePreIssuanceRequestOp(attrs);
                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.createPreissuanceRequest(preIssuanceRequestOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        preIssuanceRequestOpToObject: {
            value: function preIssuanceRequestOpToObject(result, attrs) {
                result.request = PreIssuanceRequest.dataFromXdr(attrs.request());
            }
        }
    });

    return PreIssuanceRequestOpBuilder;
})();
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

var _jsXdr = require("js-xdr");

var UnsignedHyper = _jsXdr.UnsignedHyper;
var Hyper = _jsXdr.Hyper;

var CreateManageLimitsRequestBuilder = exports.CreateManageLimitsRequestBuilder = (function () {
    function CreateManageLimitsRequestBuilder() {
        _classCallCheck(this, CreateManageLimitsRequestBuilder);
    }

    _createClass(CreateManageLimitsRequestBuilder, null, {
        createManageLimitsRequest: {
            /**
             * Creates limits update request
             * @param {object} opts
             * @param {object} opts.details - details to review
             * @param {string|number} opts.requestID - if 0 - create request, else - update existing request
             * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
             * @returns {xdr.CreateManageLimitsRequestOp}
             */

            value: function createManageLimitsRequest(opts) {
                if (isUndefined(opts.details)) {
                    throw new Error("opts.details is not defined");
                }

                if (isUndefined(opts.requestID)) {
                    throw new Error("opts.requestID is not defined");
                }

                var limitsUpdateRequest = new xdr.LimitsUpdateRequest({
                    deprecatedDocumentHash: new Buffer(32),
                    ext: new xdr.LimitsUpdateRequestExt.limitsUpdateRequestDeprecatedDocumentHash(JSON.stringify(opts.details)) });

                var createManageLimitsRequestOp = new xdr.CreateManageLimitsRequestOp({
                    manageLimitsRequest: limitsUpdateRequest,
                    ext: new xdr.CreateManageLimitsRequestOpExt.allowToUpdateAndRejectLimitsUpdateRequest(UnsignedHyper.fromString(opts.requestID)) });

                var opAttrs = {};
                opAttrs.body = xdr.OperationBody.createManageLimitsRequest(createManageLimitsRequestOp);
                BaseOperation.setSourceAccount(opAttrs, opts);
                return new xdr.Operation(opAttrs);
            }
        },
        createManageLimitsRequestToObject: {
            value: function createManageLimitsRequestToObject(result, attrs) {
                result.details = JSON.parse(attrs.manageLimitsRequest().ext().details());
                result.requestID = attrs.ext().requestId().toString();
            }
        }
    });

    return CreateManageLimitsRequestBuilder;
})();
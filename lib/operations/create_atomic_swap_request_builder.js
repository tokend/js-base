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

var CreateAtomicSwapRequestBuilder = exports.CreateAtomicSwapRequestBuilder = (function () {
    function CreateAtomicSwapRequestBuilder() {
        _classCallCheck(this, CreateAtomicSwapRequestBuilder);
    }

    _createClass(CreateAtomicSwapRequestBuilder, null, {
        createASwapRequest: {

            /**
             * Creates atomic swap request
             * @param {object} opts
             *
             * @param {string} opts.bidID - id of bid for which request will be created.
             * @param {string} opts.baseAmount - amount which will be bought
             * @param {string} opts.quoteAsset - accepted assets
             * @param {string} [opts.source] - The source account for the operation.
             * Defaults to the transaction's source account.
             *
             * @returns {xdr.CreateASwapRequestOp}
             */

            value: function createASwapRequest(opts) {
                var rawRequest = {};
                if (!BaseOperation.isValidAmount(opts.baseAmount)) {
                    throw new Error("opts.amount is invalid");
                }
                rawRequest.baseAmount = BaseOperation._toUnsignedXDRAmount(opts.baseAmount);

                if (!BaseOperation.isValidAsset(opts.quoteAsset)) {
                    throw new Error("opts.quoteAssets is invalid");
                }
                rawRequest.quoteAsset = opts.quoteAsset;

                rawRequest.bidId = UnsignedHyper.fromString(opts.bidID);
                rawRequest.ext = new xdr.ASwapRequestExt(xdr.LedgerVersion.emptyVersion());

                var opAttributes = {};
                opAttributes.body = new xdr.OperationBody.createAswapRequest(new xdr.CreateASwapRequestOp({
                    request: new xdr.ASwapRequest(rawRequest),
                    ext: new xdr.CreateASwapRequestOpExt(xdr.LedgerVersion.emptyVersion()) }));

                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        createASwapRequestToObject: {
            value: function createASwapRequestToObject(result, attrs) {
                result.bidID = attrs.request().bidId().toString();
                result.baseAmount = BaseOperation._fromXDRAmount(attrs.request().baseAmount());
                result.quoteAsset = attrs.request().quoteAsset();
            }
        }
    });

    return CreateAtomicSwapRequestBuilder;
})();
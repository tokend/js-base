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

var CreateAtomicSwapBidCreationRequestBuilder = exports.CreateAtomicSwapBidCreationRequestBuilder = (function () {
    function CreateAtomicSwapBidCreationRequestBuilder() {
        _classCallCheck(this, CreateAtomicSwapBidCreationRequestBuilder);
    }

    _createClass(CreateAtomicSwapBidCreationRequestBuilder, null, {
        createASwapBidCreationRequest: {

            /**
             * Creates atomic swap bid creation request
             * @param {object} opts
             *
             * @param {string} opts.balanceID - balance from which specified amount
             * will be used in atomic swap
             * @param {string} opts.amount - amount which will used in swap (will be locked)
             * @param {string} opts.fee - fee for atomic swap bid
             * @param {object} opts.details - details about atomic swap bid
             * @param {array} opts.quoteAssets - accepted assets
             * @param {object} opts.quoteAssets.price - price for 1 baseAsset in terms of quote asset
             * @param {object} opts.quoteAssets.asset - asset code of the quote asset
             * @param {string} [opts.source] - The source account for the operation.
             * Defaults to the transaction's source account.
             *
             * @returns {xdr.CreateASwapBidCreationRequestOp}
             */

            value: function createASwapBidCreationRequest(opts) {
                var rawRequest = {};
                if (!BaseOperation.isValidAmount(opts.amount)) {
                    throw new Error("opts.amount is invalid");
                }
                rawRequest.amount = BaseOperation._toUnsignedXDRAmount(opts.amount);

                if (!Keypair.isValidBalanceKey(opts.balanceID)) {
                    throw new Error("opts.balanceID is invalid");
                }
                rawRequest.baseBalance = Keypair.fromBalanceId(opts.balanceID).xdrBalanceId();

                if (isUndefined(opts.quoteAssets) || opts.quoteAssets.length === 0) {
                    throw new Error("opts.quoteAssets is invalid");
                }

                rawRequest.quoteAssets = [];
                for (var i = 0; i < opts.quoteAssets.length; i++) {
                    var quoteAsset = opts.quoteAssets[i];

                    if (!BaseOperation.isValidAmount(quoteAsset.price)) {
                        throw new Error("opts.quoteAssets[" + i + "].price is invalid: " + quoteAsset.price);
                    }

                    if (!BaseOperation.isValidAsset(quoteAsset.asset)) {
                        throw new Error("opts.quoteAssets[i].asset is invalid");
                    }

                    rawRequest.quoteAssets.push(new xdr.ASwapBidQuoteAsset({
                        price: BaseOperation._toUnsignedXDRAmount(quoteAsset.price),
                        quoteAsset: quoteAsset.asset,
                        ext: new xdr.ASwapBidQuoteAssetExt(xdr.LedgerVersion.emptyVersion()) }));
                }

                rawRequest.details = JSON.stringify(opts.details);
                rawRequest.ext = new xdr.ASwapBidCreationRequestExt(xdr.LedgerVersion.emptyVersion());

                var opAttributes = {};
                opAttributes.body = new xdr.OperationBody.createAswapBidRequest(new xdr.CreateASwapBidCreationRequestOp({
                    request: new xdr.ASwapBidCreationRequest(rawRequest),
                    ext: new xdr.CreateASwapBidCreationRequestOpExt(xdr.LedgerVersion.emptyVersion()) }));

                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        createASwapBidCreationRequestToObject: {
            value: function createASwapBidCreationRequestToObject(result, attrs) {
                result.balanceID = BaseOperation.balanceIdtoString(attrs.request().baseBalance());
                result.amount = BaseOperation._fromXDRAmount(attrs.request().amount());
                result.details = JSON.parse(attrs.request().details());
                result.quoteAssets = [];
                var rawQuoteAssets = attrs.request().quoteAssets();
                for (var i = 0; i < rawQuoteAssets.length; i++) {
                    result.quoteAssets.push({
                        price: BaseOperation._fromXDRAmount(rawQuoteAssets[i].price()),
                        asset: rawQuoteAssets[i].quoteAsset() });
                }
            }
        }
    });

    return CreateAtomicSwapBidCreationRequestBuilder;
})();
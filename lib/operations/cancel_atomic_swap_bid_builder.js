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

var CancelAtomicSwapBidBuilder = exports.CancelAtomicSwapBidBuilder = (function () {
    function CancelAtomicSwapBidBuilder() {
        _classCallCheck(this, CancelAtomicSwapBidBuilder);
    }

    _createClass(CancelAtomicSwapBidBuilder, null, {
        cancelASwapBid: {

            /**
             * Cancel atomic swap bid
             * @param {object} opts
             * @param {string} opts.bidID - id of bid which will be canceled.
             * @param {string} [opts.source] - The source account for the operation.
             * Defaults to the transaction's source account.
             *
             * @returns {xdr.CancelASwapBidOp}
             */

            value: function cancelASwapBid(opts) {
                var opAttributes = {};
                opAttributes.body = new xdr.OperationBody.cancelAswapBid(new xdr.CancelASwapBidOp({
                    bidId: UnsignedHyper.fromString(opts.bidID),
                    ext: new xdr.CancelASwapBidOpExt(xdr.LedgerVersion.emptyVersion()) }));

                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        cancelASwapBidToObject: {
            value: function cancelASwapBidToObject(result, attrs) {
                result.bidID = attrs.bidId().toString();
            }
        }
    });

    return CancelAtomicSwapBidBuilder;
})();
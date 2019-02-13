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

var MarketOrderBuilder = exports.MarketOrderBuilder = (function () {
    function MarketOrderBuilder() {
        _classCallCheck(this, MarketOrderBuilder);
    }

    _createClass(MarketOrderBuilder, null, {
        marketOrder: {

            /**
             * Returns an XDR MarketOrder. A "market order" operation creates offers.
             * @param {object} opts
             * @param {string} opts.baseBalance
             * @param {string} opts.quoteBalance
             * @param {boolean} opts.isBuy - if true - buys base asset, false - sells base asset
             * @param {number|string} opts.amount - Amount of the base asset
             * @param {number|string} opts.orderBookID - Only 0 allowed (for now)
             * @returns {xdr.MarketOrderOp}
             */

            value: function marketOrder(opts) {
                var attributes = {
                    ext: new xdr.MarketOrderOp(xdr.LedgerVersion.emptyVersion())
                };

                if (!Keypair.isValidBalanceKey(opts.baseBalance)) {
                    throw new Error("baseBalance is invalid");
                }

                if (!Keypair.isValidBalanceKey(opts.quoteBalance)) {
                    throw new Error("quoteBalance is invalid");
                }

                if (typeof opts.isBuy !== "boolean") {
                    throw new Error("isBuy must be boolean");
                }

                if (!BaseOperation.isValidAmount(opts.amount, false)) {
                    throw new TypeError("amount argument must be of type String and represent a positive number or zero");
                }
                attributes.amount = BaseOperation._toXDRAmount(opts.amount);

                if (isUndefined(opts.orderBookID)) {
                    opts.orderBookID = "0";
                }

                attributes.orderBookId = UnsignedHyper.fromString(opts.orderBookID);
                attributes.baseBalance = Keypair.fromBalanceId(opts.baseBalance).xdrBalanceId();
                attributes.quoteBalance = Keypair.fromBalanceId(opts.quoteBalance).xdrBalanceId();
                attributes.isBuy = opts.isBuy;
                attributes.ext = new xdr.MarketOrderOpExt(xdr.LedgerVersion.emptyVersion());
                var marketOrderOp = new xdr.MarketOrderOp(attributes);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.marketOrder(marketOrderOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        marketOrderOpToObject: {
            value: function marketOrderOpToObject(result, attrs) {
                result.amount = BaseOperation._fromXDRAmount(attrs.amount());
                result.isBuy = attrs.isBuy();
                result.baseBalance = BaseOperation.balanceIdtoString(attrs.baseBalance());
                result.quoteBalance = BaseOperation.balanceIdtoString(attrs.quoteBalance());
                result.orderBookID = attrs.orderBookId().toString();
            }
        }
    });

    return MarketOrderBuilder;
})();
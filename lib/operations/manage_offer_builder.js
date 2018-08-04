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

var ManageOfferBuilder = exports.ManageOfferBuilder = (function () {
    function ManageOfferBuilder() {
        _classCallCheck(this, ManageOfferBuilder);
    }

    _createClass(ManageOfferBuilder, null, {
        manageOffer: {

            /**
             * Returns an XDR ManageOffer. A "manage offer" operations creates offer.
             * @param {object} opts
             * @param {string} opts.baseBalance
             * @param {string} opts.quoteBalance
             * @param {boolean} opts.isBuy - if true - buys base asset, false - sells base asset
             * @param {number|string} opts.amount - Amount of the base asset
             * @param {number|string} opts.price - Price of the offer
             * @param {number|string} opts.orderBookID - 0 - for secondary market, otherwise to participate in sale
             * @returns {xdr.ManageBalanceOp}
             */

            value: function manageOffer(opts) {
                var attributes = {
                    ext: new xdr.ManageOfferOpExt(xdr.LedgerVersion.emptyVersion())
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

                if (!BaseOperation.isValidAmount(opts.amount, true)) {
                    throw new TypeError("amount argument must be of type String and represent a positive number or zero");
                }
                attributes.amount = BaseOperation._toXDRAmount(opts.amount);

                if (!BaseOperation.isValidAmount(opts.price, true)) {
                    throw new TypeError("price argument must be of type String and represent a positive number or zero");
                }
                attributes.price = BaseOperation._toXDRAmount(opts.price);

                if (!BaseOperation.isValidAmount(opts.fee, true)) {
                    throw new TypeError("fee argument must be of type String and represent a positive number or zero");
                }
                attributes.fee = BaseOperation._toXDRAmount(opts.fee);

                if (isUndefined(opts.offerID)) {
                    opts.offerID = "0";
                }

                if (isUndefined(opts.orderBookID)) {
                    opts.orderBookID = "0";
                }

                attributes.offerId = UnsignedHyper.fromString(opts.offerID);
                attributes.orderBookId = UnsignedHyper.fromString(opts.orderBookID);
                attributes.baseBalance = Keypair.fromBalanceId(opts.baseBalance).xdrBalanceId();
                attributes.quoteBalance = Keypair.fromBalanceId(opts.quoteBalance).xdrBalanceId();
                attributes.isBuy = opts.isBuy;

                var manageOfferOp = new xdr.ManageOfferOp(attributes);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.manageOffer(manageOfferOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        cancelOffer: {

            /**
             * Returns an XDR ManageOffer. A "manage offer" operations deletes offer.
             * @param {object} opts
             * @param {string} opts.baseBalance
             * @param {string} opts.quoteBalance
             * @param {string} opts.price
             * @param {number|string} opts.offerID - offer id
             * @param {number|string} opts.orderBookID - 0 - for secondary market, otherwise to participate in sale
             * @returns {xdr.ManageBalanceOp}
             */

            value: function cancelOffer(opts) {
                opts.isBuy = true;
                opts.amount = "0";
                opts.fee = "0";
                opts.price = "1";
                return ManageOfferBuilder.manageOffer(opts);
            }
        },
        manageOfferOpToObject: {
            value: function manageOfferOpToObject(result, attrs) {
                result.amount = BaseOperation._fromXDRAmount(attrs.amount());
                result.price = BaseOperation._fromXDRAmount(attrs.price());
                result.fee = BaseOperation._fromXDRAmount(attrs.fee());
                result.isBuy = attrs.isBuy();
                result.baseBalance = BaseOperation.balanceIdtoString(attrs.baseBalance());
                result.quoteBalance = BaseOperation.balanceIdtoString(attrs.quoteBalance());
                result.offerID = attrs.offerId().toString();
                result.orderBookID = attrs.orderBookId().toString();
            }
        }
    });

    return ManageOfferBuilder;
})();
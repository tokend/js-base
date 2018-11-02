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

var CreateInvestmentTokenSaleParticipationBuilder = exports.CreateInvestmentTokenSaleParticipationBuilder = (function () {
    function CreateInvestmentTokenSaleParticipationBuilder() {
        _classCallCheck(this, CreateInvestmentTokenSaleParticipationBuilder);
    }

    _createClass(CreateInvestmentTokenSaleParticipationBuilder, null, {
        createITSaleParticipation: {

            /**
             * Create investment token sale participation
             * @param {object} opts
             * @param {string} opts.investmentTokenSaleID - id of sale
             * @param {string} opts.quoteBalance - id of balance from which
             * tokens will be charged
             * @param {string} opts.baseAmount - amount of tokens that will be bought
             * @param {string} [opts.source] - The source account for the operation.
             * Defaults to the transaction's source account.
             * @returns {xdr.CreateInvestmentTokenSaleParticipationOp}
             */

            value: function createITSaleParticipation(opts) {
                if (isUndefined(opts.investmentTokenSaleID)) {
                    throw new Error("Investment token sale id is undefined");
                }
                if (!Keypair.isValidBalanceKey(opts.quoteBalance)) {
                    throw new Error("Quote balance is invalid");
                }
                if (!BaseOperation.isValidAmount(opts.baseAmount, false)) {
                    throw new Error("Base amount is invalid");
                }

                var attrs = {};
                attrs.investmentTokenSaleId = UnsignedHyper.fromString(opts.investmentTokenSaleID);
                attrs.quoteBalance = Keypair.fromBalanceId(opts.quoteBalance).xdrBalanceId();
                attrs.baseAmount = BaseOperation._toUnsignedXDRAmount(opts.baseAmount);
                attrs.ext = new xdr.CreateItSaleParticipationOpExt(xdr.LedgerVersion.emptyVersion());

                var createSaleParticipationOp = new xdr.CreateItSaleParticipationOp(attrs);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.createInvestmentTokenSaleParticipation(createSaleParticipationOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        createITSaleParticipationOpToObject: {
            value: function createITSaleParticipationOpToObject(result, attrs) {
                result.investmentTokenSaleID = attrs.investmentTokenSaleId().toString();
                result.quoteBalance = BaseOperation.balanceIdtoString(attrs.quoteBalance());
                result.baseAmount = BaseOperation._fromXDRAmount(attrs.baseAmount());
            }
        }
    });

    return CreateInvestmentTokenSaleParticipationBuilder;
})();
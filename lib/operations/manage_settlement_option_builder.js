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

var ManageSettlementOptionBuilder = exports.ManageSettlementOptionBuilder = (function () {
    function ManageSettlementOptionBuilder() {
        _classCallCheck(this, ManageSettlementOptionBuilder);
    }

    _createClass(ManageSettlementOptionBuilder, null, {
        createProlongationSettlementOption: {

            /**
             * Create prolong settlement option for source tokens from investment token sale
             * @param {object} opts
             * @param {string} opts.investmentTokenSaleID - id of sale
             * @param {string} [opts.source] - The source account for the operation.
             * Defaults to the transaction's source account.
             * @returns {xdr.ManageSettlementOptionOp}
             */

            value: function createProlongationSettlementOption(opts) {
                var details = new xdr.SettlementOptionDetails.prolong();

                return ManageSettlementOptionBuilder.createSettlementOption(details, opts);
            }
        },
        createRedemptionSettlementOption: {

            /**
             * Create redeem settlement option for source tokens from investment token sale
             * @param {object} opts
             * @param {string} opts.investmentTokenSaleID - id of sale
             * @param {string} opts.redemptionAsset - asset in which redeem will be performed
             * @param {string} [opts.source] - The source account for the operation.
             * Defaults to the transaction's source account.
             * @returns {xdr.ManageSettlementOptionOp}
             */

            value: function createRedemptionSettlementOption(opts) {
                if (!BaseOperation.isValidAsset(opts.redemptionAsset)) {
                    throw new Error("Redemption asset is invalid");
                }
                var details = new xdr.SettlementOptionDetails.redeem(opts.redemptionAsset);

                return ManageSettlementOptionBuilder.createSettlementOption(details, opts);
            }
        },
        removeSettlementOption: {

            /**
             * Remove existing settlement option
             * @param {object} opts
             * @param {string} opts.settlementOptionID - if of existing settlement option
             * @param {string} [opts.source] - The source account for the operation.
             * Defaults to the transaction's source account.
             * @returns {xdr.ManageSettlementOptionOp}
             */

            value: function removeSettlementOption(opts) {
                if (isUndefined(opts.settlementOptionID)) {
                    throw new Error("settlement option id is undefined");
                }
                var data = xdr.ManageSettlementOptionOpData.remove(UnsignedHyper.fromString(opts.settlementOptionID));

                return ManageSettlementOptionBuilder.manageSettlementOption(data, opts);
            }
        },
        createSettlementOption: {

            /**
             * @private
             */

            value: function createSettlementOption(details, opts) {
                if (isUndefined(opts.investmentTokenSaleID)) {
                    throw new Error("Investment token sale id is undefined");
                }

                var creationDetails = new xdr.SettlementOptionCreationDetails({
                    details: details,
                    investmentTokenSaleId: UnsignedHyper.fromString(opts.investmentTokenSaleID),
                    ext: new xdr.SettlementOptionCreationDetailsExt(xdr.LedgerVersion.emptyVersion())
                });

                var data = new xdr.ManageSettlementOptionOpData.create(creationDetails);

                return ManageSettlementOptionBuilder.manageSettlementOption(data, opts);
            }
        },
        manageSettlementOption: {

            /**
             * @private
             */

            value: function manageSettlementOption(data, opts) {
                var manageSettlementOptionOp = new xdr.ManageSettlementOptionOp({
                    data: data,
                    ext: new xdr.ManageSettlementOptionOpExt(xdr.LedgerVersion.emptyVersion()) });

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.manageSettlementOption(manageSettlementOptionOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        manageSettlementOptionOpToObject: {
            value: function manageSettlementOptionOpToObject(result, attrs) {
                switch (attrs.data()["switch"]()) {
                    case xdr.ManageSettlementOptionAction.create():
                        {
                            var details = attrs.data().creationDetails();
                            result.investmentTokenSaleID = details.investmentTokenSaleId().toString();

                            switch (details.details()["switch"]()) {
                                case xdr.SettlementOptionAction.redeem():
                                    {
                                        result.redemptionAsset = details.details().redemptionAsset();
                                        break;
                                    }
                            }
                            break;
                        }
                    case xdr.ManageSettlementOptionAction.remove():
                        {
                            result.settlementOptionID = attrs.data().settlementOptionId().toString();
                            break;
                        }
                }
            }
        }
    });

    return ManageSettlementOptionBuilder;
})();
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

var SaleRequestBuilder = require("./sale_request_builder").SaleRequestBuilder;

var ManageSaleBuilder = exports.ManageSaleBuilder = (function () {
    function ManageSaleBuilder() {
        _classCallCheck(this, ManageSaleBuilder);
    }

    _createClass(ManageSaleBuilder, null, {
        createUpdateSaleDetailsRequest: {
            /**
             * Creates request to update manage sale details
             * @param {object} opts
             * @param {number|string} opts.requestID - set to zero to create new request
             * @param {string} opts.saleID - ID of the sale to create new update details request
             * @param {object} opts.newDetails - new sale specific details
             * @param {object} opts.newDetails.name - name of the sale
             * @param {object} opts.newDetails.short_description - short description of the sale
             * @param {object} opts.newDetails.description - sale description
             * @param {object} opts.newDetails.logo - details of the logo
             * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
             * @returns {xdr.ManageSaleOp}
             */

            value: function createUpdateSaleDetailsRequest(opts) {
                if (isUndefined(opts.requestID)) {
                    throw new Error("opts.requestID is invalid");
                }

                if (isUndefined(opts.saleID)) {
                    throw new Error("opts.saleID is invalid");
                }

                SaleRequestBuilder.validateDetail(opts.newDetails);

                var updateSaleDetailsData = new xdr.UpdateSaleDetailsData({
                    requestId: UnsignedHyper.fromString(opts.requestID),
                    newDetails: JSON.stringify(opts.newDetails),
                    ext: new xdr.UpdateSaleDetailsDataExt(xdr.LedgerVersion.emptyVersion()) });

                var manageSaleOp = new xdr.ManageSaleOp({
                    saleId: UnsignedHyper.fromString(opts.saleID),
                    data: new xdr.ManageSaleOpData.createUpdateDetailsRequest(updateSaleDetailsData),
                    ext: new xdr.ManageSaleOpExt(xdr.LedgerVersion.emptyVersion()) });

                var opAttrs = {};
                opAttrs.body = xdr.OperationBody.manageSale(manageSaleOp);
                BaseOperation.setSourceAccount(opAttrs, opts);
                return new xdr.Operation(opAttrs);
            }
        },
        cancelSale: {

            /**
             * Creates manage sale operation for cancel sale
             * @param {object} opts
             * @param {string} opts.saleID - ID of the sale to cancel
             * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
             * @returns {xdr.ManageSaleOp}
             */

            value: function cancelSale(opts) {
                if (isUndefined(opts.saleID)) {
                    throw new Error("opts.saleID is invalid");
                }

                var manageSaleOp = new xdr.ManageSaleOp({
                    saleId: UnsignedHyper.fromString(opts.saleID),
                    data: new xdr.ManageSaleOpData.cancel(),
                    ext: new xdr.ManageSaleOpExt(xdr.LedgerVersion.emptyVersion())
                });

                var opAttrs = {};
                opAttrs.body = xdr.OperationBody.manageSale(manageSaleOp);
                BaseOperation.setSourceAccount(opAttrs, opts);
                return new xdr.Operation(opAttrs);
            }
        },
        manageSaleToObject: {
            value: function manageSaleToObject(result, attrs) {
                result.saleID = attrs.saleId().toString();
                switch (attrs.data()["switch"]()) {
                    case xdr.ManageSaleAction.createUpdateDetailsRequest():
                        {
                            var data = attrs.data().updateSaleDetailsData();
                            result.requestID = data.requestId().toString();
                            result.newDetails = JSON.parse(data.newDetails());
                            break;
                        }
                }
            }
        }
    });

    return ManageSaleBuilder;
})();
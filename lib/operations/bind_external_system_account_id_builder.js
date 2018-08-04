"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var xdr = _interopRequire(require("../generated/stellar-xdr_generated"));

var BaseOperation = require("./base_operation").BaseOperation;

var _jsXdr = require("js-xdr");

var UnsignedHyper = _jsXdr.UnsignedHyper;
var Hyper = _jsXdr.Hyper;

var BindExternalSystemAccountIdBuilder = exports.BindExternalSystemAccountIdBuilder = (function () {
    function BindExternalSystemAccountIdBuilder() {
        _classCallCheck(this, BindExternalSystemAccountIdBuilder);
    }

    _createClass(BindExternalSystemAccountIdBuilder, null, {
        createBindExternalSystemAccountIdOp: {
            /**
             * Creates operation for binding external system account id
             * @param {object} opts
             *
             * @param {string} opts.externalSystemType - type of external system
             *
             * @param {string} [opts.source] - The source account for binding. Defaults to the transaction's source account.
             *
             * @returns {xdr.BindExternalSystemAccountIdOp}
             */

            value: function createBindExternalSystemAccountIdOp(opts) {
                var attrs = {};

                attrs.externalSystemType = opts.externalSystemType;
                attrs.ext = new xdr.BindExternalSystemAccountIdOpExt(xdr.LedgerVersion.emptyVersion());

                var bindExternalSystemAccountIdOp = new xdr.BindExternalSystemAccountIdOp(attrs);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.bindExternalSystemAccountId(bindExternalSystemAccountIdOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        bindExternalSystemAccountIdToObject: {
            value: function bindExternalSystemAccountIdToObject(result, attrs) {
                result.externalSystemType = attrs.externalSystemType();
            }
        }
    });

    return BindExternalSystemAccountIdBuilder;
})();
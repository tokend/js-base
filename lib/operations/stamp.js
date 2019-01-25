"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var xdr = _interopRequire(require("../generated/stellar-xdr_generated"));

var BaseOperation = require("./base_operation").BaseOperation;

var StampBuilder = exports.StampBuilder = (function () {
    function StampBuilder() {
        _classCallCheck(this, StampBuilder);
    }

    _createClass(StampBuilder, null, {
        stamp: {
            /**
            * Returns an XDR StampOp. A "stamp" operation saves latest ledger and license hashes.
            * @param {object} [opts]
            * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
            * @returns {xdr.SetOptionsOp}
            */

            value: function stamp(opts) {
                var stampOp = new xdr.StampOp({
                    ext: new xdr.StampOpExt(xdr.LedgerVersion.emptyVersion())
                });
                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.stamp(stampOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        stampToObject: {
            value: function stampToObject(result, attrs) {}
        }
    });

    return StampBuilder;
})();
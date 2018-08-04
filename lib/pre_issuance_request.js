"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Keypair = require("./keypair").Keypair;

var Operation = require("./operation").Operation;

var BaseOperation = require("./operations/base_operation").BaseOperation;

var xdr = _interopRequire(require("./generated/stellar-xdr_generated"));

var BigNumber = _interopRequire(require("bignumber.js"));

var hash = require("./hashing").hash;

var isUndefined = _interopRequire(require("lodash/isUndefined"));

var PreIssuanceRequest = exports.PreIssuanceRequest = (function () {
    function PreIssuanceRequest() {
        _classCallCheck(this, PreIssuanceRequest);
    }

    _createClass(PreIssuanceRequest, null, {
        build: {

            /**
             * Creates pre issuance request
             * @param {object} opts
             * @param {string} opts.amount - amount to be preissued
             * @param {string} opts.reference - reference of the request
             * @param {string} opts.asset - asset to be pre issued
             * @param {KeyPair} opts.keyPair - signer of the pre issued asset request
             * @returns {xdr.PreIssuanceRequest}
             */

            value: function build(opts) {
                if (!BaseOperation.isValidAmount(opts.amount, false)) {
                    throw new TypeError("amount must be of type String and represent a positive number");
                }
                if (!BaseOperation.isValidString(opts.reference, 4, 64)) {
                    throw new TypeError("reference must be 4-64 string");
                }

                if (!BaseOperation.isValidAsset(opts.asset)) {
                    throw new TypeError("asset is invalid");
                }

                if (isUndefined(opts.keyPair)) {
                    throw new TypeError("opts.keyPair is invalid");
                }

                opts.amount = BaseOperation._toUnsignedXDRAmount(opts.amount);
                var signature = opts.keyPair.signDecorated(this._getSignatureData(opts));
                return new xdr.PreIssuanceRequest({
                    reference: opts.reference,
                    amount: opts.amount,
                    asset: opts.asset,
                    signature: signature,
                    ext: new xdr.PreIssuanceRequestExt(xdr.LedgerVersion.emptyVersion()) });
            }
        },
        xdrFromData: {
            value: function xdrFromData(data) {
                return new xdr.PreIssuanceRequest({
                    reference: data.reference,
                    amount: BaseOperation._toUnsignedXDRAmount(data.amount),
                    asset: data.asset,
                    signature: data.signature
                });
            }
        },
        dataFromXdr: {
            value: function dataFromXdr(xdr) {
                var attributes = {};
                attributes.amount = BaseOperation._fromXDRAmount(xdr.amount());
                attributes.reference = xdr.reference();
                attributes.asset = xdr.asset();
                attributes.signature = xdr.signature();
                return attributes;
            }
        },
        isXdrPreIssuanceRequestSigned: {
            value: function isXdrPreIssuanceRequestSigned(attributes, keyPair) {
                var signature = attributes.signature();
                var signatureData = this._getSignatureData({
                    reference: attributes.reference(),
                    asset: attributes.asset(),
                    amount: attributes.amount() });
                return keyPair.verify(signatureData, signature.signature());
            }
        },
        _getSignatureData: {
            value: function _getSignatureData(opts) {
                if (isUndefined(opts.reference)) {
                    throw new Error("opts.reference is invalid");
                }

                if (isUndefined(opts.asset)) {
                    throw new Error("opts.asset is invalid");
                }

                var rawSignatureData = "" + opts.reference + ":" + opts.amount.toString() + ":" + opts.asset;
                return hash(rawSignatureData);
            }
        }
    });

    return PreIssuanceRequest;
})();
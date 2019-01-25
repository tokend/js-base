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

var hash = require("../hashing").hash;

var LicenseBuilder = exports.LicenseBuilder = (function () {
    function LicenseBuilder() {
        _classCallCheck(this, LicenseBuilder);
    }

    _createClass(LicenseBuilder, null, {
        licenseOp: {
            /**
             * Returns an XDR LicenseOp. A "license" operations are used for license prolongation/setting
             * @param {object} opts
             * @param {number|string} [opts.adminCount] - maximum number of admins to be set
             *                                            to be set in the system.
             * @param {number|string} [opts.dueDate] - Unix timestamp tiil which license is valid.
             * @param {string} [opts.prevLicenseHash] - full hash of previous license,
             *                                                  saved in the recent Stamp.
             * @param {string} [opts.ledgerHash] - ledger hash, saved in the recent Stamp.
             * @param {array} [opts.signatures] - Decorated signatures, by default 2 required.
             * @param {string} [opts.source] - The source account (defaults to transaction source).
             * @returns {xdr.LicenseOp}
             */

            value: function licenseOp(opts) {
                var attributes = {
                    ext: new xdr.LicenseOpExt(xdr.LedgerVersion.emptyVersion()) };

                attributes.adminCount = opts.adminCount;
                attributes.dueDate = opts.dueDate;
                attributes.prevLicenseHash = opts.prevLicenseHash;
                attributes.ledgerHash = opts.ledgerHash;
                attributes.signatures = [];
                for (var i = 0; i < opts.signatures.length; i++) {
                    attributes.signatures.push(opts.signatures[i]);
                }

                var licenseOp = new xdr.LicenseOp(attributes);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.licenseOp(licenseOp);
                BaseOperation.setSourceAccount(opAttributes, opts);
                return new xdr.Operation(opAttributes);
            }
        },
        licenseToObject: {
            value: function licenseToObject(result, attrs) {
                result.adminCount = attrs.adminCount();
                result.dueDate = attrs.dueDate();
                result.ledgerHash = attrs.ledgerHash().toString("hex");
                result.prevLicenseHash = attrs.prevLicenseHash().toString("hex");
                result.signatures = [];
                for (var i = 0; i < attrs.signatures().length; i++) {
                    result.signatures.push(attrs.signatures[i]);
                }
            }
        },
        _getSignatureData: {

            /**
             *
             * @param {object} opts
             * @param {number|string} [opts.adminCount] - maximum number of admins to be set
             *                                            to be set in the system.
             * @param {number|string} [opts.dueDate] - Unix timestamp tiil which license is valid.
             * @param {string} [opts.prevLicenseHash] - full hash of previous license,
             *                                                  saved in the recent Stamp.
             * @param {string} [opts.ledgerHash] - ledger hash, saved in the recent Stamp.
             */

            value: function _getSignatureData(opts) {
                if (isUndefined(opts.adminCount)) {
                    throw new Error("opts.adminCount is invalid");
                }

                if (isUndefined(opts.dueDate)) {
                    throw new Error("opts.dueDate is invalid");
                }
                if (isUndefined(opts.prevLicenseHash)) {
                    throw new Error("opts.prevLicenseHash is invalid");
                }
                if (isUndefined(opts.ledgerHash)) {
                    throw new Error("opts.ledgerHash is invalid");
                }

                var rawSignatureData = "" + opts.adminCount + ":" + opts.dueDate + ":" + opts.ledgerHash + ":" + opts.prevLicenseHash + ":" + opts.asset;
                return hash(rawSignatureData);
            }
        },
        signLicense: {

            /**
              * @param {array} [keys] - keys to sign license with
             */
            /**
             * @param opts
             * @param keys
             */

            value: function signLicense(opts, keys) {
                var contentHash = this._getSignatureData(opts);
                var signatures = [];
                for (var i = 0; i < attrs.signatures().length; i++) {
                    var signature = keys[i].signDecorated(contentHash);
                    signatures.push(signature);
                }

                return signatures;
            }
        },
        buildAndSign: {
            value: function buildAndSign(opts, keys) {
                var signatures = this.signLicense(opts, keys);
                var licenseOpts = {
                    adminCount: opts.adminCount,
                    dueDate: opts.dueDate,
                    ledgerHash: opts.ledgerHash,
                    prevLicenseHash: opts.prevLicenseHash,
                    signatures: signatures };

                return this.licenseOp(licenseOpts);
            }
        }
    });

    return LicenseBuilder;
})();
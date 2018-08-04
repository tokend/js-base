"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var xdr = _interopRequire(require("./generated/stellar-xdr_generated"));

var isUndefined = _interopRequire(require("lodash/isUndefined"));

var isNull = _interopRequire(require("lodash/isNull"));

var isString = _interopRequire(require("lodash/isString"));

var UnsignedHyper = require("js-xdr").UnsignedHyper;

var BigNumber = _interopRequire(require("bignumber.js"));

var Hasher = _interopRequire(require("./util/hasher"));

/**
 * `Memo` represents memos attached to transactions. Use static methods to create memos.
 *
 * @see [Transactions concept](https://www.stellar.org/developers/learn/concepts/transactions.html)
 * @class Memo
 */

var Memo = exports.Memo = (function () {
    function Memo() {
        _classCallCheck(this, Memo);
    }

    _createClass(Memo, null, {
        none: {

            /**
             * Returns an empty memo (`MEMO_NONE`).
             * @returns {xdr.Memo}
             */

            value: function none() {
                return xdr.Memo.memoNone();
            }
        },
        text: {

            /**
             * Creates and returns a `MEMO_TEXT` memo.
             * @param {string} text - memo text
             * @returns {xdr.Memo}
             */

            value: (function (_text) {
                var _textWrapper = function text(_x) {
                    return _text.apply(this, arguments);
                };

                _textWrapper.toString = function () {
                    return _text.toString();
                };

                return _textWrapper;
            })(function (text) {
                if (!isString(text)) {
                    throw new Error("Expects string type got a " + typeof text);
                }
                if (Buffer.byteLength(text, "utf8") > 28) {
                    throw new Error("Text should be <= 28 bytes. Got " + Buffer.byteLength(text, "utf8"));
                }
                return xdr.Memo.memoText(text);
            })
        },
        id: {

            /**
             * Creates and returns a `MEMO_ID` memo.
             * @param {string} id - 64-bit number represented as a string
             * @returns {xdr.Memo}
             */

            value: (function (_id) {
                var _idWrapper = function id(_x2) {
                    return _id.apply(this, arguments);
                };

                _idWrapper.toString = function () {
                    return _id.toString();
                };

                return _idWrapper;
            })(function (id) {
                var error = new Error("Expects a int64 as a string. Got " + id);

                if (!isString(id)) {
                    throw error;
                }

                var number = undefined;
                try {
                    number = new BigNumber(id);
                } catch (e) {
                    throw error;
                }

                // Infinity
                if (!number.isFinite()) {
                    throw error;
                }

                // NaN
                if (number.isNaN()) {
                    throw error;
                }

                return xdr.Memo.memoId(UnsignedHyper.fromString(id));
            })
        },
        hash: {

            /**
             * Creates and returns a `MEMO_HASH` memo.
             * @param {array|string} hash - 32 byte hash or hex encoded string
             * @returns {xdr.Memo}
             */

            value: (function (_hash) {
                var _hashWrapper = function hash(_x3) {
                    return _hash.apply(this, arguments);
                };

                _hashWrapper.toString = function () {
                    return _hash.toString();
                };

                return _hashWrapper;
            })(function (hash) {
                var error = new Error("Expects a 32 byte hash value or hex encoded string. Got " + hash);

                if (isUndefined(hash)) {
                    throw error;
                }

                if (isString(hash)) {
                    if (!/^[0-9A-Fa-f]{64}$/g.test(hash)) {
                        throw error;
                    }
                    hash = new Buffer(hash, "hex");
                }

                if (!hash.length || hash.length != 32) {
                    throw error;
                }

                return xdr.Memo.memoHash(hash);
            })
        },
        returnHash: {

            /**
             * Creates and returns a `MEMO_RETURN` memo.
             * @param {array|string} hash - 32 byte hash or hex encoded string
             * @returns {xdr.Memo}
             */

            value: function returnHash(hash) {
                var error = new Error("Expects a 32 byte hash value or hex encoded string. Got " + hash);

                if (isUndefined(hash)) {
                    throw error;
                }

                if (isString(hash)) {
                    if (!/^[0-9A-Fa-f]{64}$/g.test(hash)) {
                        throw error;
                    }
                    hash = new Buffer(hash, "hex");
                }

                if (!hash.length || hash.length != 32) {
                    throw error;
                }

                return xdr.Memo.memoReturn(hash);
            }
        }
    });

    return Memo;
})();
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var xdr = _interopRequire(require("../generated/stellar-xdr_generated"));

var isUndefined = _interopRequire(require("lodash/isUndefined"));

var isNull = _interopRequire(require("lodash/isNull"));

var isString = _interopRequire(require("lodash/isString"));

var Hasher = exports.Hasher = (function () {
    function Hasher() {
        _classCallCheck(this, Hasher);
    }

    _createClass(Hasher, null, {
        hash: {

            /**
             * Creates and returns a `xdr.Hash`.
             * @param {array|string} hash - 32 byte hash or hex encoded string
             * @returns {xdr.Hash}
             */

            value: (function (_hash) {
                var _hashWrapper = function hash(_x) {
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

                return hash;
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

    return Hasher;
})();
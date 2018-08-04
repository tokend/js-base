"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var BigNumber = _interopRequire(require("bignumber.js"));

var isString = _interopRequire(require("lodash/isString"));

var Keypair = require("./keypair").Keypair;

var decodeCheck = require("./strkey").decodeCheck;

var Account = exports.Account = (function () {
    /**
     * Create a new Account object.
     *
     * `Account` represents a single account in Stellar network and it's sequence number.
     * Account tracts the sequence number as it is used by {@link TransactionBuilder}.
     * See [Accounts](https://stellar.org/developers/learn/concepts/accounts.html) for more information about how
     * accounts work in Stellar.
     * @constructor
     * @param {string} accountId ID of the account (ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`)
     * @param {string} sequence current sequence number of the account
     */

    function Account(accountId) {
        _classCallCheck(this, Account);

        if (!Keypair.isValidPublicKey(accountId)) {
            throw new Error("accountId is invalid");
        }
        this._accountId = accountId;
    }

    _createClass(Account, {
        accountId: {

            /**
             * Returns Stellar account ID, ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`
             * @returns {string}
             */

            value: function accountId() {
                return this._accountId;
            }
        }
    }, {
        isValidAccountId: {

            /**
             * Returns true if the given accountId is a valid Stellar account ID.
             * @param {string} accountId account ID to check
             * @returns {boolean}
             * @deprecated Use {@link Keypair.isValidPublicKey}
             */

            value: function isValidAccountId(accountId) {
                console.warn("Account.isValidAccountId is deprecated. Use Keypair.isValidPublicKey.");
                try {
                    var decoded = decodeCheck("accountId", accountId);
                    if (decoded.length !== 32) {
                        return false;
                    }
                } catch (err) {
                    return false;
                }
                return true;
            }
        }
    });

    return Account;
})();
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Network = require("./network").Network;

var _signing = require("./signing");

var sign = _signing.sign;
var verify = _signing.verify;

var base58 = _interopRequireWildcard(require("./base58"));

var strkey = _interopRequireWildcard(require("./strkey"));

var xdr = _interopRequire(require("./generated/stellar-xdr_generated"));

var nacl = require("tweetnacl");

var Keypair = exports.Keypair = (function () {
  /**
   * `Keypair` represents public (and secret) keys of the account.
   *
   * Use more convenient methods to create `Keypair` object:
   * * `{@link Keypair.fromAccountId}`
   * * `{@link Keypair.fromSecret}`
   * * `{@link Keypair.random}`
   *
   * @constructor
   * @param {object} keys
   * @param {string} keys.publicKey Raw public key
   * @param {string} [keys.secretSeed] Raw secret key seed.
   */

  function Keypair(keys) {
    _classCallCheck(this, Keypair);

    this._publicKey = new Buffer(keys.publicKey);

    if (keys.secretSeed) {
      this._secretSeed = new Buffer(keys.secretSeed);
      this._secretKey = new Buffer(keys.secretKey);
    }
  }

  _createClass(Keypair, {
    xdrAccountId: {
      value: function xdrAccountId() {
        return new xdr.AccountId.keyTypeEd25519(this._publicKey);
      }
    },
    xdrBalanceId: {
      value: function xdrBalanceId() {
        return new xdr.BalanceId.keyTypeEd25519(this._publicKey);
      }
    },
    xdrPublicKey: {
      value: function xdrPublicKey() {
        return new xdr.PublicKey.keyTypeEd25519(this._publicKey);
      }
    },
    rawPublicKey: {

      /**
       * Returns raw public key
       * @returns {Buffer}
       */

      value: function rawPublicKey() {
        return this._publicKey;
      }
    },
    signatureHint: {
      value: function signatureHint() {
        var a = this.xdrAccountId().toXDR();

        return a.slice(a.length - 4);
      }
    },
    accountId: {

      /**
       * Returns account ID associated with this `Keypair` object.
       * @returns {string}
       */

      value: function accountId() {
        return strkey.encodeCheck("accountId", this._publicKey);
      }
    },
    balanceId: {
      value: function balanceId() {
        return strkey.encodeCheck("balanceId", this._publicKey);
      }
    },
    seed: {

      /**
       * @deprecated Use {@link Keypair.secret}
       * @returns {string}
       */

      value: function seed() {
        console.log("Keypair.seed() is deprecated. Use Keypair.secret().");
        return this.secret();
      }
    },
    secret: {

      /**
       * Returns secret key associated with this `Keypair` object
       * @returns {string}
       */

      value: function secret() {
        return strkey.encodeCheck("seed", this._secretSeed);
      }
    },
    rawSeed: {

      /**
       * Returns raw secret key seed.
       * @deprecated
       * @returns {Buffer}
       */

      value: function rawSeed() {
        console.log("Keypair.rawSeed() is deprecated.");
        return this._secretSeed;
      }
    },
    rawSecretKey: {

      /**
       * Returns raw secret key.
       * @returns {Buffer}
       */

      value: function rawSecretKey() {
        return this._secretKey;
      }
    },
    canSign: {

      /**
       * Returns `true` if this `Keypair` object contains secret key and can sign.
       * @returns {boolean}
       */

      value: function canSign() {
        return !!this._secretKey;
      }
    },
    sign: {

      /**
       * Signs data.
       * @param {Buffer} data Data to sign
       * @returns {Buffer}
       */

      value: (function (_sign) {
        var _signWrapper = function sign(_x) {
          return _sign.apply(this, arguments);
        };

        _signWrapper.toString = function () {
          return _sign.toString();
        };

        return _signWrapper;
      })(function (data) {
        if (!this.canSign()) {
          throw new Error("cannot sign: no secret key available");
        }

        return sign(data, this._secretKey);
      })
    },
    verify: {

      /**
       * Verifies if `signature` for `data` is valid.
       * @param {Buffer} data Signed data
       * @param {Buffer} signature Signature
       * @returns {boolean}
       */

      value: (function (_verify) {
        var _verifyWrapper = function verify(_x2, _x3) {
          return _verify.apply(this, arguments);
        };

        _verifyWrapper.toString = function () {
          return _verify.toString();
        };

        return _verifyWrapper;
      })(function (data, signature) {
        return verify(data, signature, this._publicKey);
      })
    },
    signDecorated: {
      value: function signDecorated(data) {
        var signature = this.sign(data);
        var hint = this.signatureHint();

        return new xdr.DecoratedSignature({ hint: hint, signature: signature });
      }
    }
  }, {
    fromSeed: {

      /**
       * @param {string} seed Secret key seed
       * @deprecated Use {@link Keypair.fromSecret}
       * @returns {Keypair}
       */

      value: function fromSeed(seed) {
        console.log("Keypair.fromSeed() is deprecated. Use Keypair.fromSecret().");
        return Keypair.fromSecret(seed);
      }
    },
    fromSecret: {

      /**
       * Creates a new `Keypair` instance from secret key.
       * @param {string} secretKey Secret key
       * @returns {Keypair}
       */

      value: function fromSecret(secretKey) {
        var rawSeed = strkey.decodeCheck("seed", secretKey);
        return this.fromRawSeed(rawSeed);
      }
    },
    fromBase58Seed: {

      /**
       * Base58 address encoding is **DEPRECATED**! Use this method only for transition to strkey encoding.
       * @param {string} seed Base58 secret seed
       * @deprecated Use {@link Keypair.fromSecret}
       * @returns {Keypair}
       */

      value: function fromBase58Seed(seed) {
        var rawSeed = base58.decodeBase58Check("seed", seed);
        return this.fromRawSeed(rawSeed);
      }
    },
    fromRawSeed: {

      /**
       * Creates a new `Keypair` object from secret seed raw bytes.
       *
       * @param {Buffer} rawSeed Buffer containing secret seed
       * @returns {Keypair}
       */

      value: function fromRawSeed(rawSeed) {
        rawSeed = new Buffer(rawSeed);
        var rawSeedU8 = new Uint8Array(rawSeed);
        var keys = nacl.sign.keyPair.fromSeed(rawSeedU8);
        keys.secretSeed = rawSeed;

        return new this(keys);
      }
    },
    master: {

      /**
       * Returns `Keypair` object representing network master key.
       * @returns {Keypair}
       */

      value: function master() {
        return this.fromRawSeed(Network.current().networkId());
      }
    },
    fromAccountId: {

      /**
       * Creates a new `Keypair` object from account ID.
       * @param {string} accountId account ID (ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`)
       * @returns {Keypair}
       */

      value: function fromAccountId(accountId) {
        var publicKey = strkey.decodeCheck("accountId", accountId);
        if (publicKey.length !== 32) {
          throw new Error("Invalid Stellar accountId");
        }
        return new this({ publicKey: publicKey });
      }
    },
    fromBalanceId: {
      value: function fromBalanceId(balanceId) {
        var publicKey = strkey.decodeCheck("balanceId", balanceId);
        if (publicKey.length !== 32) {
          throw new Error("Invalid Stellar balanceId");
        }
        return new this({ publicKey: publicKey });
      }
    },
    random: {

      /**
       * Create a random `Keypair` object.
       * @returns {Keypair}
       */

      value: function random() {
        var seed = nacl.randomBytes(32);
        return this.fromRawSeed(seed);
      }
    },
    isValidPublicKey: {

      /**
       * Returns true if the given Stellar public key is valid.
       * @param {string} publicKey public key to check
       * @returns {boolean}
       */

      value: function isValidPublicKey(publicKey) {
        if (publicKey && publicKey.length != 56) {
          return false;
        }

        try {
          var decoded = strkey.decodeCheck("accountId", publicKey);
          if (decoded.length !== 32) {
            return false;
          }
        } catch (err) {
          return false;
        }
        return true;
      }
    },
    isValidBalanceKey: {
      value: function isValidBalanceKey(publicKey) {
        if (publicKey && publicKey.length != 56) {
          return false;
        }

        try {
          var decoded = strkey.decodeCheck("balanceId", publicKey);
          if (decoded.length !== 32) {
            return false;
          }
        } catch (err) {
          return false;
        }
        return true;
      }
    },
    isValidSecretKey: {

      /**
       * Returns true if the given Stellar secret key is valid.
       * @param {string} secretKey secret key to check
       * @returns {boolean}
       */

      value: function isValidSecretKey(secretKey) {
        if (secretKey && secretKey.length != 56) {
          return false;
        }

        try {
          var decoded = strkey.decodeCheck("seed", secretKey);
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

  return Keypair;
})();
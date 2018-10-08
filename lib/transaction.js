"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("./index");

var xdr = _index.xdr;
var hash = _index.hash;

var encodeCheck = require("./strkey").encodeCheck;

var Operation = require("./operation").Operation;

var Network = require("./network").Network;

var map = _interopRequire(require("lodash/map"));

var each = _interopRequire(require("lodash/each"));

var MIN_LEDGER = 0;
var MAX_LEDGER = 4294967295; // max uint32

var Transaction = exports.Transaction = (function () {
    /**
    * A new Transaction object is created from a transaction envelope or via {@link TransactionBuilder}.
    * Once a Transaction has been created from an envelope, its attributes and operations
    * should not be changed. You should only add signers (using {@link Transaction#sign}) to a Transaction object before
    * submitting to the network or forwarding on to additional signers.
    * @constructor
    * @param {string|xdr.TransactionEnvelope} envelope - The transaction envelope object or base64 encoded string.
    */

    function Transaction(envelope) {
        _classCallCheck(this, Transaction);

        if (typeof envelope === "string") {
            var buffer = new Buffer(envelope, "base64");
            envelope = xdr.TransactionEnvelope.fromXDR(buffer);
        }
        // since this transaction is immutable, save the tx
        this.tx = envelope.tx();
        this.source = encodeCheck("accountId", envelope.tx().sourceAccount().ed25519());
        this.memo = this.tx.memo();
        this.salt = this.tx.salt().toString();
        var timeBounds = this.tx.timeBounds();
        this.timeBounds = {
            minTime: timeBounds.minTime().toString(),
            maxTime: timeBounds.maxTime().toString()
        };

        var operations = this.tx.operations() || [];
        this.operations = map(operations, function (op) {
            return Operation.operationToObject(op);
        });

        var signatures = envelope.signatures() || [];
        this.signatures = map(signatures, function (s) {
            return s;
        });

        var maxTotalFee = envelope.tx().ext().maxTotalFee() || 0;
        this.maxTotalFee = Operation._fromXDRAmount(maxTotalFee);
    }

    _createClass(Transaction, {
        sign: {

            /**
             * Signs the transaction with the given {@link Keypair}.
             * @param {...Keypair} keypairs Keypairs of signers
             * @returns {void}
             */

            value: function sign() {
                var _this = this;

                for (var _len = arguments.length, keypairs = Array(_len), _key = 0; _key < _len; _key++) {
                    keypairs[_key] = arguments[_key];
                }

                var txHash = this.hash();
                var newSigs = each(keypairs, function (kp) {
                    var sig = kp.signDecorated(txHash);
                    _this.signatures.push(sig);
                });
            }
        },
        hash: {

            /**
             * Returns a hash for this transaction, suitable for signing.
             * @returns {Buffer}
             */

            value: (function (_hash) {
                var _hashWrapper = function hash() {
                    return _hash.apply(this, arguments);
                };

                _hashWrapper.toString = function () {
                    return _hash.toString();
                };

                return _hashWrapper;
            })(function () {
                return hash(this.signatureBase());
            })
        },
        signatureBase: {

            /**
             * Returns the "signature base" of this transaction, which is the value
             * that, when hashed, should be signed to create a signature that
             * validators on the Stellar Network will accept.
             *
             * It is composed of a 4 prefix bytes followed by the xdr-encoded form
             * of this transaction.
             * @returns {Buffer}
             */

            value: function signatureBase() {
                return Buffer.concat([Network.current().networkId(), xdr.EnvelopeType.tx().toXDR(), this.tx.toXDR()]);
            }
        },
        toEnvelope: {

            /**
             * To envelope returns a xdr.TransactionEnvelope which can be submitted to the network.
             * @returns {xdr.TransactionEnvelope}
             */

            value: function toEnvelope() {
                var tx = this.tx;
                var signatures = this.signatures;
                var envelope = new xdr.TransactionEnvelope({ tx: tx, signatures: signatures });

                return envelope;
            }
        }
    });

    return Transaction;
})();
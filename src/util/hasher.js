import {default as xdr} from "../generated/stellar-xdr_generated";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import isString from "lodash/isString";


export class Hasher {

    /**
     * Creates and returns a `xdr.Hash`.
     * @param {array|string} hash - 32 byte hash or hex encoded string
     * @returns {xdr.Hash}
     */
    static hash(hash) {
        let error = new Error("Expects a 32 byte hash value or hex encoded string. Got " + hash);

        if (isUndefined(hash)) {
            throw error;
        }

        if (isString(hash)) {
            if (!/^[0-9A-Fa-f]{64}$/g.test(hash)) {
                throw error;
            }
            hash = new Buffer(hash, 'hex');
        }

        if (!hash.length || hash.length != 32) {
            throw error;
        }

        return hash;
    }

    /**
     * Creates and returns a `MEMO_RETURN` memo.
     * @param {array|string} hash - 32 byte hash or hex encoded string
     * @returns {xdr.Memo}
     */
    static returnHash(hash) {
        let error = new Error("Expects a 32 byte hash value or hex encoded string. Got " + hash);

        if (isUndefined(hash)) {
            throw error;
        }

        if (isString(hash)) {
            if (!/^[0-9A-Fa-f]{64}$/g.test(hash)) {
                throw error;
            }
            hash = new Buffer(hash, 'hex');
        }

        if (!hash.length || hash.length != 32) {
            throw error;
        }

        return xdr.Memo.memoReturn(hash);
    }
}

import { default as xdr } from "../generated/stellar-xdr_generated";
import isUndefined from 'lodash/isUndefined';
import { BaseOperation } from './base_operation';
import { Keypair } from "../keypair";
import { UnsignedHyper, Hyper } from "js-xdr";

export class MarketOrderBuilder {

    /**
     * Returns an XDR MarketOrder. A "market order" operation creates offers.
     * @param {object} opts
     * @param {string} opts.baseBalance
     * @param {string} opts.quoteBalance
     * @param {boolean} opts.isBuy - if true - buys base asset, false - sells base asset
     * @param {number|string} opts.amount - Amount of the base asset
     * @param {number|string} opts.orderBookID - Only 0 allowed (for now)
     * @returns {xdr.MarketOrderOp}
     */
    static marketOrder(opts) {
        let attributes = {
            ext: new xdr.MarketOrderOp(xdr.LedgerVersion.emptyVersion())
        };

        if (!Keypair.isValidBalanceKey(opts.baseBalance)) {
            throw new Error("baseBalance is invalid");
        }

        if (!Keypair.isValidBalanceKey(opts.quoteBalance)) {
            throw new Error("quoteBalance is invalid");
        }

        if (typeof (opts.isBuy) !== "boolean") {
            throw new Error("isBuy must be boolean");
        }

        if (!BaseOperation.isValidAmount(opts.amount, false)) {
            throw new TypeError('amount argument must be of type String and represent a positive number or zero');
        }
        attributes.amount = BaseOperation._toXDRAmount(opts.amount);

        if (isUndefined(opts.orderBookID)) {
            opts.orderBookID = "0";
        }

        attributes.orderBookId = UnsignedHyper.fromString(opts.orderBookID);
        attributes.baseBalance = Keypair.fromBalanceId(opts.baseBalance).xdrBalanceId();
        attributes.quoteBalance = Keypair.fromBalanceId(opts.quoteBalance).xdrBalanceId();
        attributes.isBuy = opts.isBuy;

        let marketOrderOp = new xdr.MarketOrderOp(attributes);

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.marketOrderOp(marketOrderOp);
        BaseOperation.setSourceAccount(opAttributes, opts);
        return new xdr.Operation(opAttributes);
    }

    static manageOfferOpToObject(result, attrs) {
        result.amount = BaseOperation._fromXDRAmount(attrs.amount());
        result.isBuy = attrs.isBuy();
        result.baseBalance = BaseOperation.balanceIdtoString(attrs.baseBalance());
        result.quoteBalance = BaseOperation.balanceIdtoString(attrs.quoteBalance());
        result.orderBookID = attrs.orderBookId().toString();
    }
}

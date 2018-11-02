import {default as xdr} from "../generated/stellar-xdr_generated";
import isUndefined from 'lodash/isUndefined';
import {BaseOperation} from './base_operation';
import {Keypair} from "../keypair";
import {UnsignedHyper, Hyper} from "js-xdr";

export class CreateInvestmentTokenSaleParticipationBuilder {

    /**
     * Create investment token sale participation
     * @param {object} opts
     * @param {string} opts.investmentTokenSaleID - id of sale
     * @param {string} opts.quoteBalance - id of balance from which
     * tokens will be charged
     * @param {string} opts.baseAmount - amount of tokens that will be bought
     * @param {string} [opts.source] - The source account for the operation.
     * Defaults to the transaction's source account.
     * @returns {xdr.CreateInvestmentTokenSaleParticipationOp}
     */
    static createITSaleParticipation(opts) {
        if (isUndefined(opts.investmentTokenSaleID)){
            throw new Error("Investment token sale id is undefined");
        }
        if (!Keypair.isValidBalanceKey(opts.quoteBalance)){
            throw new Error("Quote balance is invalid");
        }
        if (!BaseOperation.isValidAmount(opts.baseAmount, false)){
            throw new Error("Base amount is invalid");
        }

        let attrs = {};
        attrs.investmentTokenSaleId =
            UnsignedHyper.fromString(opts.investmentTokenSaleID);
        attrs.quoteBalance =
            Keypair.fromBalanceId(opts.quoteBalance).xdrBalanceId();
        attrs.baseAmount = BaseOperation._toUnsignedXDRAmount(opts.baseAmount);
        attrs.ext = new xdr.CreateItSaleParticipationOpExt(
            xdr.LedgerVersion.emptyVersion());

        let createSaleParticipationOp =
            new xdr.CreateItSaleParticipationOp(attrs);

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody
            .createInvestmentTokenSaleParticipation(createSaleParticipationOp);
        BaseOperation.setSourceAccount(opAttributes, opts);
        return new xdr.Operation(opAttributes);
    }

    static createITSaleParticipationOpToObject(result, attrs) {
        result.investmentTokenSaleID = attrs.investmentTokenSaleId().toString();
        result.quoteBalance = BaseOperation.balanceIdtoString(attrs.quoteBalance());
        result.baseAmount = BaseOperation._fromXDRAmount(attrs.baseAmount());
    }
}
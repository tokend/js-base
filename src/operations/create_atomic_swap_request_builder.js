import { default as xdr } from "../generated/stellar-xdr_generated";
import isUndefined from 'lodash/isUndefined';
import { BaseOperation } from './base_operation';
import { Keypair } from "../keypair";
import { UnsignedHyper, Hyper } from "js-xdr";

export class CreateAtomicSwapRequestBuilder {

    /**
     * Creates atomic swap request
     * @param {object} opts
     *
     * @param {string} opts.bidID - id of bid for which request will be created.
     * @param {string} opts.baseAmount - amount which will be bought
     * @param {string} opts.quoteAsset - accepted assets
     * @param {string} [opts.source] - The source account for the operation.
     * Defaults to the transaction's source account.
     *
     * @returns {xdr.CreateASwapRequestOp}
     */
    static createASwapRequest(opts) {
        let rawRequest = {};
        if (!BaseOperation.isValidAmount(opts.baseAmount)) {
            throw new Error("opts.amount is invalid");
        }
        rawRequest.baseAmount = BaseOperation._toUnsignedXDRAmount(
            opts.baseAmount);

        if (!BaseOperation.isValidAsset(opts.quoteAsset)){
            throw new Error("opts.quoteAssets is invalid");
        }
        rawRequest.quoteAsset = opts.quoteAsset;

        rawRequest.bidId = UnsignedHyper.fromString(opts.bidID);
        rawRequest.ext = new xdr.ASwapRequestExt(
            xdr.LedgerVersion.emptyVersion());

        let opAttributes = {};
        opAttributes.body = new xdr.OperationBody.createAswapRequest(
            new xdr.CreateASwapRequestOp({
                request: new xdr.ASwapRequest(rawRequest),
                ext: new xdr.CreateASwapRequestOpExt(
                    xdr.LedgerVersion.emptyVersion()),
            }));

        BaseOperation.setSourceAccount(opAttributes, opts);
        return new xdr.Operation(opAttributes);
    }

    static createASwapRequestToObject(result, attrs) {
        result.bidID = attrs.request().bidId().toString();
        result.baseAmount = BaseOperation._fromXDRAmount(
            attrs.request().baseAmount());
        result.quoteAsset = attrs.request().quoteAsset();
    }
}
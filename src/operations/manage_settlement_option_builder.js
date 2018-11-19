import {default as xdr} from "../generated/stellar-xdr_generated";
import isUndefined from 'lodash/isUndefined';
import {BaseOperation} from './base_operation';
import {UnsignedHyper, Hyper} from "js-xdr";

export class ManageSettlementOptionBuilder {

    /**
     * Create prolong settlement option for source tokens from investment token sale
     * @param {object} opts
     * @param {string} opts.investmentTokenSaleID - id of sale
     * @param {string} [opts.source] - The source account for the operation.
     * Defaults to the transaction's source account.
     * @returns {xdr.ManageSettlementOptionOp}
     */
    static createProlongationSettlementOption(opts) {
        let details = new xdr.SettlementOptionDetails.prolong();

        return ManageSettlementOptionBuilder.createSettlementOption(
            details, opts);
    }

    /**
     * Create redeem settlement option for source tokens from investment token sale
     * @param {object} opts
     * @param {string} opts.investmentTokenSaleID - id of sale
     * @param {string} opts.redemptionAsset - asset in which redeem will be performed
     * @param {string} [opts.source] - The source account for the operation.
     * Defaults to the transaction's source account.
     * @returns {xdr.ManageSettlementOptionOp}
     */
    static createRedemptionSettlementOption(opts) {
        if (!BaseOperation.isValidAsset(opts.redemptionAsset)){
            throw new Error("Redemption asset is invalid");
        }
        let details = new xdr.SettlementOptionDetails.redeem(
            opts.redemptionAsset);

        return ManageSettlementOptionBuilder.createSettlementOption(
            details, opts);
    }

    /**
     * Remove existing settlement option
     * @param {object} opts
     * @param {string} opts.settlementOptionID - if of existing settlement option
     * @param {string} [opts.source] - The source account for the operation.
     * Defaults to the transaction's source account.
     * @returns {xdr.ManageSettlementOptionOp}
     */
    static removeSettlementOption(opts) {
        if (isUndefined(opts.settlementOptionID)){
            throw new Error("settlement option id is undefined");
        }
        let data = xdr.ManageSettlementOptionOpData.remove(
            UnsignedHyper.fromString(opts.settlementOptionID));

        return ManageSettlementOptionBuilder.manageSettlementOption(data, opts);
    }

    /**
     * @private
     */
    static createSettlementOption(details, opts){
        if (isUndefined(opts.investmentTokenSaleID)){
            throw new Error("Investment token sale id is undefined");
        }

        let creationDetails = new xdr.SettlementOptionCreationDetails({
            details: details,
            investmentTokenSaleId: UnsignedHyper.fromString(
                opts.investmentTokenSaleID),
            ext: new xdr.SettlementOptionCreationDetailsExt(
                xdr.LedgerVersion.emptyVersion())
        });

        let data = new xdr.ManageSettlementOptionOpData.create(creationDetails);

        return ManageSettlementOptionBuilder.manageSettlementOption(data, opts);
    }

    /**
     * @private
     */
    static manageSettlementOption(data, opts) {
        let manageSettlementOptionOp = new xdr.ManageSettlementOptionOp({
                data: data,
                ext: new xdr.ManageSettlementOptionOpExt(
                    xdr.LedgerVersion.emptyVersion()),
            });

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.manageSettlementOption(
            manageSettlementOptionOp);
        BaseOperation.setSourceAccount(opAttributes, opts);
        return new xdr.Operation(opAttributes);
    }

    static manageSettlementOptionOpToObject(result, attrs) {
        switch (attrs.data().switch()) {
            case xdr.ManageSettlementOptionAction.create(): {
                let details = attrs.data().creationDetails();
                result.investmentTokenSaleID =
                    details.investmentTokenSaleId().toString();

                switch (details.details().switch()){
                    case xdr.SettlementOptionAction.redeem():{
                        result.redemptionAsset =
                            details.details().redemptionAsset();
                        break;
                    }
                }
                break;
            }
            case xdr.ManageSettlementOptionAction.remove(): {
                result.settlementOptionID = attrs.data().settlementOptionId().toString();
                break;
            }
        }
    }
}
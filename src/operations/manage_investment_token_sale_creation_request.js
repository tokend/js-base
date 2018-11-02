import {default as xdr} from "../generated/stellar-xdr_generated";
import isUndefined from 'lodash/isUndefined';
import {BaseOperation} from './base_operation';
import {UnsignedHyper, Hyper} from "js-xdr";
import {SaleRequestBuilder} from "./sale_request_builder";

export class ManageInvestmentTokenSaleCreationRequestBuilder {

    /**
     * Create investment token sale creation request
     * @param {object} opts
     * @param {string} opts.baseAsset - asset to be sold
     * @param {string} opts.amountToBeSold - amount of base asset
     * @param {object} opts.details - sale details
     * @param {array} opts.quoteAssets - accepted assets
     * @param {string} opts.quoteAssets.price - price for 1 baseAsset in terms of quote asset
     * @param {string} opts.quoteAssets.asset - asset code of the quote asset
     * @param {string} opts.tradingStartDate - start date of trading
     * @param {string} opts.settlementStartDate - start date of settlement
     * @param {string} opts.settlementEndDate - end date of settlement
     * @param {string} opts.defaultRedemptionAsset - asset in which redemption
     * will be performed if other redemption asset not specified
     * @param {string} [opts.source] - The source account for the operation.
     * Defaults to the transaction's source account.
     * @returns {xdr.ManageInvestmentTokenSaleCreationRequestOp}
     */
    static createITSaleCreationRequest(opts) {
        let requestAttr = ManageInvestmentTokenSaleCreationRequestBuilder
            .validateSaleCreationRequestDetails(opts);

        let data = new xdr.ManageItSaleCreationRequestOpData.create(
            new xdr.InvestmentTokenSaleCreationRequest(requestAttr));

        return ManageInvestmentTokenSaleCreationRequestBuilder
            .manageSaleCreationRequest(data, opts);
    }

    /**
     * Update investment token sale creation request
     * @param {object} opts
     * @param {string} opts.requestID - id of request to be updated
     * @param {string} opts.baseAsset - asset to be sold
     * @param {string} opts.amountToBeSold - amount of base asset
     * @param {object} opts.details - sale details
     * @param {array} opts.quoteAssets - accepted assets
     * @param {string} opts.quoteAssets.price - price for 1 baseAsset in terms of quote asset
     * @param {string} opts.quoteAssets.asset - asset code of the quote asset
     * @param {string} opts.tradingStartDate - start date of trading
     * @param {string} opts.settlementStartDate - start date of settlement
     * @param {string} opts.settlementEndDate - end date of settlement
     * @param {string} opts.defaultRedemptionAsset - asset in which redemption
     * will be performed if other redemption asset not specified
     * @param {string} [opts.source] - The source account for the operation.
     * Defaults to the transaction's source account.
     * @returns {xdr.ManageInvestmentTokenSaleCreationRequestOp}
     */
    static updateITSaleCreationRequest(opts) {
        let requestAttr = ManageInvestmentTokenSaleCreationRequestBuilder
            .validateSaleCreationRequestDetails(opts);

        let data = new xdr.ManageItSaleCreationRequestOpData.update(
            new xdr.UpdateCreationRequestDetails({
                requestId: UnsignedHyper.fromString(opts.requestID),
                request: new xdr.InvestmentTokenSaleCreationRequest(requestAttr),
                ext: new xdr.UpdateCreationRequestDetailsExt(
                    xdr.LedgerVersion.emptyVersion())
            }));

        return ManageInvestmentTokenSaleCreationRequestBuilder
            .manageSaleCreationRequest(data, opts);
    }

    /**
     * Cancel investment token sale creation request
     * @param {object} opts
     * @param {string} opts.requestID - sale request id to cancel
     * @param {string} [opts.source] - The source account for the operation.
     * Defaults to the transaction's source account.
     * @returns {xdr.ManageInvestmentTokenSaleCreationRequestOp}
     */
    static cancelITSaleCreationRequest(opts) {
        let requestId = UnsignedHyper.fromString(opts.requestID);
        let details = xdr.ManageItSaleCreationRequestOpData.cancel(requestId);

        return ManageInvestmentTokenSaleCreationRequestBuilder
            .manageSaleCreationRequest(details, opts);
    }

    /**
     * @private
     */
    static validateSaleCreationRequestDetails(opts){
        SaleRequestBuilder.validateDetail(opts.details);

        let attrs = {
            details: JSON.stringify(opts.details),
            ext: new xdr.InvestmentTokenSaleCreationRequestExt(
                xdr.LedgerVersion.emptyVersion())
        };
        if (!BaseOperation.isValidAsset(opts.baseAsset)){
            throw new Error("base asset is invalid");
        }
        if (!BaseOperation.isValidAmount(opts.amountToBeSold, false)){
            throw new Error("amount to be sold is invalid");
        }
        if (isUndefined(opts.tradingStartDate)){
            throw new Error("trading start date is undefined");
        }
        if (isUndefined(opts.settlementStartDate)){
            throw new Error("settlement start date is undefined");
        }
        if (isUndefined(opts.settlementEndDate)){
            throw new Error("settlement end date is undefined");
        }

        attrs.baseAsset = opts.baseAsset;
        attrs.amountToBeSold =
            BaseOperation._toUnsignedXDRAmount(opts.amountToBeSold);
        attrs.tradingStartDate =
            UnsignedHyper.fromString(opts.tradingStartDate);
        attrs.settlementStartDate =
            UnsignedHyper.fromString(opts.settlementStartDate);
        attrs.settlementEndDate =
            UnsignedHyper.fromString(opts.settlementEndDate);
        attrs.defaultRedemptionAsset = opts.defaultRedemptionAsset;

        if (attrs.tradingStartDate >= opts.settlementStartDate){
            throw new Error("trading start date must be early " +
                "than settlement start date");
        }
        if (attrs.settlementStartDate >= opts.settlementEndDate){
            throw new Error("settlement start date must be early " +
                "than settlement end date");
        }

        attrs.quoteAssets = [];
        for (let i = 0; i < opts.quoteAssets.length; i++) {
            let quoteAsset = opts.quoteAssets[i];

            if (!BaseOperation.isValidAsset(quoteAsset.asset)) {
                throw new Error("opts.quoteAssets["+i+"].asset is invalid");
            }
            if (!BaseOperation.isValidAmount(quoteAsset.price, false)) {
                throw new Error("opts.quoteAssets["+i+"].price is invalid: " +
                    quoteAsset.price);
            }

            attrs.quoteAssets.push(
                new xdr.SaleCreationRequestQuoteAsset({
                    price: BaseOperation._toUnsignedXDRAmount(quoteAsset.price),
                    quoteAsset: quoteAsset.asset,
                    ext: new xdr.SaleCreationRequestQuoteAssetExt(
                        xdr.LedgerVersion.emptyVersion())
                }));
        }

        return attrs;
    }

    /**
     * @private
     */
    static manageSaleCreationRequest(data, opts) {
        let manageSaleCreationRequestOp =
            new xdr.ManageItSaleCreationRequestOp({
                data: data,
                ext: new xdr.ManageItSaleCreationRequestOpExt(
                    xdr.LedgerVersion.emptyVersion()),
            });

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody
            .manageInvestmentTokenSaleCreationRequest(
                manageSaleCreationRequestOp);
        BaseOperation.setSourceAccount(opAttributes, opts);
        return new xdr.Operation(opAttributes);
    }

    /**
     * @private
     */
    static saleCreationRequestToObject(result, request){
        result.baseAsset = request.baseAsset();
        result.defaultRedemptionAsset = request.defaultRedemptionAsset();
        result.amountToBeSold =
            BaseOperation._fromXDRAmount(request.amountToBeSold());
        result.details = JSON.parse(request.details());
        result.tradingStartDate = request.tradingStartDate().toString();
        result.settlementStartDate =
            request.settlementStartDate().toString();
        result.settlementEndDate =
            request.settlementEndDate().toString();

        result.quoteAssets = [];
        for (let i = 0; i < request.quoteAssets().length; i++) {
            result.quoteAssets.push({
                price: BaseOperation._fromXDRAmount(
                    request.quoteAssets()[i].price()),
                asset: request.quoteAssets()[i].quoteAsset(),
            });
        }
    }


    static manageITSaleCreationRequestOpToObject(result, attrs) {
        switch (attrs.data().switch()) {
            case xdr.ManageItSaleCreationRequestAction.create(): {
                let request = attrs.data().creationRequest();

                ManageInvestmentTokenSaleCreationRequestBuilder
                    .saleCreationRequestToObject(result, request);
                break;
            }
            case xdr.ManageItSaleCreationRequestAction.update(): {
                let request = attrs.data().updateDetails().request();

                result.requestID =
                    attrs.data().updateDetails().requestId().toString();
                ManageInvestmentTokenSaleCreationRequestBuilder
                    .saleCreationRequestToObject(result, request);
                break;
            }
            case xdr.ManageItSaleCreationRequestAction.cancel(): {
                result.requestID = attrs.data().requestToCancelId().toString();
                break;
            }
        }
    }
}
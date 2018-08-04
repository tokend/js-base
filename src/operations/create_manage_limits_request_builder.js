import {default as xdr} from "../generated/stellar-xdr_generated";
import isUndefined from 'lodash/isUndefined';
import {BaseOperation} from './base_operation';
import {UnsignedHyper, Hyper} from "js-xdr";

export class CreateManageLimitsRequestBuilder {
    /**
     * Creates limits update request
     * @param {object} opts
     * @param {string} opts.details - string details to review
     * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
     * @returns {xdr.CreateManageLimitsRequestOp}
     */
    static createManageLimitsRequest(opts) {
        if (isUndefined(opts.details)) {
            throw new Error('opts.details is not defined');
        }

        let ext = xdr.LimitsUpdateRequestExt.limitsUpdateRequestDeprecatedDocumentHash(opts.details);

        let limitsUpdateRequest = new xdr.LimitsUpdateRequest({
            deprecatedDocumentHash: new Buffer(32),
            ext: ext,
        });

        let createManageLimitsRequestOp = new xdr.CreateManageLimitsRequestOp({
            manageLimitsRequest: limitsUpdateRequest,
            ext: new xdr.CreateManageLimitsRequestOpExt(xdr.LedgerVersion.emptyVersion()),
        });

        let opAttrs = {};
        opAttrs.body = xdr.OperationBody.createManageLimitsRequest(createManageLimitsRequestOp);
        BaseOperation.setSourceAccount(opAttrs, opts);
        return new xdr.Operation(opAttrs);
    }

    static createManageLimitsRequestToObject(result, attrs) {
        result.details = attrs.manageLimitsRequest().ext().details();
    }
}
import {default as xdr} from "../generated/stellar-xdr_generated";
import isUndefined from 'lodash/isUndefined';
import {BaseOperation} from './base_operation';
import {Keypair} from "../keypair";
import {UnsignedHyper, Hyper} from "js-xdr";

export class ManageContractRequestBuilder {

    /**
     * Create contract request
     * @param {object} opts
     * @param {string} opts.customer - contract customer
     * @param {string} opts.escrow - contract escrow
     * @param {string} opts.startTime - contract start time
     * @param {string} opts.endTime - contract end time
     * @param {object} opts.details - contract details
     * @param {string} [opts.source] - The source account for the contract request. Defaults to the transaction's source account.
     * @returns {xdr.ManageContractRequestOp}
     */
    static createContractRequest(opts) {
        let contractRequestAttr = {
            ext: new xdr.ContractRequestExt(xdr.LedgerVersion.emptyVersion()),
            details: JSON.stringify(opts.details),
        };
        if (!Keypair.isValidPublicKey(opts.customer)) {
            throw new Error("customer is invalid");
        }
        if (!Keypair.isValidPublicKey(opts.escrow)) {
            throw new Error("escrow is invalid");
        }
        if (isUndefined(opts.startTime)) {
            throw new Error("opts.startTime is invalid");
        }
        if (isUndefined(opts.endTime)) {

            throw new Error("opts.endTime is invalid");
        }
        contractRequestAttr.startTime = UnsignedHyper.fromString(opts.startTime);
        contractRequestAttr.endTime = UnsignedHyper.fromString(opts.endTime);
        contractRequestAttr.customer = Keypair.fromAccountId(opts.customer).xdrAccountId();
        contractRequestAttr.escrow = Keypair.fromAccountId(opts.escrow).xdrAccountId();

        let contractRequest = new xdr.ContractRequest(contractRequestAttr);

        let details = new xdr.ManageContractRequestOpDetails.create(contractRequest);

        return ManageContractRequestBuilder.manageContractRequest(details, opts);
    }

    /**
     * Remove contract request
     * @param {object} opts
     * @param {string} opts.requestId - contract request id to remove
     * @param {string} [opts.source] - The source account for the contract request. Defaults to the transaction's source account.
     * @returns {xdr.ManageContractRequestOp}
     */
    static removeContractRequest(opts) {
        let requestId = UnsignedHyper.fromString(opts.requestId);
        let details = xdr.ManageContractRequestOpDetails.remove(requestId);

        return ManageContractRequestBuilder.manageContractRequest(details, opts);
    }

    static manageContractRequest(details, opts) {
        let manageContractRequestOp = new xdr.ManageContractRequestOp({
            details: details,
            ext: new xdr.ManageContractRequestOpExt(xdr.LedgerVersion.emptyVersion()),
        });

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.manageContractRequest(manageContractRequestOp);
        BaseOperation.setSourceAccount(opAttributes, opts);
        return new xdr.Operation(opAttributes);
    }


    static manageContractRequestOpToObject(result, attrs) {
        switch (attrs.details().switch()) {
            case xdr.ManageContractRequestAction.create(): {
                let contractRequest = attrs.details().contractRequest();

                result.customer = BaseOperation.accountIdtoAddress(contractRequest.customer());
                result.escrow = BaseOperation.accountIdtoAddress(contractRequest.escrow());
                result.startTime = contractRequest.startTime().toString();
                result.endTime = contractRequest.endTime().toString();
                result.details = JSON.parse(contractRequest.details());
                break;
            }
            case xdr.ManageContractRequestAction.remove(): {
                result.requestId = attrs.details().requestId().toString();
                break;
            }
        }
    }
}
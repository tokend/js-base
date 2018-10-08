import {default as xdr} from "../generated/stellar-xdr_generated";
import isUndefined from 'lodash/isUndefined';
import {BaseOperation} from './base_operation';
import {Keypair} from "../keypair";
import {UnsignedHyper, Hyper} from "js-xdr";

export class ManageContractBuilder {

    /**
     * Add contract details
     * @param {object} opts
     * @param {string} opts.contractID - contract id
     * @param {object} opts.details - contract details
     * @param {string} [opts.source] - The source account for the manage contract. Defaults to the transaction's source account.
     * @returns {xdr.ManageContractOp}
     */
    static addDetails(opts) {
        let details = xdr.ManageContractOpData.addDetail(JSON.stringify(opts.details));

        return ManageContractBuilder.manageContract(details, opts);
    }

    /**
     * Confirm completed
     * @param {object} opts
     * @param {string} opts.contractID - contract id
     * @param {string} [opts.source] - The source account for the confirm contract. Defaults to the transaction's source account.
     * @returns {xdr.ManageContractOp}
     */
    static confirmCompleted(opts) {
        let details = new xdr.ManageContractOpData(xdr.ManageContractAction.confirmCompleted());

        return ManageContractBuilder.manageContract(details, opts);
    }

    /**
     * Start dispute
     * @param {object} opts
     * @param {string} opts.contractID - contract id
     * @param {object} opts.disputeReason - contract disputeReason
     * @param {string} [opts.source] - The source account for the manage contract. Defaults to the transaction's source account.
     * @returns {xdr.ManageContractOp}
     */
    static startDispute(opts) {
        let details = xdr.ManageContractOpData.startDispute(JSON.stringify(opts.disputeReason));

        return ManageContractBuilder.manageContract(details, opts);
    }

    /**
     * Resolve dispute
     * @param {object} opts
     * @param {string} opts.contractID - contract id
     * @param {boolean} opts.isRevert - if true all invoice payment will be reverted
     * @param {string} [opts.source] - The source account for the confirm contract. Defaults to the transaction's source account.
     * @returns {xdr.ManageContractOp}
     */
    static resolveDispute(opts) {
        if (typeof (opts.isRevert) !== "boolean") {
            throw new Error("isRevert must be boolean");
        }
        let details = xdr.ManageContractOpData.resolveDispute(opts.isRevert);

        return ManageContractBuilder.manageContract(details, opts);
    }

    static manageContract(data, opts) {
        let manageContractOp = new xdr.ManageContractOp({
            contractId: UnsignedHyper.fromString(opts.contractID),
            data: data,
            ext: new xdr.ManageContractOpExt(xdr.LedgerVersion.emptyVersion()),
        });

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.manageContract(manageContractOp);
        BaseOperation.setSourceAccount(opAttributes, opts);
        return new xdr.Operation(opAttributes);
    }


    static manageContractOpToObject(result, attrs) {
        result.contractID = attrs.contractId().toString();
        switch (attrs.data().switch()) {
            case xdr.ManageContractAction.addDetail(): {
                result.details = JSON.parse(attrs.data().details());
                break;
            }
            case xdr.ManageContractAction.confirmCompleted(): {
                break;
            }
            case xdr.ManageContractAction.startDispute(): {
                result.disputeReason = JSON.parse(attrs.data().disputeReason());
                break;
            }
            case xdr.ManageContractAction.resolveDispute(): {
                result.isRevert = attrs.data().isRevert();
                break;
            }
        }
    }
}
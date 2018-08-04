import {default as xdr} from "../generated/stellar-xdr_generated";
import isUndefined from 'lodash/isUndefined';
import {BaseOperation} from './base_operation';
import {Keypair} from "../keypair";
import {UnsignedHyper, Hyper} from "js-xdr";

export class ManageExternalSystemAccountIdPoolEntryBuilder {
    /**
     * Creates operation for new pool entry creation
     * @param {object} opts
     *
     * @param {string} opts.externalSystemType - type of external system
     * @param {string} opts.data
     * @param {string} opts.parent - parent of pool
     * @param {string} opts.poolEntryId - id of pool entry
     *
     * @param {string} [opts.source] - The source account for the creation. Defaults to the transaction's source account.
     *
     * @returns {xdr.ManageExternalSystemAccountIdPoolEntryOp}
     */
    static createExternalSystemAccountIdPoolEntry(opts) {
        let attrs = {};

        attrs.externalSystemType = opts.externalSystemType;

        if(opts.data === undefined){
            throw new Error("data is undefined");
        }
        if (opts.data === "") {
            throw new Error("data cannot be empty string");
        }
        attrs.data = opts.data;

        if(opts.parent.toString() === undefined){
            throw new Error("parent is undefined");
        }
        if (opts.parent.toString() === "") {
            throw new Error("parent cannot be empty string");
        }
        attrs.parent = UnsignedHyper.fromString(opts.parent.toString());

        attrs.ext = new xdr.CreateExternalSystemAccountIdPoolEntryActionInputExt(xdr.LedgerVersion.emptyVersion());

        let createExternalSystemAccountIdPoolEntryActionInput = new xdr.CreateExternalSystemAccountIdPoolEntryActionInput(attrs);
        return ManageExternalSystemAccountIdPoolEntryBuilder._createManageExternalSystemAccountIdPoolEntryOp(
            opts, new xdr.ManageExternalSystemAccountIdPoolEntryOpActionInput.create(
                createExternalSystemAccountIdPoolEntryActionInput));
    }

    static deleteExternalSystemAccountIdPoolEntry(opts) {
        let attrs = {};

        if(opts.poolEntryId.toString() === undefined){
            throw new Error("poolEntryId is undefined");
        }
        if (opts.poolEntryId.toString() === "") {
            throw new Error("poolEntryId cannot be empty string");
        }
        attrs.poolEntryId = UnsignedHyper.fromString(opts.poolEntryId.toString());

        attrs.ext = new xdr.DeleteExternalSystemAccountIdPoolEntryActionInputExt(xdr.LedgerVersion.emptyVersion());

        let deleteExternalSystemAccountIdPoolEntryActionInput = new xdr.DeleteExternalSystemAccountIdPoolEntryActionInput(attrs);
        return ManageExternalSystemAccountIdPoolEntryBuilder._deleteManageExternalSystemAccountIdPoolEntryOp(
            opts, new xdr.ManageExternalSystemAccountIdPoolEntryOpActionInput.remove(
                deleteExternalSystemAccountIdPoolEntryActionInput));
    }

    static _createManageExternalSystemAccountIdPoolEntryOp(opts, input) {
        let manageExternalSystemAccountIdPoolEntryOp = new xdr.ManageExternalSystemAccountIdPoolEntryOp({
            actionInput: input,
            ext: new xdr.ManageExternalSystemAccountIdPoolEntryOpExt(xdr.LedgerVersion.emptyVersion()),
        });

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.manageExternalSystemAccountIdPoolEntry(manageExternalSystemAccountIdPoolEntryOp);
        BaseOperation.setSourceAccount(opAttributes, opts);
        return new xdr.Operation(opAttributes);
    }

    static _deleteManageExternalSystemAccountIdPoolEntryOp(opts, input) {
        let manageExternalSystemAccountIdPoolEntryOp = new xdr.ManageExternalSystemAccountIdPoolEntryOp({
            actionInput: input,
            ext: new xdr.ManageExternalSystemAccountIdPoolEntryOpExt(xdr.LedgerVersion.emptyVersion()),
        });

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.manageExternalSystemAccountIdPoolEntry(manageExternalSystemAccountIdPoolEntryOp);
        BaseOperation.setSourceAccount(opAttributes, opts);

        return new xdr.Operation(opAttributes);
    }

    static manageExternalSystemAccountIdPoolEntryToObject(result, attrs) {
        result.actionType = attrs.actionInput().switch().name;
        switch (attrs.actionInput().switch()) {
            case xdr.ManageExternalSystemAccountIdPoolEntryAction.create():
            {
                let action = attrs.actionInput().createExternalSystemAccountIdPoolEntryActionInput();
                result.externalSystemType = action.externalSystemType();
                result.data = action.data();
                result.parent = action.parent().toString();
                break;
            }
            case xdr.ManageExternalSystemAccountIdPoolEntryAction.remove():
            {
                let action = attrs.actionInput().deleteExternalSystemAccountIdPoolEntryActionInput();
                result.poolEntryId = action.poolEntryId().toString();
                break;
            }
        }
    }
}
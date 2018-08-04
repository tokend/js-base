import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";

describe('ManageExternalSystemAccountIdPoolEntry', function () {
    describe('Create external system account id pool entry', function () {
        it("Success", function () {
            let data = "Some data";
            let parent = "12";
            let externalSystemType = 1;
            let opts = {
                externalSystemType: externalSystemType,
                data: data,
                parent: parent,
            };

            let op = StellarBase.ManageExternalSystemAccountIdPoolEntryBuilder.createExternalSystemAccountIdPoolEntry(opts);
            let xdr = op.toXDR("hex");
            let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            let obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageExternalSystemAccountIdPoolEntry");
            expect(obj.actionType).to.be.equal("create");
            expect(obj.externalSystemType).to.be.equal(externalSystemType);
            expect(obj.data).to.be.equal(data);
            expect(obj.parent).to.be.equal(parent);
        });
    });

    describe('Delete external system account id pool entry', function () {
        it("Success", function () {
            let poolEntryID = "13";
            let opts = {
                poolEntryId: poolEntryID,
            };

            let op = StellarBase.ManageExternalSystemAccountIdPoolEntryBuilder.deleteExternalSystemAccountIdPoolEntry(opts);
            let xdr = op.toXDR("hex");
            let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            let obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageExternalSystemAccountIdPoolEntry");
            expect(obj.actionType).to.be.equal("remove");
            expect(obj.poolEntryId).to.be.equal(poolEntryID);
        });
    });
});

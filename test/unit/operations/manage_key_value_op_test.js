import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";
import {default as xdr} from "../../../src/generated/stellar-xdr_generated";

describe('Manage Key Value', function () {
    describe('Put key int value', function () {
        it("Success", function () {
            let key = "1216";
            let value = "123";
            let action = StellarBase.xdr.ManageKvAction.put().value;
            let opts = {
                key: key,
                value: value
            };

            let op = StellarBase.ManageKeyValueBuilder.putKeyValue(opts);
            let xdr = op.toXDR("hex");
            let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            let obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageKeyValue");
            expect(obj.action).to.be.equal(action);
            expect(obj.key).to.be.equal(key);
            expect(obj.value).to.be.equal(value);
        });
    });

    describe('Put key string value', function () {
        it("Success", function () {
            let key = "1216";
            let value = "Hello";
            let action = StellarBase.xdr.ManageKvAction.put().value;
            let opts = {
                key: key,
                value: value
            };

            let op = StellarBase.ManageKeyValueBuilder.putKeyValue(opts);
            let xdr = op.toXDR("hex");
            let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            let obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageKeyValue");
            expect(obj.action).to.be.equal(action);
            expect(obj.key).to.be.equal(key);
            expect(obj.value).to.be.equal(value);
        });
    });

    describe('Delete key value', function () {
        it("Success", function () {
            let key = "1216";
            let action = StellarBase.xdr.ManageKvAction.remove().value;
            let opts = {
                key: key
            };

            let op = StellarBase.ManageKeyValueBuilder.deleteKeyValue(opts);
            let xdr = op.toXDR("hex");
            let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            let obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageKeyValue");
            expect(obj.action).to.be.equal(action);
            expect(obj.key).to.be.equal(key);
        });
    });

    describe('Put key uint64 value', function () {
        it("Success", function () {
            let key = "1216";
            let value = "123";
            let action = StellarBase.xdr.ManageKvAction.put().value;
            let opts = {
                key: key,
                value: value,
                entryType: StellarBase.xdr.KeyValueEntryType.uint64().value
            };

            let op = StellarBase.ManageKeyValueBuilder.putKeyValue(opts);
            let xdr = op.toXDR("hex");
            let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            let obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageKeyValue");
            expect(obj.action).to.be.equal(action);
            expect(obj.key).to.be.equal(key);
            expect(obj.value).to.be.equal(value);
        });
    });
});

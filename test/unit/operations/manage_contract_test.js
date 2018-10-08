import {ManageContractRequestBuilder} from "../../../src/operations/manage_contract_request_builder";
import isEqual from "lodash/isEqual";

describe(".manageContract()", function () {
    it("add contract details", function () {
        let contractID = "10";
        let details = {"data" : "Some new contract details"};
        let op = StellarBase.ManageContractBuilder.addDetails({
            contractID, details
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("manageContract");
        expect(obj.contractID).to.be.equal(contractID);
        expect(isEqual(obj.details, details)).to.be.true;
    });
    it("confirm completed", function () {
        let contractID = "10";
        let op = StellarBase.ManageContractBuilder.confirmCompleted({
            contractID
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("manageContract");
        expect(obj.contractID).to.be.equal(contractID);
    });
    it("start dispute", function () {
        let contractID = "10";
        let disputeReason = {"data" : "Some reason"};
        let op = StellarBase.ManageContractBuilder.startDispute({
            contractID, disputeReason
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("manageContract");
        expect(obj.contractID).to.be.equal(contractID);
        expect(isEqual(obj.disputeReason, disputeReason)).to.be.true;
    });
    it("resolve dispute", function () {
        let contractID = "10";
        let isRevert = true;
        let op = StellarBase.ManageContractBuilder.resolveDispute({
            contractID, isRevert
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("manageContract");
        expect(obj.contractID).to.be.equal(contractID);
        expect(obj.isRevert).to.be.equal(isRevert);
    });
});
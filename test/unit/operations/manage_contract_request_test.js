import {ManageContractRequestBuilder} from "../../../src/operations/manage_contract_request_builder";
import isEqual from "lodash/isEqual";

describe(".manageContractRequest()", function () {
    it("create contractRequest", function () {
        let customer = StellarBase.Keypair.random().accountId();
        let escrow = StellarBase.Keypair.random().accountId();
        let details = {"data" : "Some details about contract"};
        let startTime = "12345";
        let endTime = "1234567";
        let op = StellarBase.ManageContractRequestBuilder.createContractRequest({
            customer, escrow, startTime, endTime, details
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("manageContractRequest");
        expect(obj.customer).to.be.equal(customer);
        expect(obj.escrow).to.be.equal(escrow);
        expect(obj.startTime).to.be.equal(startTime);
        expect(obj.endTime).to.be.equal(endTime);
        expect(isEqual(obj.details, details)).to.be.true;
    });
    it("remove contractRequest", function () {
        let requestId = "124";
        let op = StellarBase.ManageContractRequestBuilder.removeContractRequest({
            requestId
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("manageContractRequest");
        expect(obj.requestId).to.be.equal(requestId);
    });
});
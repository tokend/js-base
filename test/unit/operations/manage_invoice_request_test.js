import {ManageInvoiceRequestBuilder} from "../../../src/operations/manage_invoice_request_builder";
import isEqual from "lodash/isEqual";

describe(".manageInvoiceRequest()", function () {
    it("create invoiceRequest", function () {
        var sender = StellarBase.Keypair.random().accountId();
        let asset = "USD";
        var amount = "1000";
        let details = {"data" : "Some details about invoice request"};
        let contractID = "10";
        let op = StellarBase.ManageInvoiceRequestBuilder.createInvoiceRequest({
            sender, asset, amount, details, contractID
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("manageInvoiceRequest");
        expect(obj.sender).to.be.equal(sender);
        expect(obj.asset).to.be.equal(asset);
        expect(operation.body().value().details().invoiceRequest().amount().toString()).to.be.equal(amount + "000000");
        expect(obj.amount).to.be.equal(amount);
        expect(obj.contractID).to.be.equal(contractID);
        expect(isEqual(obj.details, details)).to.be.true;
    });
    it("remove invoiceRequest", function () {
        let requestId = "123";
        let op = StellarBase.ManageInvoiceRequestBuilder.removeInvoiceRequest({
            requestId
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("manageInvoiceRequest");
        expect(obj.requestId).to.be.equal(requestId);
    });
});
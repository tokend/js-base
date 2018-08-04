import { Hyper } from "js-xdr";
import isEqual from "lodash/isEqual";
import {CreateUpdateKYCRequestBuilder} from "../../../src/operations/create_update_kyc_request_builder";

describe("KYC request op", function () {
    it("Success", function () {
        let requestID = "0";
        let accountID = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
        let accountType = StellarBase.xdr.AccountType.general().value;
        let kycLevelToSet = 1;
        let kycData = {"hash" : "bb36c7c58c4c32d98947c8781c91c7bb797c3647"};
        let allTasks = 3;
        let op = StellarBase.CreateUpdateKYCRequestBuilder.createUpdateKYCRequest({
            requestID: requestID,
            accountToUpdateKYC: accountID,
            accountTypeToSet: accountType,
            kycLevelToSet: kycLevelToSet,
            kycData: kycData,
            allTasks: allTasks,
        });
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("createKycRequest");
        expect(obj.accountToUpdateKYC).to.be.equal(accountID);
        expect(obj.accountTypeToSet).to.be.equal(accountType);
        expect(obj.kycLevelToSet).to.be.equal(kycLevelToSet);
        expect(isEqual(obj.kycData, kycData)).to.be.true;
        expect(obj.allTasks).to.be.equal(allTasks);
    });
});
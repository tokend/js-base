import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";
import isEqual from "lodash/isEqual";

describe('ReviewRequest', function () {
    it("Success", function () {
        var opts = {
            requestID: "1",
            requestHash: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
            requestType: StellarBase.xdr.ReviewableRequestType.assetCreate().value,
            action: StellarBase.xdr.ReviewRequestOpAction.reject().value,
            reason: "Something is invalid",
            tasksToAdd: 0,
            tasksToRemove: 4,
            externalDetails: {details: 'All right'}
        }
        let op = StellarBase.ReviewRequestBuilder.reviewRequest(opts);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("reviewRequest");
        expect(obj.requestID).to.be.equal(opts.requestID);
        expect(obj.requestHash).to.be.equal(opts.requestHash);
        expect(obj.requestType).to.be.equal(opts.requestType);
        expect(obj.action).to.be.equal(opts.action);
        expect(obj.reason).to.be.equal(opts.reason);
        expect(obj.tasksToAdd).to.be.equal(opts.tasksToAdd);
        expect(obj.tasksToRemove).to.be.equal(opts.tasksToRemove);
        expect(obj.externalDetails).to.be.equal(JSON.stringify(opts.externalDetails));
    });
    it("Withdraw request success", function () {
        var opts = {
            requestID: "1",
            requestHash: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
            externalDetails: {details: "External details"},
            action: StellarBase.xdr.ReviewRequestOpAction.reject().value,
            reason: "Something is invalid",
            tasksToAdd: 0,
            tasksToRemove: 4,
            externalDetails: {details: 'All right'}
        }
        let op = StellarBase.ReviewRequestBuilder.reviewWithdrawRequest(opts);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("reviewRequest");
        expect(obj.requestID).to.be.equal(opts.requestID);
        expect(obj.requestHash).to.be.equal(opts.requestHash);
        expect(obj.action).to.be.equal(opts.action);
        expect(obj.reason).to.be.equal(opts.reason);
        expect(obj.withdrawal.externalDetails).to.be.equal(JSON.stringify(opts.externalDetails));
        expect(obj.tasksToAdd).to.be.equal(opts.tasksToAdd);
        expect(obj.tasksToRemove).to.be.equal(opts.tasksToRemove);
        expect(obj.externalDetails).to.be.equal(JSON.stringify(opts.externalDetails));
    });
    it("LimitsUpdate request success", function () {
        let account = StellarBase.Keypair.random();
        var opts = {
            requestID: "1",
            requestHash: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
            newLimits: {
                id: '1',
                accountID: account.accountId(),
                statsOpType: 3,
                assetCode: 'USD',
                isConvertNeeded: false,
                dailyOut: '100',
                weeklyOut: '200',
                monthlyOut: '300',
                annualOut: '500',
            },
            action: StellarBase.xdr.ReviewRequestOpAction.reject().value,
            reason: "Something is invalid",
            tasksToAdd: 0,
            tasksToRemove: 4,
            externalDetails: {details: 'All right'}
        };
        let op = StellarBase.ReviewRequestBuilder.reviewLimitsUpdateRequest(opts);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("reviewRequest");
        expect(obj.requestID).to.be.equal(opts.requestID);
        expect(obj.requestHash).to.be.equal(opts.requestHash);
        expect(obj.action).to.be.equal(opts.action);
        expect(obj.reason).to.be.equal(opts.reason);
        expect(obj.limitsUpdate.newLimits.id).to.be.equal('1');
        expect(obj.limitsUpdate.newLimits.accountID).to.be.equal(account.accountId());
        expect(obj.limitsUpdate.newLimits.assetCode).to.be.equal('USD');
        expect(obj.limitsUpdate.newLimits.isConvertNeeded).to.be.equal(false);
        expect(obj.limitsUpdate.newLimits.dailyOut).to.be.equal(opts.newLimits.dailyOut);
        expect(obj.limitsUpdate.newLimits.weeklyOut).to.be.equal(opts.newLimits.weeklyOut);
        expect(obj.limitsUpdate.newLimits.monthlyOut).to.be.equal(opts.newLimits.monthlyOut);
        expect(obj.limitsUpdate.newLimits.annualOut).to.be.equal(opts.newLimits.annualOut);
        expect(obj.tasksToAdd).to.be.equal(opts.tasksToAdd);
        expect(obj.tasksToRemove).to.be.equal(opts.tasksToRemove);
        expect(obj.externalDetails).to.be.equal(JSON.stringify(opts.externalDetails));
    });
    it("Two step Withdraw request success", function () {
        var opts = {
            requestID: "1",
            requestHash: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
            externalDetails: {details: "External details of two step request"},
            action: StellarBase.xdr.ReviewRequestOpAction.reject().value,
            reason: "Something is invalid",
            tasksToAdd: 0,
            tasksToRemove: 4,
        }
        let op = StellarBase.ReviewRequestBuilder.reviewTwoStepWithdrawRequest(opts);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("reviewRequest");
        expect(obj.requestID).to.be.equal(opts.requestID);
        expect(obj.requestHash).to.be.equal(opts.requestHash);
        expect(obj.action).to.be.equal(opts.action);
        expect(obj.reason).to.be.equal(opts.reason);
        expect(obj.twoStepWithdrawal.externalDetails).to.be.equal(JSON.stringify(opts.externalDetails));
        expect(obj.tasksToAdd).to.be.equal(opts.tasksToAdd);
        expect(obj.tasksToRemove).to.be.equal(opts.tasksToRemove);
        expect(obj.externalDetails).to.be.equal(JSON.stringify(opts.externalDetails));
    });
    it("Aml alert request success", function () {
        var opts = {
            requestID: "1",
            requestHash: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
            comment: 'Testing aml alert',
            action: StellarBase.xdr.ReviewRequestOpAction.reject().value,
            reason: "Something is invalid",
            tasksToAdd: 0,
            tasksToRemove: 4,
            externalDetails: {details: 'All right'}
        };
        let op = StellarBase.ReviewRequestBuilder.reviewAmlAlertRequest(opts);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("reviewRequest");
        expect(obj.requestID).to.be.equal(opts.requestID);
        expect(obj.requestHash).to.be.equal(opts.requestHash);
        expect(obj.action).to.be.equal(opts.action);
        expect(obj.reason).to.be.equal(opts.reason);
        expect(obj.amlAlert.comment).to.be.equal(opts.comment);
        expect(obj.tasksToAdd).to.be.equal(opts.tasksToAdd);
        expect(obj.tasksToRemove).to.be.equal(opts.tasksToRemove);
        expect(obj.externalDetails).to.be.equal(JSON.stringify(opts.externalDetails));
    });
    it("Update KYC request success", function () {
        var opts = {
            requestID: "1",
            requestHash: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
            action: StellarBase.xdr.ReviewRequestOpAction.reject().value,
            reason: "Something is invalid",
            externalDetails: {details: "Invalid identity"},
            tasksToAdd: 3,
            tasksToRemove: 0,
        }
        let op = StellarBase.ReviewRequestBuilder.reviewUpdateKYCRequest(opts);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("reviewRequest");
        expect(obj.requestID).to.be.equal(opts.requestID);
        expect(obj.requestHash).to.be.equal(opts.requestHash);
        expect(obj.action).to.be.equal(opts.action);
        expect(obj.reason).to.be.equal(opts.reason);
        expect(obj.updateKyc.externalDetails).to.be.equal(JSON.stringify(opts.externalDetails));
        expect(obj.updateKyc.tasksToAdd).to.be.equal(opts.tasksToAdd);
        expect(obj.updateKyc.tasksToRemove).to.be.equal(opts.tasksToRemove);
        expect(obj.tasksToAdd).to.be.equal(opts.tasksToAdd);
        expect(obj.tasksToRemove).to.be.equal(opts.tasksToRemove);
        expect(obj.externalDetails).to.be.equal(JSON.stringify(opts.externalDetails));
    })
    it("Invoice request success", function () {
        let sourceBalanceId = StellarBase.Keypair.random().balanceId();
        let destinationBalanceId = StellarBase.Keypair.random().balanceId();
        let amount = "100";
        let opts = {
            requestID: "1",
            requestHash: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
            action: StellarBase.xdr.ReviewRequestOpAction.reject().value,
            reason: "Something is invalid",
            billPayDetails: {
                sourceBalanceId: sourceBalanceId,
                destination: destinationBalanceId,
                amount: amount,
                feeData: {
                    sourceFee: {
                        maxPaymentFee: '120',
                        fixedFee: '110',
                        feeAsset: 'USD',
                    },
                    destinationFee: {
                        maxPaymentFee: '20',
                        fixedFee: '10',
                        feeAsset: 'USD',
                    },
                    sourcePaysForDest: true
                },
                subject: 'subj',
                reference: 'ref',
            }
        };

        let op = StellarBase.ReviewRequestBuilder.reviewInvoiceRequest(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);

        expect(obj.type).to.be.equal("reviewRequest");
        expect(obj.requestID).to.be.equal(opts.requestID);
        expect(obj.requestHash).to.be.equal(opts.requestHash);
        expect(obj.action).to.be.equal(opts.action);
        expect(obj.reason).to.be.equal(opts.reason);
        expect(isEqual(opts.billPayDetails, obj.invoice.billPayDetails)).to.be.true;
    });
    it("Contract request success", function () {
        let opts = {
            requestID: "1",
            requestHash: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
            action: StellarBase.xdr.ReviewRequestOpAction.approve().value,
            reason: "",
            details: {"data" : "some details"}
        };

        let op = StellarBase.ReviewRequestBuilder.reviewContractRequest(opts);
        let xdr = op.toXDR("hex");
        let operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        let obj = StellarBase.Operation.operationToObject(operation);

        expect(obj.type).to.be.equal("reviewRequest");
        expect(obj.requestID).to.be.equal(opts.requestID);
        expect(obj.requestHash).to.be.equal(opts.requestHash);
        expect(obj.action).to.be.equal(opts.action);
        expect(obj.reason).to.be.equal(opts.reason);
        expect(isEqual(opts.details, obj.contract.details)).to.be.true;
    });
});
import {PaymentV2Builder} from "../../../src/operations/payment_v2_builder";
import isEqual from "lodash/isEqual";

describe("PaymentV2 op", function () {
    let sourceBalanceId = StellarBase.Keypair.random().balanceId();
    let destinationBalanceId = StellarBase.Keypair.random().balanceId();
    let destinationAccountId = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
    let amount = "100";
    it("PaymentV2 for balance success", function () {
        let op = StellarBase.PaymentV2Builder.paymentV2({
            sourceBalanceId: sourceBalanceId,
            destination: destinationBalanceId,
            amount: amount,
            feeData: {
                sourceFee: {
                    percent: '120',
                    fixed: '110',
                },
                destinationFee: {
                    percent: '20',
                    fixed: '10',
                },
                sourcePaysForDest: true
            },
            subject: 'subj',
            reference: 'ref',
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("paymentV2");
        expect(obj.sourceBalanceId).to.be.equal(sourceBalanceId);
        expect(obj.destination).to.be.equal(destinationBalanceId);
        expect(obj.amount).to.be.equal(amount);
        expect(obj.feeData.sourcePaysForDest).to.be.equal(true);
        expect(obj.feeData.sourceFee.fixed).to.be.equal('110');
        expect(obj.feeData.sourceFee.percent).to.be.equal('120');
        expect(obj.feeData.destinationFee.fixed).to.be.equal('10');
        expect(obj.feeData.destinationFee.percent).to.be.equal('20');
        expect(obj.subject).to.be.equal('subj');
        expect(obj.reference).to.be.equal('ref');
    })
    it("PaymentV2 for account success", function () {
        let op = StellarBase.PaymentV2Builder.paymentV2({
            sourceBalanceId: sourceBalanceId,
            destination: destinationAccountId,
            amount: amount,
            feeData: {
                sourceFee: {
                    percent: '120',
                    fixed: '110',
                },
                destinationFee: {
                    percent: '20',
                    fixed: '10',
                },
                sourcePaysForDest: true
            },
            subject: 'subj',
            reference: 'ref',
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("paymentV2");
        expect(obj.sourceBalanceId).to.be.equal(sourceBalanceId);
        expect(obj.destination).to.be.equal(destinationAccountId);
        expect(obj.amount).to.be.equal(amount);
        expect(obj.feeData.sourcePaysForDest).to.be.equal(true);
        expect(obj.feeData.sourceFee.fixed).to.be.equal('110');
        expect(obj.feeData.sourceFee.percent).to.be.equal('120');
        expect(obj.feeData.destinationFee.fixed).to.be.equal('10');
        expect(obj.feeData.destinationFee.percent).to.be.equal('20');
        expect(obj.subject).to.be.equal('subj');
        expect(obj.reference).to.be.equal('ref');
    })
})

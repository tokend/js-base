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
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("paymentV2");
        expect(obj.sourceBalanceId).to.be.equal(sourceBalanceId);
        expect(obj.destination).to.be.equal(destinationBalanceId);
        expect(obj.amount).to.be.equal(amount);
        expect(obj.feeData.sourcePaysForDest).to.be.equal(true);
        expect(obj.feeData.sourceFee.fixedFee).to.be.equal('110');
        expect(obj.feeData.sourceFee.maxPaymentFee).to.be.equal('120');
        expect(obj.feeData.sourceFee.feeAsset).to.be.equal('USD');
        expect(obj.feeData.destinationFee.fixedFee).to.be.equal('10');
        expect(obj.feeData.destinationFee.maxPaymentFee).to.be.equal('20');
        expect(obj.feeData.destinationFee.feeAsset).to.be.equal('USD');
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
        });
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("paymentV2");
        expect(obj.sourceBalanceId).to.be.equal(sourceBalanceId);
        expect(obj.destination).to.be.equal(destinationAccountId);
        expect(obj.amount).to.be.equal(amount);
        expect(obj.feeData.sourcePaysForDest).to.be.equal(true);
        expect(obj.feeData.sourceFee.fixedFee).to.be.equal('110');
        expect(obj.feeData.sourceFee.maxPaymentFee).to.be.equal('120');
        expect(obj.feeData.sourceFee.feeAsset).to.be.equal('USD');
        expect(obj.feeData.destinationFee.fixedFee).to.be.equal('10');
        expect(obj.feeData.destinationFee.maxPaymentFee).to.be.equal('20');
        expect(obj.feeData.destinationFee.feeAsset).to.be.equal('USD');
        expect(obj.subject).to.be.equal('subj');
        expect(obj.reference).to.be.equal('ref');
    })
})

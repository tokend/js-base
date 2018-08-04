import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";
import isEqual from 'lodash/isEqual';

describe(".setOptions()", function () {

    it("creates a setOptionsOp", function () {
        var opts = {};
        opts.masterWeight = 0;
        opts.lowThreshold = 1;
        opts.medThreshold = 2;
        opts.highThreshold = 3;

        opts.signer = {
            pubKey: "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7",
            weight: 1,
            signerType: 2,
            identity: 3,
            name: "Test Signer",
        };

        let allowedAccount = StellarBase.Keypair.random().accountId();
        let balanceToUse = StellarBase.Keypair.random().balanceId();
        opts.trustData = {
            action: StellarBase.xdr.ManageTrustAction.trustAdd(),
            allowedAccount,
            balanceToUse
        }

        let documentData = "Some data in document";
        let documentHash = StellarBase.hash(documentData);

        opts.limitsUpdateRequestData = {
            documentHash: documentHash
        }

        let op = StellarBase.SetOptionsBuilder.setOptions(opts);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);

        expect(obj.type).to.be.equal("setOption");
        expect(obj.masterWeight).to.be.equal(opts.masterWeight);
        expect(obj.lowThreshold).to.be.equal(opts.lowThreshold);
        expect(obj.medThreshold).to.be.equal(opts.medThreshold);
        expect(obj.highThreshold).to.be.equal(opts.highThreshold);

        expect(obj.signer.pubKey).to.be.equal(opts.signer.pubKey);
        expect(obj.signer.weight).to.be.equal(opts.signer.weight);
        expect(obj.signer.signerType).to.be.equal(opts.signer.signerType);
        expect(obj.signer.identity).to.be.equal(opts.signer.identity);
        expect(obj.signer.name).to.be.equal(opts.signer.name);

        expect(obj.trustData.allowedAccount).to.be.equal(allowedAccount);
        expect(obj.trustData.balanceToUse).to.be.equal(balanceToUse);
        expect(obj.trustData.action).to.be.equal(StellarBase.xdr.ManageTrustAction.trustAdd());
        expect(obj.limitsUpdateRequestData.documentHash.toString()).to.be.equal(documentHash.toString());
    });

    it("fails to create setOptions operation with an invalid signer address", function () {
        let opts = {
            signer: {
                pubKey: "GDGU5OAPHNPU5UCL",
                weight: 1
            },
        };
        expect(() => StellarBase.SetOptionsBuilder.setOptions(opts)).to.throw(/signer.pubKey is invalid/)
    });

    it("fails to create setOptions operation with an invalid masterWeight", function () {
        let opts = {
            masterWeight: 400,
        };
        expect(() => StellarBase.SetOptionsBuilder.setOptions(opts)).to.throw(/masterWeight value must be between 0 and 255/)
    });

    it("fails to create setOptions operation with an invalid lowThreshold", function () {
        let opts = {
            lowThreshold: 400,
        };
        expect(() => StellarBase.SetOptionsBuilder.setOptions(opts)).to.throw(/lowThreshold value must be between 0 and 255/)
    });

    it("fails to create setOptions operation with an invalid medThreshold", function () {
        let opts = {
            medThreshold: 400,
        };
        expect(() => StellarBase.SetOptionsBuilder.setOptions(opts)).to.throw(/medThreshold value must be between 0 and 255/)
    });

    it("fails to create setOptions operation with an invalid highThreshold", function () {
        let opts = {
            highThreshold: 400,
        };
        expect(() => StellarBase.SetOptionsBuilder.setOptions(opts)).to.throw(/highThreshold value must be between 0 and 255/)
    });
});
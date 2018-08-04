describe('Pre Issuance request', function () {

    it("success", function (done) {
        let amount = "200.123";
        let reference = "test";
        let asset = "BLC";
        let keyPair = StellarBase.Keypair.random();
        var preIssuanceRequest = StellarBase.PreIssuanceRequest.build({
            amount,
            reference,
            asset,
            keyPair
        });
        var recovered = StellarBase.PreIssuanceRequest.dataFromXdr(preIssuanceRequest)
        expect(reference).to.be.equal(recovered.reference);
        expect(amount).to.be.equal(recovered.amount);
        expect(asset).to.be.equal(recovered.asset);
        expect(StellarBase.PreIssuanceRequest.isXdrPreIssuanceRequestSigned(preIssuanceRequest, keyPair)).to.be.true;
        done();
    });
});

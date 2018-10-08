describe('TransactionBuilder', function() {

    describe("constructs a native payment transaction with one operation", function() {
        var source;
        var amount;
        var transaction;
        var memo;
        var sourceBalanceId;
        var destinationBalanceId;
        var maxTotalFee;
        beforeEach(function () {
            source = new StellarBase.Account("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ", "0");
            amount = "1000";
            memo = StellarBase.Memo.id("100");
            maxTotalFee = '100';
            sourceBalanceId = StellarBase.Keypair.random().balanceId();
            destinationBalanceId = StellarBase.Keypair.random().balanceId();
            let sourceBalance = sourceBalanceId;
            let timebounds = {
                minTime: "1455287522",
                maxTime: "1455297545"
            };
            transaction = new StellarBase.TransactionBuilder(source, {sourceBalance, timebounds})
                .addOperation(StellarBase.Operation.payment({
                    amount: amount,
                    fixedFee: '0',
                    paymentFee: '0',
                    subject: 'test',
                    sourceBalanceId,
                    destinationBalanceId,
                    feeData: {
                        sourceFee: {
                            paymentFee: '0',
                            fixedFee: '10'
                        },
                        destinationFee: {
                            paymentFee: '0',
                            fixedFee: '10'
                        },
                        sourcePaysForDest: true
                    },
                }))
                .addMemo(memo)
                .addMaxTotalFee(maxTotalFee)
                .build();
        });

        it("should have the same source account", function (done) {
            expect(transaction.source)
                .to.be.equal(source.accountId());
            done()
        });


        it("should have one payment operation", function (done) {
            expect(transaction.operations.length).to.be.equal(1);
            expect(transaction.operations[0].type).to.be.equal("payment");
            done();
        });

        it("should have max total fee", function (done) {
            expect(transaction.maxTotalFee).to.be.equal(maxTotalFee);
            done();
        })
    });

    describe("constructs a native payment transaction with two operations", function() {
        var source;
        var sourceBalanceId;
        var destinationBalanceId1;
        var amount1;
        var destinationBalanceId2;
        var amount2;
        var transaction;
        beforeEach(function () {
            source = new StellarBase.Account("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ", "0");
            amount1 = "1000";
            amount2 = "2000";

            sourceBalanceId = StellarBase.Keypair.random().balanceId();
            destinationBalanceId1 = StellarBase.Keypair.random().balanceId();
            destinationBalanceId2 = StellarBase.Keypair.random().balanceId();

            let timebounds = {
                minTime: "1455287522",
                maxTime: "1455297545"
            };

            let sourceBalance = sourceBalanceId;
            transaction = new StellarBase.TransactionBuilder(source, {sourceBalance, timebounds})
              .addOperation(StellarBase.Operation.payment({
                  amount: amount1,
                  fixedFee: '0',
                  paymentFee: '0',
                  subject: 'test',
                  sourceBalanceId,
                  destinationBalanceId: destinationBalanceId1,
                  feeData: {
                      sourceFee: {
                          paymentFee: '0',
                          fixedFee: '10'
                      },
                      destinationFee: {
                          paymentFee: '0',
                          fixedFee: '10'
                      },
                      sourcePaysForDest: true
                  }
              }))
              .addOperation(StellarBase.Operation.payment({
                  amount: amount2,
                  fixedFee: '0',
                  paymentFee: '0',
                  subject: 'test',
                  sourceBalanceId,
                  destinationBalanceId: destinationBalanceId2,
                  feeData: {
                      sourceFee: {
                          paymentFee: '0',
                          fixedFee: '10'
                      },
                      destinationFee: {
                          paymentFee: '0',
                          fixedFee: '10'
                      },
                      sourcePaysForDest: true
                  }
              }))
              .build();
        });

        it("should have the same source account", function (done) {
            expect(transaction.source)
              .to.be.equal(source.accountId());
            done()
        });

        it("should have two payment operation", function (done) {
            expect(transaction.operations.length).to.be.equal(2);
            expect(transaction.operations[0].type).to.be.equal("payment");
            expect(transaction.operations[1].type).to.be.equal("payment");
            done();
        });
    });

    describe("constructs a native payment transaction with timebounds", function() {
        it("should have have timebounds", function (done) {
            let source = new StellarBase.Account("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ", "0");
            let timebounds = {
                minTime: "1455287522",
                maxTime: "1455297545"
            };
            let sourceBalanceId = StellarBase.Keypair.random().balanceId();
            let destinationBalanceId = StellarBase.Keypair.random().balanceId();
            let transaction = new StellarBase.TransactionBuilder(source, {timebounds})
              .addOperation(StellarBase.Operation.payment({
                  amount: "1000",
                  fixedFee: '0',
                  paymentFee: '0',
                  subject: 'test',
                  sourceBalanceId,
                  destinationBalanceId,
                  feeData: {
                      sourceFee: {
                          paymentFee: '0',
                          fixedFee: '10'
                      },
                      destinationFee: {
                          paymentFee: '0',
                          fixedFee: '10'
                      },
                      sourcePaysForDest: true
                  }
              }))
              .build();

            expect(transaction.timeBounds.minTime).to.be.equal(timebounds.minTime);
            expect(transaction.timeBounds.maxTime).to.be.equal(timebounds.maxTime);
            done();
        });
    });
});

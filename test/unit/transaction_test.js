describe('Transaction', function() {

  it("constructs Transaction object from a TransactionEnvelope", function(done) {
    let source      = new StellarBase.Account("GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB", "0");
    let amount      = "2000";
    let sourceBalanceId = StellarBase.Keypair.random().balanceId();
    let destinationBalanceId = StellarBase.Keypair.random().balanceId();
    let timebounds = {
        minTime: "1455287522",
        maxTime: "1455297545"
    };
    let input = new StellarBase.TransactionBuilder(source, {timebounds})
                .addOperation(StellarBase.Operation.payment({
                        amount,
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
                    })
                )
                .addMemo(StellarBase.Memo.text('Happy birthday!'))
                .build()
                .toEnvelope()
                .toXDR('base64');


    var transaction = new StellarBase.Transaction(input);
    var operation = transaction.operations[0];

    expect(transaction.source).to.be.equal(source.accountId());
    expect(transaction.memo.text()).to.be.equal('Happy birthday!');
    expect(operation.type).to.be.equal('payment');
    expect(operation.amount).to.be.equal(amount);

    done();
  });


  it("signs correctly", function() {
    let source      = new StellarBase.Account("GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB", "0");
    let sourceBalanceId = StellarBase.Keypair.random().balanceId();
    let destinationBalanceId = StellarBase.Keypair.random().balanceId();
    let amount      = "2000";
    let signer      = StellarBase.Keypair.master();
    let timebounds = {
        minTime: "1455287522",
        maxTime: "1455297545"
    };
    let tx = new StellarBase.TransactionBuilder(source, {timebounds})
                .addOperation(StellarBase.Operation.payment({
                    amount,
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
    tx.sign(signer);

    let env = tx.toEnvelope();

    let rawSig = env.signatures()[0].signature();
    let verified = signer.verify(tx.hash(), rawSig);
    expect(verified).to.equal(true);
  });


  it("accepts 0 as a valid fixed fee", function(done) {
    let source      = new StellarBase.Account("GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB", "0");
    let amount      = "2000";
    let fee         = 0;
    let sourceBalanceId = StellarBase.Keypair.random().balanceId();
    let destinationBalanceId = StellarBase.Keypair.random().balanceId();
    let timebounds = {
        minTime: "1455287522",
        maxTime: "1455297545"
    };

    let input = new StellarBase.TransactionBuilder(source, {fee: 0, timebounds})
                .addOperation(StellarBase.Operation.payment({
                        amount,
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
                    })
                )
                .addMemo(StellarBase.Memo.text('Happy birthday!'))
                .build()
                .toEnvelope()
                .toXDR('base64');


    var transaction = new StellarBase.Transaction(input);
    var operation = transaction.operations[0];

    expect(operation.amount).to.be.equal(amount);

    done();
  });

});

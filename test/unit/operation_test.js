import BigNumber from 'bignumber.js';
import { Hyper } from "js-xdr";

describe('Operation', function () {

    describe(".createAccount()", function () {
        it("creates a createAccountOp general", function () {
            var destination = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var recoveryKey = "GDZXNSOUESYZMHRC3TZRN4VXSIOT47MDDUVD6U7CWXHTDLXVVGU64LVV";
            var accountType = StellarBase.xdr.AccountType.general().value;
            let op = StellarBase.Operation.createAccount({ destination, recoveryKey, accountType});
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("createAccount");
            expect(obj.destination).to.be.equal(destination);
            expect(obj.recoveryKey).to.be.equal(recoveryKey);
            expect(obj.accountType).to.be.equal(accountType);
        });

        it("fails to create createAccount operation with an invalid destination address", function () {
            let opts = {
                destination: 'GCEZW',
                accountType: StellarBase.xdr.AccountType.general().value,
                source: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
            };
            expect(() => StellarBase.Operation.createAccount(opts)).to.throw(/destination is invalid/)
        });

        it("fails to create createAccount operation with an invalid recovery address", function () {
            let opts = {
                destination: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
                recoveryKey: "GCEZ",
                accountType: StellarBase.xdr.AccountType.general().value,
            };
            expect(() => StellarBase.Operation.createAccount(opts)).to.throw(/recoveryKey is invalid/)
        })

        it("fails to create createAccount operation with an invalid source address", function () {
            let opts = {
                destination: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
                recoveryKey: "GDZXNSOUESYZMHRC3TZRN4VXSIOT47MDDUVD6U7CWXHTDLXVVGU64LVV",
                accountType: StellarBase.xdr.AccountType.general().value,
                source: 'GCEZ',
            };
            expect(() => StellarBase.Operation.createAccount(opts)).to.throw(/Source address is invalid/)
        });
        it("fails to create createAccount operation with an invalid account type", function () {
            let opts = {
                destination: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
                recoveryKey: "GDZXNSOUESYZMHRC3TZRN4VXSIOT47MDDUVD6U7CWXHTDLXVVGU64LVV",
                source: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
            };
            expect(() => StellarBase.Operation.createAccount(opts)).to.throw(/XDR Read Error: Unknown AccountType member for value undefined/)
        });
        it("fails to create createAccount with negative policies", function() {
            let opts = {
                destination: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
                source: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ",
                recoveryKey: "GDZXNSOUESYZMHRC3TZRN4VXSIOT47MDDUVD6U7CWXHTDLXVVGU64LVV",
                accountType: StellarBase.xdr.AccountType.general().value,
                accountPolicies: -1,
            };
            expect(() => StellarBase.Operation.createAccount(opts)).to.throw(/accountPolicies should be positive or zero/);
        });
    });

    describe(".payment()", function () {
        let sourceBalanceId = StellarBase.Keypair.random().balanceId()
        let destinationBalanceId = StellarBase.Keypair.random().balanceId()
        it("creates a paymentOp", function () {
            var destination = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var amount = "1000";
            let op = StellarBase.Operation.payment({
                destination, amount,
                subject: 'subj',
                sourceBalanceId,
                destinationBalanceId,
                reference: 'ref',
                invoiceReference: {
                    invoiceId: '777',
                    accept: false
                },
                feeData: {
                    sourceFee: {
                        paymentFee: '120',
                        fixedFee: '110'
                    },
                    destinationFee: {
                        paymentFee: '20',
                        fixedFee: '10'
                    },
                    sourcePaysForDest: true
                }
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("payment");
            expect(operation.body().value().amount().toString()).to.be.equal('1000000000');
            expect(obj.amount).to.be.equal(amount);
            expect(obj.subject).to.be.equal('subj');
            expect(obj.reference).to.be.equal('ref');
            expect(obj.sourceBalanceId).to.be.equal(sourceBalanceId);
            expect(obj.destinationBalanceId).to.be.equal(destinationBalanceId);
            expect(obj.invoiceReference.invoiceId).to.be.equal('777');
            expect(obj.invoiceReference.accept).to.be.equal(false);
            expect(obj.feeData.sourcePaysForDest).to.be.equal(true);
            expect(obj.feeData.sourceFee.fixedFee).to.be.equal('110');
            expect(obj.feeData.sourceFee.paymentFee).to.be.equal('120');
            expect(obj.feeData.destinationFee.fixedFee).to.be.equal('10');
            expect(obj.feeData.destinationFee.paymentFee).to.be.equal('20');
            expect(StellarBase.Operation.isPayment(op)).to.be.equal(true);
        });

        it("fails to create payment operation without feeData", function () {
            let opts = {
                amount: '20',
                fixedFee: '0',
                subject: 'subj',
                sourceBalanceId,
                destinationBalanceId,
            };
            expect(() => StellarBase.Operation.payment(opts)).to.throw(/feeData argument must be defined/)
        });

        it("fails to create payment operation with an invalid amount", function () {
            let opts = {
                amount: 20,
                fixedFee: '0',
                paymentFee: '0',
                subject: 'subj',
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
            };
            expect(() => StellarBase.Operation.payment(opts)).to.throw(/amount argument must be of type String/)
        });
        it("fails to create payment operation with an invalid subject", function () {
            let opts = {
                amount: '20',
                fixedFee: '0',
                paymentFee: '0',
                subject: 12123,
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
            };
            expect(() => StellarBase.Operation.payment(opts)).to.throw(/subject argument must be of type String 0-256 long/)
        });

        it("fails to create payment operation with an invalid sourceBalanceId", function () {
            let opts = {
                amount: '20',
                fixedFee: '0',
                paymentFee: '0',
                subject: '12123',
                sourceBalanceId: 123,
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
            };
            expect(() => StellarBase.Operation.payment(opts)).to.throw(/sourceBalanceId is invalid/)
        });

        it("fails to create payment operation with an invalid destinationBalanceId", function () {
            let opts = {
                amount: '20',
                fixedFee: '0',
                paymentFee: '0',
                subject: '12123',
                sourceBalanceId,
                destinationBalanceId: 123,
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
            };
            expect(() => StellarBase.Operation.payment(opts)).to.throw(/destinationBalanceId is invalid/)
        });
    });


    describe(".directDebit()", function () {
        let sourceBalanceId = StellarBase.Keypair.random().balanceId()
        let destinationBalanceId = StellarBase.Keypair.random().balanceId()
        let from = StellarBase.Keypair.random().accountId()
        it("creates a directDebitOp", function () {
            var destination = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var amount = "1000";
            let op = StellarBase.Operation.directDebit({
                paymentOp: {
                    destination, amount,
                    subject: 'subj',
                    sourceBalanceId,
                    destinationBalanceId,
                    reference: 'ref',
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
                },
                from
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("directDebit");
            expect(obj.amount).to.be.equal(amount);
            expect(obj.subject).to.be.equal('subj');
            expect(obj.reference).to.be.equal('ref');
            expect(obj.sourceBalanceId).to.be.equal(sourceBalanceId);
            expect(obj.destinationBalanceId).to.be.equal(destinationBalanceId);
            expect(obj.from).to.be.equal(from);
            expect(obj.feeData.sourcePaysForDest).to.be.equal(true);
            expect(StellarBase.Operation.isPayment(op)).to.be.equal(false);
        });

        it("fails to create directDebit operation without feeData", function () {
            let opts = {
                paymentOp: {
                    amount: '20',
                    subject: 'subj',
                    sourceBalanceId,
                    destinationBalanceId
                },
                from
            };
            expect(() => StellarBase.Operation.directDebit(opts)).to.throw(/feeData argument must be defined/)
        });

        it("fails to create directDebit operation with invalid from", function () {
            let opts = {
                paymentOp: {
                    amount: '20',
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
                    subject: 'subj',
                    sourceBalanceId,
                    destinationBalanceId
                },
                from: 123
            };
            expect(() => StellarBase.Operation.directDebit(opts)).to.throw(/from is invalid/)
        });

    });

    describe(".manageAccount()", function () {
        it("creates a manageAccountOp block", function () {
            var account = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var blockReasonsToAdd = 1;
            var blockReasonsToRemove = 2;
            var accountType = StellarBase.xdr.AccountType.operational().value;
            let op = StellarBase.Operation.manageAccount({account, blockReasonsToAdd, blockReasonsToRemove,
                accountType,
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageAccount");
            expect(obj.accountType).to.be.equal(accountType);
            expect(obj.account).to.be.equal(account);
            expect(obj.blockReasonsToAdd).to.be.equal(blockReasonsToAdd);
            expect(obj.blockReasonsToRemove).to.be.equal(blockReasonsToRemove);
        });
        it("creates a manageAccountOp without block", function () {
            var account = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var accountType = StellarBase.xdr.AccountType.operational().value;
            let op = StellarBase.Operation.manageAccount({ account, accountType });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageAccount");
            expect(obj.account).to.be.equal(account);
            expect(obj.blockReasonsToAdd).to.be.equal(0);
            expect(obj.blockReasonsToRemove).to.be.equal(0);
        });

        it("fails to create manageAccountOp operation with an invalid account", function () {
            let opts = {
                account: 'GCEZW',
                accountType: StellarBase.xdr.AccountType.operational().value
            };
            expect(() => StellarBase.Operation.manageAccount(opts)).to.throw(/account is invalid/)
        });

        it("fails to create manageAccount operation with an invalid source address", function () {
            let opts = {
                account: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
                source: 'GCEZ',
                accountType: StellarBase.xdr.AccountType.operational().value
            };
            expect(() => StellarBase.Operation.manageAccount(opts)).to.throw(/Source address is invalid/)
        });
        it("fails to create manageAccount operation with an undefined accountType", function () {
            let opts = {
                account: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
                block: true,
            };
            expect(() => StellarBase.Operation.manageAccount(opts)).to.throw(/accountType should be defined/)
        });
    });

    describe(".setFees", function () {
        it("valid setFees", function () {
            let feeType = StellarBase.xdr.FeeType.paymentFee();
            var opts = {
                fee: {
                    feeType: feeType,
                    percentFee: '10',
                    fixedFee: '1',
                    asset: 'ETC',
                    accountId: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
                    subtype: '3',
                    upperBound: '123',
                },
            };
            let op = StellarBase.Operation.setFees(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("setFee");
            expect(obj.fee.percentFee).to.be.equal('10');
            expect(obj.fee.fixedFee).to.be.equal('1');
            expect(obj.fee.feeType).to.be.equal(feeType);
            expect(obj.fee.upperBound).to.be.equal('123');
            expect(obj.fee.lowerBound).to.be.equal('0');
            expect(obj.fee.subtype).to.be.equal('3');
            expect(obj.fee.accountId).to.be.equal("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ");
            expect(obj.fee.hash.toString()).to.be.equal(StellarBase.hash("type:0asset:ETCsubtype:3accountID:GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ").toString());
            expect(obj.fee.asset).to.be.equal('ETC');
        });

        it("fails to create setFees operation with an invalid FeeType", function () {
            var opts = {
                fee: {
                    feeType: 1,
                    percentFee: '1',
                    fixedFee: "2",
                    asset: 'ETC'
                },
            };
            expect(() => StellarBase.Operation.setFees(opts)).to.throw(/feeType must be xdr.FeeType/)
        });

        it("fails to create setFees operation with an invalid asset", function () {
            var opts = {
                fee: {
                    feeType: StellarBase.xdr.FeeType.paymentFee(),
                    percentFee: '1',
                    fixedFee: "2",
                    asset: ''
                },
            };
            expect(() => StellarBase.Operation.setFees(opts)).to.throw(/Asset is invalid/)
        });


        it("fails to create setFees operation with an invalid percentFee", function () {
            let feeType = StellarBase.xdr.FeeType.paymentFee();
            var opts = {
                fee: {
                    feeType: feeType,
                    fixedFee: '0',
                    percentFee: 'abs',
                    asset: 'ETC'
                },
            };
            expect(() => StellarBase.Operation.setFees(opts)).to.throw(/percentFee argument must be of type String and represent a non-negative number less than 100/)
        });

        it("fails to create setFees operation with an invalid fixedFee", function () {
            let feeType = StellarBase.xdr.FeeType.paymentFee();
            var opts = {
                fee: {
                    feeType: feeType,
                    fixedFee: '',
                    percentFee: '11',
                    asset: 'ETC'
                },
            };
            expect(() => StellarBase.Operation.setFees(opts)).to.throw(/fixedFee argument must be of type String and represent a non-negative number/)
        });
    });

    describe(".manageBalance", function () {
        let account = StellarBase.Keypair.random();
        let asset = 'ETH';
        it("valid manageBalance", function () {
            let operationType = StellarBase.xdr.OperationType.manageBalance();
            var opts = {
                destination: account.accountId(),
                action: StellarBase.xdr.ManageBalanceAction.create(),
                asset,
            };
            let op = StellarBase.Operation.manageBalance(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageBalance");
            expect(obj.destination).to.be.equal(account.accountId());
            expect(obj.action).to.be.equal(StellarBase.xdr.ManageBalanceAction.create());
        });


        it("fails to create manageBalance operation with an invalid account", function () {
            var opts = {
                destination: account,
                action: StellarBase.xdr.ManageBalanceAction.create(),
                asset,
            };
            expect(() => StellarBase.Operation.manageBalance(opts)).to.throw(/account is invalid/)
        });

        it("fails to create manageBalance operation with an invalid action", function () {
            let operationType = StellarBase.xdr.OperationType.manageAccount();
            var opts = {
                destination: account.accountId(),
                action: 1,
                asset,
            };
            expect(() => StellarBase.Operation.manageBalance(opts)).to.throw(/action argument should be value of xdr.ManageBalanceAction enum/)
        });

        it("fails to create manageBalance operation with an invalid asset", function () {
            let operationType = StellarBase.xdr.OperationType.manageAccount();
            var opts = {
                destination: account.accountId(),
                action: StellarBase.xdr.ManageBalanceAction.create(),
                asset: 123,
            };
            expect(() => StellarBase.Operation.manageBalance(opts)).to.throw(/asset is invalid/)
        });

    });

    describe(".manageAssetPair", function () {
        let base = 'ETH';
        let quote = "USD";
        let policies = 1;
        let physicalPriceCorrection = "12.2";
        let maxPriceStep = "200.1";
        let physicalPrice ="12.12";
        it("valid manageAssetPair", function () {
            var opts = {
                action: StellarBase.xdr.ManageAssetPairAction.create(),
                quote,
                base,
                physicalPriceCorrection,
                maxPriceStep,
                policies,
                physicalPrice
            };
            let op = StellarBase.Operation.manageAssetPair(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageAssetPair");
            expect(obj.base).to.be.equal(base);
            expect(obj.quote).to.be.equal(quote);
            expect(obj.action).to.be.equal(StellarBase.xdr.ManageAssetPairAction.create());
            expect(operation.body().value().physicalPriceCorrection().toString()).to.be.equal('12200000');
            expect(operation.body().value().maxPriceStep().toString()).to.be.equal('200100000');
            expect(operation.body().value().physicalPrice().toString()).to.be.equal('12120000');
            expect(obj.physicalPriceCorrection).to.be.equal(physicalPriceCorrection);
            expect(obj.maxPriceStep).to.be.equal(maxPriceStep);
        });

    });

    describe("._checkUnsignedIntValue()", function () {
        it("returns true for valid values", function () {
            let values = [
                { value: 0, expected: 0 },
                { value: 10, expected: 10 },
                { value: "0", expected: 0 },
                { value: "10", expected: 10 },
                { value: undefined, expected: undefined }
            ];

            for (var i in values) {
                let {value, expected} = values[i];
                expect(StellarBase.Operation._checkUnsignedIntValue(value, value)).to.be.equal(expected);
            }
        });

        it("throws error for invalid values", function () {
            let values = [
                {},
                [],
                "", // empty string
                "test", // string not representing a number
                "0.5",
                "-10",
                "-10.5",
                "Infinity",
                Infinity,
                "Nan",
                NaN
            ];

            for (var i in values) {
                let value = values[i];
                expect(() => StellarBase.Operation._checkUnsignedIntValue(value, value)).to.throw();
            }
        });

        it("return correct values when isValidFunction is set", function () {
            expect(
                StellarBase.Operation._checkUnsignedIntValue("test", undefined, value => value < 10)
            ).to.equal(undefined);

            expect(
                StellarBase.Operation._checkUnsignedIntValue("test", 8, value => value < 10)
            ).to.equal(8);
            expect(
                StellarBase.Operation._checkUnsignedIntValue("test", "8", value => value < 10)
            ).to.equal(8);

            expect(() => {
                StellarBase.Operation._checkUnsignedIntValue("test", 12, value => value < 10);
            }).to.throw();
            expect(() => {
                StellarBase.Operation._checkUnsignedIntValue("test", "12", value => value < 10);
            }).to.throw();
        });
    });


    describe(".isValidAmount()", function () {
        it("returns true for valid amounts", function () {
            let amounts = [
                "10",
                "0.10",
                "0.1234",
                "922337203685.4775" // MAX
            ];

            for (var i in amounts) {
                expect(StellarBase.Operation.isValidAmount(amounts[i])).to.be.equal(true);
            }
        });

        it("returns false for invalid amounts", function () {
            let amounts = [
                100, // integer
                100.50, // float
                "", // empty string
                "test", // string not representing a number
                "0",
                "-10",
                "-10.5",
                "0.12345678",
                "922337203685.4775808", // Overflow
                "Infinity",
                Infinity,
                "Nan",
                NaN
            ];

            for (var i in amounts) {
                expect(StellarBase.Operation.isValidAmount(amounts[i])).to.be.equal(false);
            }
        });

        it("allows 0 only if allowZero argument is set to true", function () {
            expect(StellarBase.Operation.isValidAmount("0")).to.be.equal(false);
            expect(StellarBase.Operation.isValidAmount("0", true)).to.be.equal(true);
        });
    });
});

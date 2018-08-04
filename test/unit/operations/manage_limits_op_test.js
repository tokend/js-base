import isEqual from "lodash/isEqual";
import {ManageLimitsBuilder} from "../../../src/operations/manage_limits_builder";

describe(".manageLimits", function () {
    let account = StellarBase.Keypair.random();
    let accountType = 1;
    let statsOpType = 3;
    it("valid createLimits for accountID", function () {
        var opts = {
            accountID: account.accountId(),
            statsOpType: statsOpType,
            assetCode: 'USD',
            isConvertNeeded: false,
            dailyOut: '1',
            weeklyOut: '2',
            monthlyOut: '3',
            annualOut: '5'
        };
        let op = ManageLimitsBuilder.createLimits(opts);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("manageLimit");
        expect(obj.account).to.be.equal(account.accountId());
        expect(obj.statsOpType).to.be.equal(statsOpType);
        expect(obj.assetCode).to.be.equal("USD");
        expect(obj.isConvertNeeded).to.be.equal(false);
        expect(obj.dailyOut).to.be.equal('1');
        expect(obj.weeklyOut).to.be.equal('2');
        expect(obj.monthlyOut).to.be.equal('3');
        expect(obj.annualOut).to.be.equal('5');
    });
    it("valid createLimits for account type", function () {
        var opts = {
            accountType: accountType,
            statsOpType: statsOpType,
            assetCode: 'USD',
            isConvertNeeded: false,
            dailyOut: '1',
            weeklyOut: '2',
            monthlyOut: '3',
            annualOut: '5'
        };
        let op = ManageLimitsBuilder.createLimits(opts);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("manageLimit");
        expect(obj.accountType).to.be.equal(accountType);
        expect(obj.statsOpType).to.be.equal(statsOpType);
        expect(obj.assetCode).to.be.equal("USD");
        expect(obj.isConvertNeeded).to.be.equal(false);
        expect(obj.dailyOut).to.be.equal('1');
        expect(obj.weeklyOut).to.be.equal('2');
        expect(obj.monthlyOut).to.be.equal('3');
        expect(obj.annualOut).to.be.equal('5');
    });
    it("invalid createLimits for account type and accountID simultaneously", function () {
        var opts = {
            accountID: account.accountId(),
            accountType: accountType,
            statsOpType: statsOpType,
            assetCode: 'USD',
            isConvertNeeded: false,
            dailyOut: '1',
            weeklyOut: '2',
            monthlyOut: '3',
            annualOut: '5'
        };
        expect(() => ManageLimitsBuilder.createLimits(opts)).to.throw(/opts.accountID and opts.accountType cannot be set for same limits/);
    });
    it("valid removeLimits", function () {
        var opts = {
            id: '1',
        };
        let op = ManageLimitsBuilder.removeLimits(opts);
        var xdr = op.toXDR("hex");
        var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
        var obj = StellarBase.Operation.operationToObject(operation);
        expect(obj.type).to.be.equal("manageLimit");
        expect(obj.id).to.be.equal('1');
    });
});
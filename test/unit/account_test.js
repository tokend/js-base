
describe('Account.constructor', function() {
  it("fails to create Account object from an invalid address", function() {
    expect(() => new StellarBase.Account('GBBB')).to.throw(/accountId is invalid/);
  });

  it("creates an Account object", function() {
    let account = new StellarBase.Account('GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB');
    expect(account.accountId()).to.equal("GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB");
  });
});

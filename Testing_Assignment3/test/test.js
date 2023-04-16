var assert = require("assert");
var ref = require("../purchaseOrder-updated-for-3-F22");

describe("Structural Testing", function () {
  class clientAccount {
    constructor(age, balance, creditScore) {
      this.age = age;
      this.balance = balance;
      this.creditScore = creditScore;
    }
  }
  describe("creditStatus", function () {
    let tc1 = new clientAccount(15, 3000, -1);
    let tc2 = new clientAccount(15, 3000, 101);
    let tc3 = new clientAccount(15, 3000, 40);
    let tc4 = new clientAccount(15, 3000, 50);
    let tc5 = new clientAccount(15, 3000, 50);
    let tc6 = new clientAccount(15, 3000, 80);
    let tc7 = new clientAccount(15, 3000, -1);
    let tc8 = new clientAccount(15, 3000, 101);
    it("should be not-allowed due to -1 credit score and restricted", function () {
      assert.strictEqual(ref.creditStatus(tc1, "restricted"), "not-allowed");
    });
    it("should be not-allowed due to 101 credit score and restricted", function () {
      assert.strictEqual(ref.creditStatus(tc2, "restricted"), "not-allowed");
    });
    it("should be low due to 40 credit score and restricted", function () {
      assert.strictEqual(ref.creditStatus(tc3, "restricted"), "low");
    });
    it("should be high due to 50 credit score and restricted", function () {
      assert.strictEqual(ref.creditStatus(tc4, "restricted"), "high");
    });
    it("should be low due to 50 credit score and neither restricted or default CRK", function () {
      assert.strictEqual(ref.creditStatus(tc4, "something"), "low");
    });
    it("should be low due to 50 credit score with default", function () {
      assert.strictEqual(ref.creditStatus(tc5, "default"), "low");
    });
    it("should be high due to 80 credit score with default", function () {
      assert.strictEqual(ref.creditStatus(tc6, "default"), "high");
    });
    it("should be not-allowed due to -1 credit score and default", function () {
      assert.strictEqual(ref.creditStatus(tc7, "default"), "not-allowed");
    });
    it("should be not-allowed due to -1 credit score and default", function () {
      assert.strictEqual(ref.creditStatus(tc8, "default"), "not-allowed");
    });
  });
  describe("productStatus", function () {
    it("should be invalid due to empty inventory", function () {
      assert.strictEqual(ref.productStatus("apple", [], 100), "invalid");
    });
    it("should be invalid due to product name not found in  inventory", function () {
      assert.strictEqual(
        ref.productStatus("apple", [{ name: "banana", quantity: 50 }], 100),
        "invalid"
      );
    });
    it("should be soldout due to q is 0", function () {
      assert.strictEqual(
        ref.productStatus("apple", [{ name: "apple", quantity: 0 }], 100),
        "soldout"
      );
    });
    it("should be available-to-all due to q>= inventory threshold", function () {
      assert.strictEqual(
        ref.productStatus("apple", [{ name: "apple", quantity: 500 }], 100),
        "available-to-all"
      );
    });
    it("should be limited due to q< inventory threshold", function () {
      assert.strictEqual(
        ref.productStatus("apple", [{ name: "apple", quantity: 100 }], 150),
        "limited"
      );
    });
    it("should be soldout due to q is 0 for banana", function () {
      assert.strictEqual(
        ref.productStatus(
          "banana",
          [
            { name: "apple", quantity: 100 },
            { name: "banana", quantity: 0 },
          ],
          100
        ),
        "soldout"
      );
    });
    it("should be available-to-all due to banana q>= inventory threshold", function () {
      assert.strictEqual(
        ref.productStatus(
          "banana",
          [
            { name: "apple", quantity: 0 },
            { name: "banana", quantity: 500 },
          ],
          100
        ),
        "available-to-all"
      );
    });
    it("should be limited due to banana q< inventory threshold", function () {
      assert.strictEqual(
        ref.productStatus(
          "banana",
          [
            { name: "apple", quantity: 500 },
            { name: "banana", quantity: 100 },
          ],
          150
        ),
        "limited"
      );
    });
  });
});

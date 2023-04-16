var assert = require("assert");
var ref = require("../purchaseOrder");

var sinon = require("sinon");
//List all of the test values in array
var testAgesEC = [10, 100, 17, 30, 40, 60, 80];
var testBalancesEC = [-10, 5500, 50, 300, 750, 1500, 3000];
var expectedAgeFactors = [0, 0, 10, 15, 50, 40, 25];
var expectedBalFactors = [0, 0, 5, 15, 30, 50, 100];
var testCreditEC = [
  [-20, "restricted"],
  [120, "default"],
  [40, "restricted"],
  [70, "default"],
  [60, "restricted"],
  [90, "default"],
];
var expectedCreditFactorsEC = [
  "not-allowed",
  "not-allowed",
  "low",
  "low",
  "high",
  "high",
];
var testAccountEC = [0, 50, 225, 375, 750, 4000];
var expectedAccountEC = [
  "not-eligible",
  "very-low",
  "low",
  "medium",
  "high",
  "excellent",
];

var testProductEC = [
  ["brocoli", [{ name: "apple", quantity: 105 }], 100],
  ["apple", [{ name: "apple", quantity: 0 }], 100],
  ["apple", [{ name: "apple", quantity: 145 }], 150],
  ["apple", [{ name: "apple", quantity: 105 }], 100],
];
var expectedProductStatusEC = [
  "invalid",
  "soldout",
  "limited",
  "available-to-all",
];

var testAgesB = [14, 95, 15, 24, 25, 34, 35, 54, 55, 64, 65, 94];
var expectedAgeFactorsB = [0, 0, 10, 10, 15, 15, 50, 50, 40, 40, 25, 25];
var testBalancesB = [
  0, 5000, 1, 99, 100, 499, 500, 999, 1000, 1999, 2000, 4999,
];
var expectedBalFactorsB = [0, 0, 5, 5, 15, 15, 30, 30, 50, 50, 100, 100];
var testCreditB = [
  [-1, "restricted"],
  [101, "default"],
  [0, "restricted"],
  [0, "default"],
  [49, "restricted"],
  [79, "default"],
  [50, "restricted"],
  [80, "default"],
  [100, "restricted"],
  [100, "default"],
];
var expectedCreditFactorsB = [
  "not-allowed",
  "not-allowed",
  "low",
  "low",
  "low",
  "low",
  "high",
  "high",
  "high",
  "high",
];

var testAccountB = [0, 1, 99, 100, 299, 300, 699, 700, 999, 1000, 1001];
var expectedAccountB = [
  "not-eligible",
  "very-low",
  "very-low",
  "low",
  "low",
  "medium",
  "medium",
  "high",
  "high",
  "excellent",
  "excellent",
];

var testProductB = [
  ["apple", [{ name: "apple", quantity: 0 }], 0],
  ["apple", [{ name: "apple", quantity: 101 }], 101],
  ["apple", [{ name: "apple", quantity: 100 }], 101],
  ["brocoli", [{ name: "apple", quantity: 0 }], 100],
];
var expectedProductStatusB = [
  "soldout",
  "available-to-all",
  "limited",
  "invalid",
];

describe("Equivalence Class", function () {
  //EC for getAgeFactor. Loops through each test case and pass the age to getAgefactor
  describe("getAgeFactor()", function () {
    for (let i = 0; i < testAgesEC.length; ++i) {
      it(
        "should return " +
          expectedAgeFactors[i] +
          " where age = " +
          testAgesEC[i],
        () => {
          let a = {};
          a["age"] = testAgesEC[i];
          assert.strictEqual(ref.getAgeFactor(a), expectedAgeFactors[i]);
        }
      );
    }
  });
  //EC for getAgeFactor. similar to getAgeFactor
  describe("getBalanceFactor()", function () {
    for (let i = 0; i < testBalancesEC.length; ++i) {
      it(
        "should return " +
          expectedBalFactors[i] +
          " where balance = " +
          testBalancesEC[i],
        () => {
          let b = {};
          b["balance"] = testBalancesEC[i];
          assert.strictEqual(ref.getBalanceFactor(b), expectedBalFactors[i]);
        }
      );
    }
  });
  //Account Status EC, Have to use aftereach to reset the stub and hard-coded it such that it returns the actual account factor(not from ageFactor * balanceFactor) * 1.
  // Use the test case account factor to determine accountstatus
  describe("accountStatus()", function () {
    afterEach(() => {
      ref.getAgeFactor.restore();
      ref.getBalanceFactor.restore();
    });
    for (let i = 0; i < testAccountEC.length; ++i) {
      it(
        "should be " +
          expectedAccountEC[i] +
          " when accountFactor = " +
          testAccountEC[i],
        () => {
          let a = {};
          sinon.stub(ref, "getAgeFactor").onCall(0).returns(testAccountEC[i]);
          sinon.stub(ref, "getBalanceFactor").onCall(0).returns(1);
          assert.equal(ref.accountStatus(a), expectedAccountEC[i]);
        }
      );
    }
  });
  //EC for credit Status by passing creditScore as an object
  describe("creditStatus()", function () {
    for (let i = 0; i < testCreditEC.length; ++i) {
      it(
        "should return " +
          expectedCreditFactorsEC[i] +
          " where credit = " +
          testCreditEC[i],
        () => {
          let a = { creditScore: testCreditEC[i][0] };
          assert.strictEqual(
            ref.creditStatus(a, testCreditEC[i][1]),
            expectedCreditFactorsEC[i]
          );
        }
      );
    }
  });
  //EC for product Status. pass product name, inventory and threshold to the function
  describe("productStatus()", function () {
    for (let i = 0; i < testProductEC.length; ++i) {
      it(
        "should be " +
          expectedProductStatusEC[i] +
          " when product, inventory, threshold = " +
          testProductEC[i],
        () => {
          assert.equal(
            ref.productStatus(
              testProductEC[i][0],
              testProductEC[i][1],
              testProductEC[i][2]
            ),
            expectedProductStatusEC[i]
          );
        }
      );
    }
  });
});
describe("Boundary Classes", function () {
  //Boundary Class for getAgeFactor
  describe("getAgeFactor()", function () {
    for (let i = 0; i < testAgesB.length; ++i) {
      it(
        "should return " +
          expectedAgeFactorsB[i] +
          " where age = " +
          testAgesB[i],
        () => {
          let a = {};
          a["age"] = testAgesB[i];
          assert.strictEqual(ref.getAgeFactor(a), expectedAgeFactorsB[i]);
        }
      );
    }
  });
  //Boundary Class for getBalanceFactor
  describe("getBalanceFactor()", function () {
    for (let i = 0; i < testBalancesB.length; ++i) {
      it(
        "should return " +
          expectedBalFactorsB[i] +
          " where balance = " +
          testBalancesB[i],
        () => {
          let b = {};
          b["balance"] = testBalancesB[i];
          assert.strictEqual(ref.getBalanceFactor(b), expectedBalFactorsB[i]);
        }
      );
    }
  });
  //Boundary Class for accountStatus
  describe("accountStatus()", function () {
    afterEach(() => {
      ref.getAgeFactor.restore();
      ref.getBalanceFactor.restore();
    });
    for (let i = 0; i < testAccountB.length; ++i) {
      it(
        "should be " +
          expectedAccountB[i] +
          " when accountFactor = " +
          testAccountB[i],
        () => {
          let a = {};
          sinon.stub(ref, "getAgeFactor").onCall(0).returns(testAccountB[i]);
          sinon.stub(ref, "getBalanceFactor").onCall(0).returns(1);
          assert.equal(ref.accountStatus(a), expectedAccountB[i]);
        }
      );
    }
  });
  //Boundary Class for creditStatus
  describe("creditStatus()", function () {
    for (let i = 0; i < testCreditB.length; ++i) {
      it(
        "should return " +
          expectedCreditFactorsB[i] +
          " where credit = " +
          testCreditB[i],
        () => {
          let a = { creditScore: testCreditB[i][0] };
          assert.strictEqual(
            ref.creditStatus(a, testCreditB[i][1]),
            expectedCreditFactorsB[i]
          );
        }
      );
    }
  });
  //Boundary Class for productStatus
  describe("productStatus()", function () {
    for (let i = 0; i < testProductB.length; ++i) {
      it(
        "should be " +
          expectedProductStatusB[i] +
          " when product, inventory, threshold = " +
          testProductB[i],
        () => {
          assert.equal(
            ref.productStatus(
              testProductB[i][0],
              testProductB[i][1],
              testProductB[i][2]
            ),
            expectedProductStatusB[i]
          );
        }
      );
    }
  });
});
//EC for OrderHandling. Essentially same test values in the word document
describe("Order Handling EC", function () {
  describe("orderHandling()", function () {
    //stub = sinon.stub(ref, "accountStatus");
    //stub2 = sinon.stub(ref, "creditStatus");
    //  stub3 = sinon.stub(ref, "productStatus");
    afterEach(() => {
      ref.accountStatus.restore();
      ref.creditStatus.restore();
      ref.productStatus.restore();
    });
    it("should return accepted when account status is excellent, credit status is high or low , product status is available-to-all or limited", function () {
      sinon.stub(ref, "accountStatus").returns("excellent");
      sinon.stub(ref, "creditStatus").returns("high");
      sinon.stub(ref, "productStatus").returns("available-to-all");
      assert.strictEqual(ref.orderHandling(), "accepted");
    });
    it("should return accepted when account status is high, credit status is high, product status is available||limited ", function () {
      sinon.stub(ref, "accountStatus").returns("high");
      sinon.stub(ref, "creditStatus").returns("high");
      sinon.stub(ref, "productStatus").returns("limited");
      assert.strictEqual(ref.orderHandling(), "accepted");
    });
    it("should return accepted when account status is high, credit status is low, product status is available-to-all", function () {
      sinon.stub(ref, "accountStatus").returns("high");
      sinon.stub(ref, "creditStatus").returns("low");
      sinon.stub(ref, "productStatus").returns("available-to-all");
      assert.strictEqual(ref.orderHandling(), "accepted");
    });
    it("should return accepted when account status is medium, credit status is high, product status is available-to-all", function () {
      sinon.stub(ref, "accountStatus").returns("medium");
      sinon.stub(ref, "creditStatus").returns("high");
      sinon.stub(ref, "productStatus").returns("available-to-all");
      assert.strictEqual(ref.orderHandling(), "accepted");
    });
    it("should return pending when account status is excellent, credit status is high/low, product status is soldout", function () {
      sinon.stub(ref, "accountStatus").returns("excellent");
      sinon.stub(ref, "creditStatus").returns("high");
      sinon.stub(ref, "productStatus").returns("soldout");
      assert.strictEqual(ref.orderHandling(), "pending");
    });
    it("should return pending when account status is excellent, credit status is not-allowed, product status is limited", function () {
      sinon.stub(ref, "accountStatus").returns("excellent");
      sinon.stub(ref, "creditStatus").returns("not-allowed");
      sinon.stub(ref, "productStatus").returns("limited");
      assert.strictEqual(ref.orderHandling(), "pending");
    });
    it("should return pending when account status is high, credit status is high, product status is soldout", function () {
      sinon.stub(ref, "accountStatus").returns("high");
      sinon.stub(ref, "creditStatus").returns("high");
      sinon.stub(ref, "productStatus").returns("soldout");
      assert.strictEqual(ref.orderHandling(), "pending");
    });
    it("should return pending when account status is high, credit status is low, product status is limited", function () {
      sinon.stub(ref, "accountStatus").returns("high");
      sinon.stub(ref, "creditStatus").returns("low");
      sinon.stub(ref, "productStatus").returns("limited");
      assert.strictEqual(ref.orderHandling(), "pending");
    });
    it("should return pending when account status is medium, credit status is high, product status is limited", function () {
      sinon.stub(ref, "accountStatus").returns("medium");
      sinon.stub(ref, "creditStatus").returns("high");
      sinon.stub(ref, "productStatus").returns("limited");
      assert.strictEqual(ref.orderHandling(), "pending");
    });
    it("should return pending when account status is low, credit status is high, product status is available-to-all/limited", function () {
      sinon.stub(ref, "accountStatus").returns("low");
      sinon.stub(ref, "creditStatus").returns("high");
      sinon.stub(ref, "productStatus").returns("available-to-all");
      assert.strictEqual(ref.orderHandling(), "pending");
    });
    it("should return pending when account status is very-low, credit status is high, product status is available-to-all", function () {
      sinon.stub(ref, "accountStatus").returns("very-low");
      sinon.stub(ref, "creditStatus").returns("high");
      sinon.stub(ref, "productStatus").returns("available-to-all");
      assert.strictEqual(ref.orderHandling(), "pending");
    });
    it("should return rejected when account status is non-eligible, credit status is anything, product status is anything", function () {
      sinon.stub(ref, "accountStatus").returns("non-eligible");
      sinon.stub(ref, "creditStatus").returns("high");
      sinon.stub(ref, "productStatus").returns("limited");
      assert.strictEqual(ref.orderHandling(), "rejected");
    });
    it("should return rejected when account status is medium/low/very-low, credit status is anything, product status is soldout", function () {
      sinon.stub(ref, "accountStatus").returns("medium");
      sinon.stub(ref, "creditStatus").returns("high");
      sinon.stub(ref, "productStatus").returns("soldout");
      assert.strictEqual(ref.orderHandling(), "rejected");
    });
    it("should return rejected when account status is high/medium/low/very-low, credit status is not-allowed, product status is anything", function () {
      sinon.stub(ref, "accountStatus").returns("high");
      sinon.stub(ref, "creditStatus").returns("not-allowed");
      sinon.stub(ref, "productStatus").returns("limited");
      assert.strictEqual(ref.orderHandling(), "rejected");
    });
    it("should return rejected when account status is anything, credit status is anything, product status is invalid", function () {
      sinon.stub(ref, "accountStatus").returns("excellent");
      sinon.stub(ref, "creditStatus").returns("high");
      sinon.stub(ref, "productStatus").returns("invalid");
      assert.strictEqual(ref.orderHandling(), "rejected");
    });
    it("should return rejected when account status is medium/low/very-low, credit status is low, product status is anything", function () {
      sinon.stub(ref, "accountStatus").returns("medium");
      sinon.stub(ref, "creditStatus").returns("low");
      sinon.stub(ref, "productStatus").returns("soldout");
      assert.strictEqual(ref.orderHandling(), "rejected");
    });
    it("should return rejected when account status is very-low, credit status is high, product status is limited", function () {
      sinon.stub(ref, "accountStatus").returns("very-low");
      sinon.stub(ref, "creditStatus").returns("high");
      sinon.stub(ref, "productStatus").returns("limited");
      assert.strictEqual(ref.orderHandling(), "rejected");
    });
  });
});

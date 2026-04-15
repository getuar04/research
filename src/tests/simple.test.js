import test from "node:test";
import assert from "node:assert/strict";

test("basic test", () => {
  assert.equal(2 + 2, 4, "2 + 2 should equal 4");
});

test("object equality test", () => {
  const obj1 = { a: 1, b: 2 };
  const obj2 = { a: 1, b: 2 };
  assert.deepEqual(obj1, obj2, "Objects should be deeply equal");
});

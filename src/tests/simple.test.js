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

test("array equality test", () => {
  const arr1 = [1, 2, 3];
  const arr2 = [1, 2, 3];
  assert.deepEqual(arr1, arr2, "Arrays should be deeply equal");
});

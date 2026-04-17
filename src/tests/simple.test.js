import { describe, test, expect } from "@jest/globals";

describe("Basic tests", () => {
  test("basic test", () => {
    expect(2 + 2).toBe(4);
  });

  test("object equality test", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    expect(obj1).toEqual(obj2);
  });
});

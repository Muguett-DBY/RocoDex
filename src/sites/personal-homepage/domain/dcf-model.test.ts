import { describe, expect, it } from "vitest";
import { buildCstdDcfSensitivity, calculateCstdDcf } from "./dcf-model";

describe("deterministic DCF lab model", () => {
  it("keeps the same assumptions deterministic", () => {
    expect(calculateCstdDcf(0.06, 0.1)).toEqual(calculateCstdDcf(0.06, 0.1));
    expect(calculateCstdDcf(0.06, 0.1).years).toHaveLength(5);
  });

  it("responds monotonically across the sensitivity surface", () => {
    const matrix = buildCstdDcfSensitivity(6, 10);
    expect(matrix).toHaveLength(5);
    expect(matrix.every((row) => row.length === 5)).toBe(true);
    expect(matrix[2][4].value).toBeGreaterThan(matrix[2][0].value);
    expect(matrix[0][2].value).toBeGreaterThan(matrix[4][2].value);
  });
});

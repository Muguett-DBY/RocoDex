export type CstdDcfResult = Readonly<{
  years: readonly number[];
  value: number;
  terminalGrowth: number;
}>;

export type CstdDcfSensitivityCell = Readonly<{
  growth: number;
  discount: number;
  value: number;
}>;

export function calculateCstdDcf(growth: number, discount: number): CstdDcfResult {
  const baseCashFlow = 100;
  const years = Array.from({ length: 5 }, (_, index) => baseCashFlow * (1 + growth) ** (index + 1));
  const explicit = years.reduce((sum, cashFlow, index) => sum + cashFlow / (1 + discount) ** (index + 1), 0);
  const terminalGrowth = Math.min(0.03, Math.max(0.005, growth * 0.45));
  const terminal = years.at(-1)! * (1 + terminalGrowth) / Math.max(0.01, discount - terminalGrowth);
  return { years, value: explicit + terminal / (1 + discount) ** 5, terminalGrowth };
}

export function buildCstdDcfSensitivity(growthPercent: number, discountPercent: number) {
  const offsets = [-2, -1, 0, 1, 2] as const;
  return offsets.map((discountOffset) => offsets.map((growthOffset): CstdDcfSensitivityCell => {
    const growth = Math.max(0, growthPercent + growthOffset);
    const discount = Math.max(4, discountPercent + discountOffset);
    return {
      growth,
      discount,
      value: calculateCstdDcf(growth / 100, discount / 100).value,
    };
  }));
}

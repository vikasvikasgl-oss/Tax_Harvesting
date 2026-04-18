import { capitalGainsData, holdingsData } from './mockData';

export type RawHolding = (typeof holdingsData)[number];

export type HoldingWithId = RawHolding & { id: string };

export const fetchCapitalGains = (): Promise<typeof capitalGainsData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(capitalGainsData), 800);
  });
};

/** Stable row ids — mock data repeats `coin` (e.g. USDC); selection and React keys need uniqueness. */
export const fetchHoldings = (): Promise<HoldingWithId[]> => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(
          holdingsData.map((h, i) => ({
            ...h,
            id: `holding-${i}`,
          })),
        ),
      800,
    );
  });
};
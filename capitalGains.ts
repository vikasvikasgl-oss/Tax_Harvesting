export type GainsBucket = {
  profits: number
  losses: number
}

export type GainsData = {
  stcg: GainsBucket
  ltcg: GainsBucket
}

const netBucket = (profits: number, losses: number) => profits - losses

/** Total realised capital gains = net STCG + net LTCG (matches card footer). */
export const realisedCapitalGains = (data: GainsData): number =>
  netBucket(data.stcg.profits, data.stcg.losses) + netBucket(data.ltcg.profits, data.ltcg.losses)

/**
 * Estimated benefit of harvesting: drop in total net realised gains after harvest vs before
 * (floored at zero).
 */
export const estimatedSavingsFromHarvesting = (pre: GainsData, post: GainsData): number =>
  Math.max(0, realisedCapitalGains(pre) - realisedCapitalGains(post))

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchCapitalGains, fetchHoldings, type HoldingWithId } from '../api';
import type { GainsData } from '../lib/capitalGains';

export type { GainsBucket, GainsData } from '../lib/capitalGains';

export type Holding = HoldingWithId

type HarvestingContextValue = {
  capitalGains: GainsData | null
  holdings: Holding[]
  selectedHoldingIds: string[]
  toggleHolding: (holdingId: string) => void
  toggleAllHoldings: (checked: boolean) => void
  afterHarvestingGains: GainsData | null
  loading: boolean
  error: string | null
}

const HarvestingContext = createContext<HarvestingContextValue | undefined>(undefined);

type HarvestingProviderProps = {
  children: ReactNode
}

export const HarvestingProvider = ({ children }: HarvestingProviderProps) => {
  const [capitalGains, setCapitalGains] = useState<GainsData | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedHoldingIds, setSelectedHoldingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchCapitalGains(), fetchHoldings()])
      .then(([gains, holdingsList]) => {
        setCapitalGains(gains.capitalGains);
        setHoldings(holdingsList);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setLoading(false);
      });
  }, []);

  const toggleHolding = (holdingId: string) => {
    setSelectedHoldingIds((prev) =>
      prev.includes(holdingId) ? prev.filter((id) => id !== holdingId) : [...prev, holdingId],
    );
  };

  const toggleAllHoldings = (checked: boolean) => {
    setSelectedHoldingIds(checked ? holdings.map((h) => h.id) : []);
  };

  // CORE LOGIC: Calculate after-harvesting capital gains
  const afterHarvestingGains = React.useMemo(() => {
    if (!capitalGains) return null;

    let newStcgProfits = capitalGains.stcg.profits;
    let newStcgLosses = capitalGains.stcg.losses;
    let newLtcgProfits = capitalGains.ltcg.profits;
    let newLtcgLosses = capitalGains.ltcg.losses;

    selectedHoldingIds.forEach((holdingId) => {
      const holding = holdings.find((h) => h.id === holdingId);
      if (!holding) return;

      const stGain = Number(holding.stcg.gain);
      if (stGain > 0) newStcgProfits += stGain;
      else newStcgLosses += Math.abs(stGain);

      const ltGain = Number(holding.ltcg.gain);
      if (ltGain > 0) newLtcgProfits += ltGain;
      else newLtcgLosses += Math.abs(ltGain);
    });

    return {
      stcg: { profits: newStcgProfits, losses: newStcgLosses },
      ltcg: { profits: newLtcgProfits, losses: newLtcgLosses },
    };
  }, [selectedHoldingIds, capitalGains, holdings]);

  return (
    <HarvestingContext.Provider value={{
      capitalGains, holdings, selectedHoldingIds,
      toggleHolding, toggleAllHoldings, afterHarvestingGains,
      loading, error
    }}>
      {children}
    </HarvestingContext.Provider>
  );
};

export const useHarvesting = () => {
  const context = useContext(HarvestingContext);

  if (!context) {
    throw new Error('useHarvesting must be used within HarvestingProvider');
  }

  return context;
};
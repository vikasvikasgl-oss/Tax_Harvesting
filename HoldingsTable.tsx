import { useHarvesting } from '../context/HarvestingContext';
import { useMemo, useState } from 'react';

const formatMoney = (value: number) =>
  `$ ${Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export const HoldingsTable = () => {
  const { holdings, selectedHoldingIds, toggleHolding, toggleAllHoldings, loading, error } = useHarvesting();
  const [isExpanded, setIsExpanded] = useState(false);
  const [shortTermSort, setShortTermSort] = useState<'asc' | 'desc'>('desc');

  const allSelected = holdings.length > 0 && selectedHoldingIds.length === holdings.length;
  const sortedHoldings = useMemo(() => {
    const copy = [...holdings];
    copy.sort((a, b) => {
      const diff = a.stcg.gain - b.stcg.gain;
      return shortTermSort === 'asc' ? diff : -diff;
    });
    return copy;
  }, [holdings, shortTermSort]);

  const visibleHoldings = useMemo(() => {
    return isExpanded ? sortedHoldings : sortedHoldings.slice(0, 5);
  }, [sortedHoldings, isExpanded]);
  const canToggle = holdings.length > 5;

  const toggleShortTermSort = () => {
    setShortTermSort((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  if (loading) {
    return (
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm dark:border-white/10 dark:bg-[#0f172a] dark:text-slate-300">
        Loading holdings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#0f172a]">
      <h3 className="px-2 py-2 text-[22px] font-semibold text-slate-900 dark:text-slate-100 md:text-[28px]">Holdings</h3>
      <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] table-fixed text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-[#f8fafc] text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            <th className="w-10 p-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => toggleAllHoldings(e.target.checked)}
              />
            </th>
            <th className="w-[260px] p-3 text-left">Asset</th>
            <th className="p-3 text-left">Holdings<br /><span className="text-[11px] font-normal text-slate-500">Current Market Rate</span></th>
            <th className="p-3 text-left">Total Current Value</th>
            <th className="p-3 text-left">
              <button
                type="button"
                onClick={toggleShortTermSort}
                className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200"
              >
                Short-term
                <span className="inline-block w-3 text-center text-slate-400">
                  {shortTermSort === 'asc' ? '↑' : '↓'}
                </span>
              </button>
            </th>
            <th className="p-3 text-left">Long-Term</th>
            <th className="p-3 text-left">Amount to Sell</th>
          </tr>
        </thead>
        <tbody>
          {visibleHoldings.map((h) => {
            const isSelected = selectedHoldingIds.includes(h.id);
            const totalValue = h.totalHolding * h.currentPrice;
            const shortTermClass = h.stcg.gain >= 0 ? 'text-emerald-600' : 'text-rose-600';
            const longTermClass = h.ltcg.gain >= 0 ? 'text-emerald-600' : 'text-rose-600';

            return (
              <tr
                key={h.id}
                className={`cursor-pointer border-b border-slate-100 transition-colors dark:border-white/5 ${
                  isSelected ? 'bg-[#eef4ff] dark:bg-[#1e3a8a]/30' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
                onClick={() => toggleHolding(h.id)}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleHolding(h.id)}
                  />
                </td>
                <td className="p-3 align-middle">
                  <div className="flex items-center gap-2">
                    <img src={h.logo} className="h-8 w-8 shrink-0 rounded-full" alt={h.coin} />
                    <div className="min-w-0">
                      <div className="font-bold dark:text-slate-100">{h.coin}</div>
                      <div className="text-xs font-normal text-slate-500 dark:text-slate-400">{h.coinName}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                  <div>{h.totalHolding.toLocaleString(undefined, { maximumFractionDigits: 6 })} {h.coin}</div>
                  <div className="text-xs font-normal text-slate-500 dark:text-slate-400">{formatMoney(h.currentPrice)}/{h.coin}</div>
                </td>
                <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{formatMoney(totalValue)}</td>
                <td className={`p-3 font-bold ${shortTermClass}`}>
                  {h.stcg.gain >= 0 ? '+' : '-'}{formatMoney(h.stcg.gain)}
                  <div className="text-xs font-normal text-slate-500 dark:text-slate-400">{h.stcg.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {h.coin}</div>
                </td>
                <td className={`p-3 font-bold ${longTermClass}`}>
                  {h.ltcg.gain >= 0 ? '+' : '-'}{formatMoney(h.ltcg.gain)}
                  <div className="text-xs font-normal text-slate-500 dark:text-slate-400">{h.ltcg.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {h.coin}</div>
                </td>
                <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                  {isSelected
                    ? `${h.totalHolding.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${h.coin}`
                    : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      {canToggle && (
        <div className="px-2 pt-3">
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="text-sm font-semibold text-[#1d4ed8] underline underline-offset-2 dark:text-[#93c5fd]"
          >
            {isExpanded ? 'View less' : 'View more'}
          </button>
        </div>
      )}
    </div>
  );
};
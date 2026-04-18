import { useHarvesting } from '../context/HarvestingContext';
import {
  estimatedSavingsFromHarvesting,
  realisedCapitalGains,
  type GainsData,
} from '../lib/capitalGains';

const computeNet = (profits: number, losses: number) => profits - losses;
const formatCurrency = (value: number) =>
  `$ ${Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const formatCurrencyNoDecimals = (value: number) =>
  `$ ${Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const formatSigned = (value: number) => `${value < 0 ? '- ' : ''}${formatCurrency(value)}`;
const formatLoss = (value: number) => `- ${formatCurrency(value)}`;

type GainsCardProps = {
  title: string
  data: GainsData
  isPreHarvesting: boolean
  savingsValue?: number
}

const GainsCard = ({ title, data, isPreHarvesting, savingsValue = 0 }: GainsCardProps) => {
  const netStcg = computeNet(data.stcg.profits, data.stcg.losses);
  const netLtcg = computeNet(data.ltcg.profits, data.ltcg.losses);
  const realised = realisedCapitalGains(data);

  const cardClassName = isPreHarvesting
    ? 'bg-white border border-slate-200 text-slate-900 dark:bg-[#0f172a] dark:border-white/10 dark:text-slate-100'
    : 'bg-gradient-to-br from-[#2F80ED] via-[#2B7BEA] to-[#1367E6] text-white';
  const mutedClassName = isPreHarvesting ? 'text-slate-600 dark:text-slate-300' : 'text-blue-100/90';
  const dividerClassName = isPreHarvesting ? 'border-slate-200 dark:border-white/10' : 'border-white/25';

  return (
    <div className={`flex-1 rounded-xl p-4 shadow-sm md:p-5 ${cardClassName}`}>
      <h2 className="mb-4 text-base font-semibold">{title}</h2>

      <div className="grid grid-cols-3 gap-y-2 text-[13px] md:text-sm">
        <span />
        <span className={`text-center ${mutedClassName}`}>Short-term</span>
        <span className={`text-center ${mutedClassName}`}>Long-term</span>

        <span className={mutedClassName}>Profits</span>
        <span className="text-center font-medium">{formatCurrency(data.stcg.profits)}</span>
        <span className="text-center font-medium">{formatCurrency(data.ltcg.profits)}</span>

        <span className={mutedClassName}>Losses</span>
        <span className="text-center font-medium">{formatLoss(data.stcg.losses)}</span>
        <span className="text-center font-medium">{formatLoss(data.ltcg.losses)}</span>

        <span className={mutedClassName}>Net Capital Gains</span>
        <span className="text-center font-semibold">{formatSigned(netStcg)}</span>
        <span className="text-center font-semibold">{formatSigned(netLtcg)}</span>
      </div>

      <div className={`mt-4 border-t pt-4 ${dividerClassName}`}>
        <div className="flex items-end justify-between gap-3">
          <span
            className={`text-sm font-semibold ${
              isPreHarvesting ? 'text-slate-900 dark:text-slate-100' : 'text-white'
            }`}
          >
            {isPreHarvesting ? 'Realised Capital Gains:' : 'Effective Capital Gains:'}
          </span>
          <span className="text-[24px] font-bold leading-none md:text-[28px]">{formatSigned(realised)}</span>
        </div>
      </div>

      {!isPreHarvesting && savingsValue > 0 && (
        <p className="mt-3 text-[13px] text-blue-100/90 md:text-sm">
          <span className="mr-1">🎉</span>
          You are going to save upto{' '}
          <span className="font-semibold text-white">{formatCurrencyNoDecimals(savingsValue)}</span>
        </p>
      )}
    </div>
  );
};

const MessageBox = ({ text }: { text: string }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
    {text}
  </div>
);

export const CapitalGainsSection = () => {
  const { capitalGains, afterHarvestingGains, loading, error } = useHarvesting();

  if (loading) return <MessageBox text="Loading capital gains..." />;
  if (error) return <MessageBox text={`Error: ${error}`} />;
  if (!capitalGains || !afterHarvestingGains) return null;

  const savings = estimatedSavingsFromHarvesting(capitalGains, afterHarvestingGains);

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <GainsCard title="Pre Harvesting" data={capitalGains} isPreHarvesting />
      <GainsCard
        title="After Harvesting"
        data={afterHarvestingGains}
        isPreHarvesting={false}
        savingsValue={savings}
      />
    </div>
  );
};
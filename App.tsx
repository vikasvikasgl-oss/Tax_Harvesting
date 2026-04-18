import { HarvestingProvider } from './context/HarvestingContext';
import { CapitalGainsSection } from './components/CapitalGainsCard';
import { HoldingsTable } from './components/HoldingsTable';
import { useEffect, useState } from 'react';

function App() {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <HarvestingProvider>
      <div className="min-h-screen bg-[#edf1f7] text-[#111827] dark:bg-[#0b1220] dark:text-slate-100">
        <header className="border-b border-[#e3e8ef] bg-white dark:border-white/10 dark:bg-[#0f172a]">
          <div className="mx-auto flex w-full max-w-7xl items-center px-3 py-2 md:px-4">
            <div
              aria-label="Koin"
              className="text-[30px] font-bold leading-none tracking-tight text-[#1d5ed8] md:text-[38px]"
            >
              Koin
              <span className="inline-block whitespace-nowrap align-middle">
                <i className="logo-x-gold">X</i>
                <sup className="ml-0.5 align-super text-[0.5em] font-normal not-italic leading-none text-slate-600 dark:text-white">
                  ®
                </sup>
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-3 py-3 md:px-4">
          <div className="mb-2 flex flex-wrap items-center gap-2 md:gap-3">
            <h2 className="text-[26px] font-semibold leading-none tracking-tight text-[#1f2937] dark:text-white md:text-[30px]">Tax Harvesting</h2>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(true)}
                className="text-sm text-[#1d4ed8] underline underline-offset-2 dark:text-[#93c5fd]"
              >
                How it works?
              </button>

              {isHowItWorksOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close How it works popup"
                    className="fixed inset-0 z-30 cursor-default"
                    onClick={() => setIsHowItWorksOpen(false)}
                  />
                  <div className="absolute left-0 top-full z-40 w-[min(560px,calc(100vw-2rem))] pt-3">
                    <div className="relative rounded-xl bg-[#0b1220] px-4 py-4 text-sm text-white shadow-2xl md:px-5">
                      <div className="absolute left-10 top-0 h-0 w-0 -translate-y-2 border-x-8 border-b-8 border-x-transparent border-b-[#0b1220]" />

                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm font-semibold text-slate-100">How tax harvesting works</p>
                        <button
                          type="button"
                          onClick={() => setIsHowItWorksOpen(false)}
                          className="rounded-md px-2 py-1 text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="mt-2 space-y-2 text-slate-100">
                        <p className="leading-relaxed">
                          This page simulates <span className="font-semibold">tax-loss harvesting</span> — reducing
                          your taxable gains by selling selected assets at a loss to offset gains.
                        </p>

                        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                          <li>
                            <span className="font-semibold text-white">Pre Harvesting</span> shows gains from the
                            Capital Gains API.
                          </li>
                          <li>
                            <span className="font-semibold text-white">After Harvesting</span> updates dynamically when
                            you select assets in the Holdings table.
                          </li>
                          <li>
                            For each selected asset:{' '}
                            <span className="font-medium text-emerald-400">positive gain</span> adds to{' '}
                            <span className="font-semibold text-white">profits</span>, and{' '}
                            <span className="font-medium text-rose-400">negative gain</span> adds to{' '}
                            <span className="font-semibold text-white">losses</span>.
                          </li>
                          <li>
                            Net Capital Gains ={' '}
                            <span className="font-semibold text-emerald-400">profits</span> −{' '}
                            <span className="font-semibold text-rose-400">losses</span> (calculated separately for{' '}
                            <span className="font-semibold text-white">STCG</span> and{' '}
                            <span className="font-semibold text-white">LTCG</span>).
                          </li>
                        </ul>

                        <p className="leading-relaxed">
                          If Pre-harvesting realised gains are higher than Post-harvesting gains, you’ll see the{' '}
                          <span className="font-semibold">estimated savings</span>.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsHowItWorksOpen(false)}
                        className="mt-3 text-sm font-semibold text-[#60a5fa] underline underline-offset-2"
                      >
                        Know More
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-3 rounded-lg border border-[#4f8ccf] bg-[#f8fbff] dark:border-[#2b4f7b] dark:bg-[#0f1b2d]">
            <button
              type="button"
              onClick={() => setIsDisclaimerOpen((v) => !v)}
              className="flex w-full items-center justify-between px-3 py-2 text-left"
            >
              <span className="flex items-center gap-2 text-[13px] font-semibold text-[#1f3551] dark:text-slate-200 md:text-sm">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#4f8ccf] text-[12px] font-bold text-[#1d4ed8] dark:border-[#2b4f7b] dark:text-[#93c5fd]">
                  i
                </span>
                Important Notes &amp; Disclaimers
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`text-slate-600 transition-transform dark:text-slate-300 ${isDisclaimerOpen ? 'rotate-180' : ''}`}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isDisclaimerOpen && (
              <div className="border-t border-[#4f8ccf] px-4 py-3 text-[13px] text-slate-700 dark:border-[#2b4f7b] dark:text-slate-200 md:text-sm">
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Tax-loss harvesting may not be allowed or may be restricted under certain tax regulations. Please consult your tax advisor before making any decisions.
                  </li>
                  <li>
                    Tax harvesting typically applies to realised gains/losses only. Unrealised losses in held assets are not counted until you sell.
                  </li>
                  <li>
                    Short-term and long-term classifications depend on your local holding-period rules. If your region uses a different holding period, results may vary.
                  </li>
                  <li>
                    Prices and market values shown here may be sourced from public market data providers and can differ slightly from the prices on your exchange.
                  </li>
                  <li>
                    Selecting assets in the table simulates selling those holdings and updates the “After Harvesting” card. It is a what-if calculation, not financial advice.
                  </li>
                </ul>
              </div>
            )}
          </div>

          <CapitalGainsSection />
          <HoldingsTable />
        </main>
      </div>
    </HarvestingProvider>
  );
}

export default App;
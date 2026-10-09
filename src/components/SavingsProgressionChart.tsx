import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { DepositTransaction, formatFcfa } from '../data/agroData';

interface SavingsProgressionChartProps {
  totalSavedFcfa: number;
  totalTargetFcfa: number;
  transactions: DepositTransaction[];
}

interface WeeklyPoint {
  week: string;
  dateLabel: string;
  epargneCumulee: number | null;
  cibleLineaire: number;
  versementSemaine: number;
}

const BASE_WEEKS = [
  { week: 'S1', dateLabel: '03 Août 2026', baseCumul: 1500, baseDeposit: 1500, target: 2000 },
  { week: 'S2', dateLabel: '10 Août 2026', baseCumul: 3000, baseDeposit: 1500, target: 3800 },
  { week: 'S3', dateLabel: '17 Août 2026', baseCumul: 4500, baseDeposit: 1500, target: 5600 },
  { week: 'S4', dateLabel: '24 Août 2026', baseCumul: 6500, baseDeposit: 2000, target: 7400 },
  { week: 'S5', dateLabel: '31 Août 2026', baseCumul: 8000, baseDeposit: 1500, target: 9200 },
  { week: 'S6', dateLabel: '07 Sep 2026', baseCumul: 10000, baseDeposit: 2000, target: 11000 },
  { week: 'S7', dateLabel: '14 Sep 2026', baseCumul: 11500, baseDeposit: 1500, target: 12800 },
  { week: 'S8', dateLabel: '21 Sep 2026', baseCumul: 13000, baseDeposit: 1500, target: 14600 },
  { week: 'S9', dateLabel: '28 Sep 2026', baseCumul: 14500, baseDeposit: 1500, target: 16400 }
];

export const SavingsProgressionChart: React.FC<SavingsProgressionChartProps> = ({
  totalSavedFcfa,
  totalTargetFcfa,
  transactions
}) => {
  const [viewMode, setViewMode] = useState<'realise' | 'projection'>('realise');

  const chartData = useMemo<WeeklyPoint[]>(() => {
    const scaleRatio = totalTargetFcfa > 0 ? totalTargetFcfa / 21000 : 1;

    const prevWeekCumul = BASE_WEEKS[BASE_WEEKS.length - 1].baseCumul;
    const currentWeekDeposit = Math.max(500, totalSavedFcfa - prevWeekCumul);

    const historical: WeeklyPoint[] = [
      ...BASE_WEEKS.map((w) => ({
        week: w.week,
        dateLabel: w.dateLabel,
        epargneCumulee: w.baseCumul,
        cibleLineaire: Math.round(w.target * scaleRatio),
        versementSemaine: w.baseDeposit
      })),
      {
        week: 'S10 (Actuel)',
        dateLabel: '08 Oct 2026',
        epargneCumulee: totalSavedFcfa,
        cibleLineaire: Math.round(18200 * scaleRatio),
        versementSemaine: currentWeekDeposit
      }
    ];

    if (viewMode === 'realise') {
      return historical;
    }

    const remaining = Math.max(0, totalTargetFcfa - totalSavedFcfa);
    const step1 = Math.round(totalSavedFcfa + remaining * 0.35);
    const step2 = Math.round(totalSavedFcfa + remaining * 0.7);

    return [
      ...historical,
      {
        week: 'S11 (Prévu)',
        dateLabel: '15 Oct 2026',
        epargneCumulee: step1,
        cibleLineaire: Math.round(19200 * scaleRatio),
        versementSemaine: Math.max(0, step1 - totalSavedFcfa)
      },
      {
        week: 'S12 (Prévu)',
        dateLabel: '22 Oct 2026',
        epargneCumulee: step2,
        cibleLineaire: Math.round(20100 * scaleRatio),
        versementSemaine: Math.max(0, step2 - step1)
      },
      {
        week: 'S13 (Objectif)',
        dateLabel: '29 Oct 2026',
        epargneCumulee: totalTargetFcfa,
        cibleLineaire: totalTargetFcfa,
        versementSemaine: Math.max(0, totalTargetFcfa - step2)
      }
    ];
  }, [totalSavedFcfa, totalTargetFcfa, viewMode]);

  const weeklyAverageFcfa = Math.round(totalSavedFcfa / 10);

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header & Interactive View Mode Toggle */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-emerald-800">
              Courbe d’Épargne Hebdomadaire · Campagne 2027
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              Moyenne : {formatFcfa(weeklyAverageFcfa)} / semaine
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              {transactions.length} versements enregistrés
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Progression de l’Épargne Hebdomadaire
          </h2>
        </div>

        {/* Interactive Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('realise')}
            className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 ${
              viewMode === 'realise'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Historique réalisé (S1 – S10)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('projection')}
            className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 ${
              viewMode === 'projection'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Projection jusqu’à 100%
          </button>
        </div>
      </div>

      {/* Legend & Summary Metrics Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-emerald-800 inline-block" />
            <span className="font-medium text-stone-900">
              Épargne cumulée FOUT’AGRO (FCFA)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-600 inline-block" />
            <span>Trajectoire régulière recommandée</span>
          </div>
        </div>

        <div className="font-mono-tabular text-stone-700">
          Objectif total des paquets :{' '}
          <strong className="text-stone-900">{formatFcfa(totalTargetFcfa)}</strong>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="w-full h-[320px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 12, right: 20, left: 10, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: '#57534E', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={{ stroke: '#D6D3D1' }}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tickFormatter={(value: number) => `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`}
              tick={{ fill: '#57534E', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const dataPoint = payload[0].payload as WeeklyPoint;
                return (
                  <div className="bg-stone-900 text-stone-100 p-3.5 rounded-lg border border-stone-700 shadow-md text-xs space-y-1.5 font-mono-tabular">
                    <p className="font-sans font-semibold text-amber-300">
                      {dataPoint.week} · {dataPoint.dateLabel}
                    </p>
                    <p>
                      Épargne cumulée :{' '}
                      <span className="font-semibold text-white">
                        {formatFcfa(dataPoint.epargneCumulee || 0)}
                      </span>
                    </p>
                    <p className="text-stone-300">
                      Cible théorique : {formatFcfa(dataPoint.cibleLineaire)}
                    </p>
                    <p className="text-emerald-300 pt-1 border-t border-stone-700">
                      Cotisation semaine : +{formatFcfa(dataPoint.versementSemaine)}
                    </p>
                  </div>
                );
              }}
            />
            <ReferenceLine
              y={totalTargetFcfa}
              stroke="#065F46"
              strokeDasharray="4 4"
              label={{
                value: `Objectif 100% (${formatFcfa(totalTargetFcfa)})`,
                position: 'insideTopRight',
                fill: '#065F46',
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            />
            <Line
              type="monotone"
              dataKey="cibleLineaire"
              name="Trajectoire cible"
              stroke="#D97706"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4, fill: '#D97706' }}
            />
            <Line
              type="monotone"
              dataKey="epargneCumulee"
              name="Épargne cumulée"
              stroke="#065F46"
              strokeWidth={3}
              dot={{ r: 4, fill: '#065F46', strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 6, fill: '#065F46', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

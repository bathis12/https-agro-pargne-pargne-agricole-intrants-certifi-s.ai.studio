import React, { useState, useMemo } from 'react';
import {
  AgriPackage,
  SubscribedPlan,
  formatFcfa
} from '../data/agroData';
import { Plus, Minus, ArrowRight } from 'lucide-react';

interface YieldEstimatorDashboardProps {
  packages: AgriPackage[];
  activePlans: SubscribedPlan[];
  onSubscribePackage: (pkg: AgriPackage, initialDepositFcfa: number) => void;
}

type SimulatorTab = 'surface' | 'multi';

const MARKET_PRICE_PER_KG: Record<string, number> = {
  laitue: 300,
  bissap: 450,
  oignons: 250,
  poules: 1000
};

export const YieldEstimatorDashboard: React.FC<YieldEstimatorDashboardProps> = ({
  packages,
  activePlans,
  onSubscribePackage
}) => {
  const [mode, setMode] = useState<SimulatorTab>('surface');

  // Mode 1: Single Crop + Custom Cultivated Surface Area (m²)
  const [selectedPkgId, setSelectedPkgId] = useState<string>(packages[4]?.id || packages[0].id);
  const [customSurfaceM2, setCustomSurfaceM2] = useState<number>(120);
  const [agronomicLevel, setAgronomicLevel] = useState<'standard' | 'optimal'>('standard');
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);

  // Mode 2: Multi-package combination initialized from producer's active plans
  const [pkgQuantities, setPkgQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    packages.forEach((p) => {
      const countInPlans = activePlans.filter((ap) => ap.packageId === p.id).length;
      initial[p.id] = countInPlans;
    });
    return initial;
  });

  const selectedPkg = useMemo(
    () => packages.find((p) => p.id === selectedPkgId) || packages[0],
    [packages, selectedPkgId]
  );

  const baseSurfaceM2 = Math.max(10, Math.round(selectedPkg.surfaceHa * 10000));

  const surfaceCalculation = useMemo(() => {
    const ratio = customSurfaceM2 / baseSurfaceM2;
    const practiceMultiplier = agronomicLevel === 'optimal' ? 1.12 : 1.0;

    const potentialYieldKg = Math.round(
      selectedPkg.expectedYieldKg * ratio * practiceMultiplier
    );
    const traditionalYieldKg = Math.round(selectedPkg.traditionalYieldKg * ratio);
    const extraYieldKg = Math.max(0, potentialYieldKg - traditionalYieldKg);
    const gainPct =
      traditionalYieldKg > 0
        ? Math.round(((potentialYieldKg - traditionalYieldKg) / traditionalYieldKg) * 100)
        : selectedPkg.yieldIncreasePct;

    const recommendedPacksCount = Math.max(1, Math.ceil(ratio));
    const totalPacksCostFcfa = recommendedPacksCount * selectedPkg.priceFcfa;

    const unitPriceFcfa = MARKET_PRICE_PER_KG[selectedPkg.category] || 300;
    const grossRevenueFcfa = Math.round(potentialYieldKg * unitPriceFcfa);
    const netProfitFcfa = Math.max(0, grossRevenueFcfa - totalPacksCostFcfa);
    const numberOfPlanches = Math.max(1, Math.round(customSurfaceM2 / 10));

    return {
      potentialYieldKg,
      traditionalYieldKg,
      extraYieldKg,
      gainPct,
      recommendedPacksCount,
      totalPacksCostFcfa,
      grossRevenueFcfa,
      netProfitFcfa,
      numberOfPlanches,
      unitPriceFcfa
    };
  }, [selectedPkg, customSurfaceM2, baseSurfaceM2, agronomicLevel]);

  const multiCalculation = useMemo(() => {
    let totalSurfaceM2 = 0;
    let totalCostFcfa = 0;
    let totalPotentialKg = 0;
    let totalTraditionalKg = 0;
    let totalNetGainFcfa = 0;
    let totalPacksCount = 0;

    const breakdown: Array<{
      pkg: AgriPackage;
      qty: number;
      surfaceM2: number;
      yieldKg: number;
      tradKg: number;
      costFcfa: number;
      netGainFcfa: number;
    }> = [];

    packages.forEach((pkg) => {
      const qty = pkgQuantities[pkg.id] || 0;
      if (qty <= 0) return;

      const pkgM2 = Math.round(pkg.surfaceHa * 10000) * qty;
      const yieldKg = pkg.expectedYieldKg * qty;
      const tradKg = pkg.traditionalYieldKg * qty;
      const costFcfa = pkg.priceFcfa * qty;
      const netGainFcfa = pkg.estimatedNetGainFcfa * qty;

      totalSurfaceM2 += pkgM2;
      totalCostFcfa += costFcfa;
      totalPotentialKg += yieldKg;
      totalTraditionalKg += tradKg;
      totalNetGainFcfa += netGainFcfa;
      totalPacksCount += qty;

      breakdown.push({
        pkg,
        qty,
        surfaceM2: pkgM2,
        yieldKg,
        tradKg,
        costFcfa,
        netGainFcfa
      });
    });

    const overallGainPct =
      totalTraditionalKg > 0
        ? Math.round(((totalPotentialKg - totalTraditionalKg) / totalTraditionalKg) * 100)
        : 0;

    return {
      totalSurfaceM2,
      totalCostFcfa,
      totalPotentialKg,
      totalTraditionalKg,
      totalNetGainFcfa,
      totalPacksCount,
      overallGainPct,
      breakdown
    };
  }, [packages, pkgQuantities]);

  const handleUpdateQty = (pkgId: string, delta: number) => {
    setPkgQuantities((prev) => ({
      ...prev,
      [pkgId]: Math.max(0, (prev[pkgId] || 0) + delta)
    }));
  };

  const tradWidthPct = Math.min(
    100,
    Math.round(
      (surfaceCalculation.traditionalYieldKg /
        Math.max(1, surfaceCalculation.potentialYieldKg)) *
        100
    )
  );

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-8">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-emerald-800">
              Simulation Agronomique · Laitue, Bissap Blanc, Oignons & Poules
            </span>
            <span aria-hidden="true">·</span>
            <span>Comparaison avec la culture traditionnelle</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Calculateur de Rendement Estimé & Récolte Potentielle
          </h2>
        </div>

        {/* Segmented Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('surface')}
            className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 ${
              mode === 'surface'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Par Surface Cultivée (m²)
          </button>
          <button
            type="button"
            onClick={() => setMode('multi')}
            className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 ${
              mode === 'multi'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Combinaison de Paquets ({multiCalculation.totalPacksCount})
          </button>
        </div>
      </div>

      {addedFeedback && (
        <div className="py-3 px-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-4 text-xs text-emerald-950">
          <span className="font-medium">{addedFeedback}</span>
          <button
            type="button"
            onClick={() => setAddedFeedback(null)}
            className="font-semibold text-emerald-800 hover:underline whitespace-nowrap shrink-0"
          >
            Fermer
          </button>
        </div>
      )}

      {mode === 'surface' ? (
        /* Hairline 2-Column Split — Zero Cards Within Cards */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:divide-x lg:divide-stone-200 items-start">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-6 lg:pr-8 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="yield-pkg-select"
                className="block text-xs font-semibold text-stone-700"
              >
                01. Choisir le paquet FOUT’AGRO de référence
              </label>
              <select
                id="yield-pkg-select"
                value={selectedPkgId}
                onChange={(e) => {
                  const found = packages.find((p) => p.id === e.target.value);
                  setSelectedPkgId(e.target.value);
                  if (found) {
                    setCustomSurfaceM2(Math.max(20, Math.round(found.surfaceHa * 10000)));
                  }
                }}
                className="w-full min-h-[42px] px-3.5 py-2.5 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} — {formatFcfa(pkg.priceFcfa)} ({pkg.surfaceLabel})
                  </option>
                ))}
              </select>
            </div>

            {/* Surface Slider */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between text-xs">
                <label
                  htmlFor="surface-m2-slider"
                  className="font-semibold text-stone-700"
                >
                  02. Surface cultivée envisagée (ou dimension du lot)
                </label>
                <span className="font-mono-tabular font-bold text-emerald-800 text-sm">
                  {customSurfaceM2} m² ({surfaceCalculation.numberOfPlanches} planches)
                </span>
              </div>

              <input
                id="surface-m2-slider"
                type="range"
                min={20}
                max={1000}
                step={10}
                value={customSurfaceM2}
                onChange={(e) => setCustomSurfaceM2(Number(e.target.value))}
                className="w-full accent-emerald-800"
              />

              {/* Quick Surface Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-stone-500">Surfaces types :</span>
                {[40, 50, 100, 120, 200, 500, 1000].map((m2) => (
                  <button
                    key={m2}
                    type="button"
                    onClick={() => setCustomSurfaceM2(m2)}
                    className={`min-h-[34px] px-3 py-1.5 rounded-md text-xs font-mono-tabular font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                      customSurfaceM2 === m2
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {m2} m²
                  </button>
                ))}
              </div>
            </div>

            {/* Agronomic Method Selector (Segmented Control) */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-stone-700">
                03. Niveau d’application des techniques Champ-École
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 bg-stone-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setAgronomicLevel('standard')}
                  className={`py-2.5 px-3.5 rounded-md text-left transition-colors duration-150 ${
                    agronomicLevel === 'standard'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <p className="text-xs font-bold whitespace-nowrap">
                    Itinéraire Standard
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                    Semences certifiées + dose d’engrais
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAgronomicLevel('optimal')}
                  className={`py-2.5 px-3.5 rounded-md text-left transition-colors duration-150 ${
                    agronomicLevel === 'optimal'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <p className="text-xs font-bold whitespace-nowrap">
                    Itinéraire Optimal (+12% bonus)
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                    Paillage intégral + pépinière ombragée
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Harvest & Revenue Comparison Output (Unboxed Hairline Architecture) */}
          <div className="lg:col-span-6 lg:pl-8 space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <p className="text-xs text-stone-500">
                Récolte potentielle estimée sur {customSurfaceM2} m²
              </p>
              <div className="flex flex-wrap items-baseline gap-3 mt-1">
                <span className="text-3xl font-bold font-mono-tabular text-stone-900">
                  {surfaceCalculation.potentialYieldKg} kg
                </span>
                <span className="text-xs font-mono-tabular font-semibold text-emerald-800">
                  +{surfaceCalculation.extraYieldKg} kg (+{surfaceCalculation.gainPct}% vs méthode traditionnelle)
                </span>
              </div>
            </div>

            {/* Visual Yield Comparison Bars */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono-tabular">
                  <span className="font-sans font-semibold text-stone-900">
                    Avec Paquet FOUT’AGRO ({selectedPkg.categoryLabel})
                  </span>
                  <span className="font-bold text-emerald-800">
                    {surfaceCalculation.potentialYieldKg} kg
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-800 w-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono-tabular text-stone-600">
                  <span className="font-sans">
                    Sans intrants certifiés (Semences tout-venant)
                  </span>
                  <span>{surfaceCalculation.traditionalYieldKg} kg</span>
                </div>
                <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-stone-400 origin-left transition-transform duration-150"
                    style={{ transform: `scaleX(${tradWidthPct / 100})` }}
                  />
                </div>
              </div>
            </div>

            {/* Financial & Package Requirement Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
              <div>
                <p className="text-xs text-stone-500">Paquets requis</p>
                <p className="text-base font-bold font-mono-tabular text-stone-900 mt-0.5">
                  {surfaceCalculation.recommendedPacksCount} × {formatFcfa(selectedPkg.priceFcfa)}
                </p>
                <p className="text-[11px] text-stone-500 font-mono-tabular">
                  Coût : {formatFcfa(surfaceCalculation.totalPacksCostFcfa)}
                </p>
              </div>

              <div>
                <p className="text-xs text-stone-500">Valeur marchande</p>
                <p className="text-base font-bold font-mono-tabular text-stone-900 mt-0.5">
                  {formatFcfa(surfaceCalculation.grossRevenueFcfa)}
                </p>
                <p className="text-[11px] text-stone-500 font-mono-tabular">
                  Prix moyen : {surfaceCalculation.unitPriceFcfa} F/kg
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs text-stone-500">Revenu net estimé</p>
                <p className="text-base font-bold font-mono-tabular text-emerald-800 mt-0.5">
                  +{formatFcfa(surfaceCalculation.netProfitFcfa)}
                </p>
                <p className="text-[11px] text-stone-500">
                  Intrants déduits
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSubscribePackage(selectedPkg, selectedPkg.minWeeklyFcfa);
                setAddedFeedback(
                  `Le « ${selectedPkg.name} » (${formatFcfa(
                    selectedPkg.priceFcfa
                  )}) a été ajouté à vos plans d’épargne actifs.`
                );
              }}
              className="w-full min-h-[42px] py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors duration-150 flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <span>
                Souscrire au {selectedPkg.name} (Acompte {formatFcfa(selectedPkg.minWeeklyFcfa)})
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Mode 2: Multi-Package Combination Simulator — Hairline Split (Zero Nested Cards) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:divide-x lg:divide-stone-200 items-start">
          {/* Left: Steppers for all 7 FOUT'AGRO Packages */}
          <div className="lg:col-span-7 lg:pr-8 space-y-3">
            <p className="text-xs font-semibold text-stone-700 mb-2">
              Ajustez le nombre de paquets FOUT’AGRO pour simuler votre récolte globale :
            </p>
            <div className="divide-y divide-stone-200 border-y border-stone-200">
              {packages.map((pkg) => {
                const qty = pkgQuantities[pkg.id] || 0;
                const pkgM2 = Math.round(pkg.surfaceHa * 10000);
                return (
                  <div
                    key={pkg.id}
                    className="py-3 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-900">{pkg.name}</p>
                      <p className="text-[11px] text-stone-500 font-mono-tabular">
                        {formatFcfa(pkg.priceFcfa)} · {pkg.surfaceLabel} ({pkgM2} m²) · Récolte : {pkg.expectedYieldKg} kg
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(pkg.id, -1)}
                        aria-label={`Retirer un ${pkg.name}`}
                        className="w-10 h-10 rounded-lg border border-stone-300 bg-[#F7F7F5] hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors duration-150"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-mono-tabular text-sm font-bold text-stone-900">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(pkg.id, 1)}
                        aria-label={`Ajouter un ${pkg.name}`}
                        className="w-10 h-10 rounded-lg border border-stone-300 bg-[#F7F7F5] hover:bg-emerald-800 hover:text-white hover:border-emerald-800 flex items-center justify-center text-stone-700 transition-colors duration-150"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Multi-Crop Harvest Summary (Unboxed Hairline Architecture) */}
          <div className="lg:col-span-5 lg:pl-8 space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <p className="text-xs text-stone-500">
                Production totale cumulée ({multiCalculation.totalPacksCount} paquets · {multiCalculation.totalSurfaceM2} m²)
              </p>
              <p className="text-3xl font-bold font-mono-tabular text-stone-900 mt-1">
                {multiCalculation.totalPotentialKg} kg
              </p>
              <p className="text-xs font-mono-tabular text-emerald-800 font-semibold mt-0.5">
                vs {multiCalculation.totalTraditionalKg} kg en méthode traditionnelle (+{multiCalculation.overallGainPct}%)
              </p>
            </div>

            {multiCalculation.breakdown.length === 0 ? (
              <p className="text-xs text-stone-500 py-4">
                Sélectionnez au moins un paquet à gauche pour afficher le détail de récolte par culture.
              </p>
            ) : (
              <div className="divide-y divide-stone-200">
                {multiCalculation.breakdown.map((item) => (
                  <div
                    key={item.pkg.id}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="truncate font-medium text-stone-800">
                      {item.qty}× {item.pkg.name}
                    </span>
                    <span className="font-mono-tabular font-bold text-stone-900 whitespace-nowrap shrink-0 ml-3">
                      {item.yieldKg} kg
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-stone-200 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-stone-500">Épargne totale requise</p>
                <p className="text-lg font-bold font-mono-tabular text-stone-900 mt-0.5">
                  {formatFcfa(multiCalculation.totalCostFcfa)}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">Gain net cumulé estimé</p>
                <p className="text-lg font-bold font-mono-tabular text-emerald-800 mt-0.5">
                  +{formatFcfa(multiCalculation.totalNetGainFcfa)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

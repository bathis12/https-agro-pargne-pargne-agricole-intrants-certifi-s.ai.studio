import React, { useState } from 'react';
import {
  AgriPackage,
  PackageCategory,
  formatFcfa
} from '../data/agroData';
import { ResilientImage } from './ResilientImage';
import { ArrowRight } from 'lucide-react';

interface PackageCatalogProps {
  packages: AgriPackage[];
  onSubscribePackage: (pkg: AgriPackage, initialDepositFcfa: number) => void;
}

export const PackageCatalog: React.FC<PackageCatalogProps> = ({
  packages,
  onSubscribePackage
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | PackageCategory>('ALL');
  const [selectedPkg, setSelectedPkg] = useState<AgriPackage>(packages[0]);
  const [weeklySaveFcfa, setWeeklySaveFcfa] = useState<number>(500);
  const [initialDeposit, setInitialDeposit] = useState<number>(1000);
  const [subscribedNotice, setSubscribedNotice] = useState<string | null>(null);

  const filteredPackages =
    selectedCategory === 'ALL'
      ? packages
      : packages.filter((p) => p.category === selectedCategory);

  const effectiveInitial = Math.min(initialDeposit, selectedPkg.priceFcfa);
  const remainingToSave = Math.max(0, selectedPkg.priceFcfa - effectiveInitial);
  const weeksRequired =
    remainingToSave === 0
      ? 0
      : Math.ceil(remainingToSave / Math.max(250, weeklySaveFcfa));

  const handleSubscribe = (pkg: AgriPackage, initAmt: number) => {
    const validInit = Math.min(pkg.priceFcfa, initAmt);
    onSubscribePackage(pkg, validInit);
    setSubscribedNotice(
      `Le « ${pkg.name} » (${formatFcfa(pkg.priceFcfa)}) a été ajouté à vos plans FOUT’AGRO avec un premier versement de ${formatFcfa(validInit)}.`
    );
  };

  return (
    <div className="space-y-12">
      {/* Section Header & Segmented Category Filter */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-stone-200 pb-6">
        <div>
          <p className="text-xs font-medium text-emerald-800 mb-1.5">
            FOUT’AGRO · Semences Certifiées, Compost & Élevage Villageois
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Catalogue Officiel des Paquets FOUT’AGRO
          </h2>
        </div>

        {/* Interactive Filter Controls */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/70 rounded-lg">
          {[
            { id: 'ALL', label: 'Tous (7)' },
            { id: 'laitue', label: 'Laitue (5 000 F & 2 000 F)' },
            { id: 'bissap', label: 'Bissap Blanc (5 000 F & 2 000 F)' },
            { id: 'oignons', label: 'Oignons (6 000 F & 2 500 F)' },
            { id: 'poules', label: 'Poules (8 000 F)' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id as 'ALL' | PackageCategory)}
              className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
                selectedCategory === tab.id
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Architectural Hairline Tariff Strip (No nested cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 border-y border-stone-200 py-5">
        <div className="py-2 sm:py-0 sm:pr-6">
          <p className="text-xs font-medium text-emerald-800">Paquets Laitue · Variété EDEN (25 g)</p>
          <p className="text-lg font-bold font-mono-tabular text-stone-900 mt-1">
            5 000 F · 2 000 F
          </p>
          <p className="text-xs text-stone-500 mt-0.5">Sachet 25 g EDEN · 100 m² ou 40 m²</p>
        </div>
        <div className="py-2 sm:py-0 sm:px-6">
          <p className="text-xs font-medium text-emerald-800">Paquets Bissap Blanc</p>
          <p className="text-lg font-bold font-mono-tabular text-stone-900 mt-1">
            5 000 F · 2 000 F
          </p>
          <p className="text-xs text-stone-500 mt-0.5">Parcelle 500 m² ou 200 m²</p>
        </div>
        <div className="py-2 sm:py-0 sm:px-6">
          <p className="text-xs font-medium text-emerald-800">Paquets Oignons · Variété SAFARI (30 g)</p>
          <p className="text-lg font-bold font-mono-tabular text-stone-900 mt-1">
            6 000 F · 2 500 F
          </p>
          <p className="text-xs text-stone-500 mt-0.5">Sachet 30 g SAFARI · 120 m² ou 50 m²</p>
        </div>
        <div className="py-2 sm:py-0 sm:pl-6">
          <p className="text-xs font-medium text-emerald-800">Paquet Poules</p>
          <p className="text-lg font-bold font-mono-tabular text-stone-900 mt-1">
            8 000 F
          </p>
          <p className="text-xs text-stone-500 mt-0.5">Lot avicole vacciné + aliment démarrage</p>
        </div>
      </div>

      {subscribedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4 text-sm text-emerald-950">
          <span>{subscribedNotice}</span>
          <button
            type="button"
            onClick={() => setSubscribedNotice(null)}
            className="text-xs font-semibold text-emerald-800 hover:underline whitespace-nowrap shrink-0"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Product Grid — Single-Elevation Depth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPackages.map((pkg) => {
          const isSelected = selectedPkg.id === pkg.id;
          return (
            <article
              key={pkg.id}
              className={`bg-white rounded-2xl border transition-colors duration-150 overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-800'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div>
                {/* 4:3 Product Image */}
                <div className="aspect-[4/3] w-full bg-stone-100 overflow-hidden border-b border-stone-100">
                  <ResilientImage
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    fallbackTitle={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-[1.02]"
                  />
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-7 space-y-4">
                  {/* Unboxed clean metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span className="font-medium text-emerald-800">{pkg.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{pkg.formatLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{pkg.surfaceLabel}</span>
                  </div>

                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-lg font-bold text-stone-900">
                      {pkg.name}
                    </h3>
                    <span className="text-xl font-bold font-mono-tabular text-emerald-900 whitespace-nowrap shrink-0">
                      {formatFcfa(pkg.priceFcfa)}
                    </span>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Included Inputs List — Clean Typographic Rows (No Line-by-Line Icons) */}
                  <div className="pt-3 border-t border-stone-100 space-y-2">
                    <p className="text-xs font-semibold text-stone-700">
                      Composition garantie à la livraison :
                    </p>
                    <ul className="divide-y divide-stone-100 text-xs text-stone-600">
                      {pkg.includedItems.map((item, idx) => (
                        <li key={idx} className="py-1.5 first:pt-0 last:pb-0">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card Footer: Yield Metrics & Actions */}
              <div className="px-6 md:px-7 py-4 bg-[#F7F7F5] border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-stone-600 font-mono-tabular">
                  <span>Dès </span>
                  <strong className="text-stone-900">{formatFcfa(pkg.minWeeklyFcfa)}/sem</strong>
                  <span> · Gain : +{formatFcfa(pkg.estimatedNetGainFcfa)}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPkg(pkg);
                      setInitialDeposit(Math.min(1000, pkg.priceFcfa));
                      const calcEl = document.getElementById('layaway-calculator');
                      calcEl?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="min-h-[40px] px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    Simuler l’épargne
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubscribe(pkg, pkg.minWeeklyFcfa)}
                    className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    Souscrire ({formatFcfa(pkg.priceFcfa)})
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Interactive Layaway & Agronomic Impact Calculator — Clean Hairline Split (No nested card) */}
      <div
        id="layaway-calculator"
        className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8"
      >
        <div className="border-b border-stone-200 pb-5 mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-emerald-800 mb-1">
              Planification des Versements Hebdomadaires
            </p>
            <h3 className="text-xl font-bold text-stone-900">
              Simulateur d’Épargne Progressive FOUT’AGRO
            </h3>
          </div>
          <span className="text-xs font-mono-tabular text-stone-600">
            Paquet sélectionné : {selectedPkg.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:divide-x lg:divide-stone-200 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6 lg:pr-8">
            <div className="space-y-2">
              <label
                htmlFor="calc-pkg-select"
                className="block text-xs font-semibold text-stone-700"
              >
                01. Choisir le paquet FOUT’AGRO à simuler
              </label>
              <select
                id="calc-pkg-select"
                value={selectedPkg.id}
                onChange={(e) => {
                  const found = packages.find((p) => p.id === e.target.value);
                  if (found) {
                    setSelectedPkg(found);
                    if (initialDeposit > found.priceFcfa) {
                      setInitialDeposit(found.minWeeklyFcfa);
                    }
                  }
                }}
                className="w-full min-h-[42px] px-3.5 py-2.5 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm font-medium text-stone-900"
              >
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatFcfa(p.priceFcfa)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-stone-700">
                <label htmlFor="initial-deposit-range">
                  02. Premier versement à l’inscription
                </label>
                <span className="font-mono-tabular text-emerald-800">
                  {formatFcfa(effectiveInitial)}
                </span>
              </div>
              <input
                id="initial-deposit-range"
                type="range"
                min={250}
                max={selectedPkg.priceFcfa}
                step={250}
                value={effectiveInitial}
                onChange={(e) => setInitialDeposit(Number(e.target.value))}
                className="w-full accent-emerald-800"
              />
              <div className="flex justify-between text-[11px] text-stone-400 font-mono-tabular">
                <span>250 FCFA</span>
                <span>{formatFcfa(Math.round(selectedPkg.priceFcfa / 2))}</span>
                <span>{formatFcfa(selectedPkg.priceFcfa)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-stone-700">
                <label htmlFor="weekly-save-range">
                  03. Épargne hebdomadaire (Paiement espèces ou Mobile Money)
                </label>
                <span className="font-mono-tabular text-emerald-800">
                  {formatFcfa(weeklySaveFcfa)} / semaine
                </span>
              </div>
              <input
                id="weekly-save-range"
                type="range"
                min={250}
                max={2500}
                step={250}
                value={weeklySaveFcfa}
                onChange={(e) => setWeeklySaveFcfa(Number(e.target.value))}
                className="w-full accent-emerald-800"
              />
              <div className="flex justify-between text-[11px] text-stone-400 font-mono-tabular">
                <span>250 FCFA/sem</span>
                <span>1 000 FCFA/sem</span>
                <span>2 500 FCFA/sem</span>
              </div>
            </div>
          </div>

          {/* Results Summary — Clean Hairline Separation */}
          <div className="lg:col-span-6 lg:pl-8 space-y-6">
            <div className="grid grid-cols-2 gap-6 border-b border-stone-200 pb-5">
              <div>
                <p className="text-xs text-stone-500">Durée d’épargne estimée</p>
                <p className="text-2xl font-bold font-mono-tabular text-stone-900 mt-1">
                  {weeksRequired === 0 ? 'Payé comptant' : `${weeksRequired} semaines`}
                </p>
                <p className="text-xs text-stone-500 mt-1 font-mono-tabular">
                  Reste à cotiser : {formatFcfa(remainingToSave)}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">Revenu net estimé à la récolte</p>
                <p className="text-2xl font-bold font-mono-tabular text-emerald-800 mt-1">
                  +{formatFcfa(selectedPkg.estimatedNetGainFcfa)}
                </p>
                <p className="text-xs text-stone-500 mt-1 font-mono-tabular">
                  Production prévue : {selectedPkg.expectedYieldKg} kg (+{selectedPkg.yieldIncreasePct}%)
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-stone-600">
              <p className="font-semibold text-stone-900">
                Conseil technique FOUT’AGRO :
              </p>
              <p className="leading-relaxed">{selectedPkg.agronomicMethod}</p>
            </div>

            <button
              type="button"
              onClick={() => handleSubscribe(selectedPkg, effectiveInitial)}
              className="w-full min-h-[44px] py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <span>
                Souscrire au {selectedPkg.name} avec {formatFcfa(effectiveInitial)}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

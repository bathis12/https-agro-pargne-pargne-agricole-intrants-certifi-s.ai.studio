import React, { useState } from 'react';
import { Sprout, Leaf, ChevronDown, ChevronUp, ArrowUpRight, Check } from 'lucide-react';

export type CropFaqCategory = 'ALL' | 'laitue' | 'oignons';

interface FaqItem {
  id: string;
  crop: 'laitue' | 'oignons';
  cropLabel: string;
  packPricesLabel: string;
  stageLabel: string;
  question: string;
  quickTip: string;
  dosageOrMetric: string;
  yieldImpact: string;
}

const AGRONOMIC_FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-laitue-1',
    crop: 'laitue',
    cropLabel: 'Laitue · Variété EDEN (25 g)',
    packPricesLabel: 'Paquets 5 000 F & 2 000 F',
    stageLabel: 'Étape 1 · Pépinière (Jours 1 à 21)',
    question: 'Comment réussir la pépinière de Laitue Variété EDEN (25 g) sous forte chaleur au Fouta ?',
    quickTip:
      'Semez le sachet de 25 g de Laitue Variété EDEN en sillons superficiels (0,5 cm) espacés de 10 cm sur une planche enrichie au compost FOUT’AGRO. Installez obligatoirement une ombrière en paille à 50 cm du sol entre 11h et 16h pour protéger les jeunes plantules de la brûlure solaire.',
    dosageOrMetric: 'Sachet 25 g EDEN · Ombrière 50 cm',
    yieldImpact: '95% de taux de levée en 4 jours'
  },
  {
    id: 'faq-laitue-2',
    crop: 'laitue',
    cropLabel: 'Laitue · Variété EDEN (25 g)',
    packPricesLabel: 'Paquets 5 000 F & 2 000 F',
    stageLabel: 'Étape 2 · Repiquage (Jour 21)',
    question: 'Quel espacement respecter au repiquage de la Laitue EDEN pour de grosses pommes ?',
    quickTip:
      'Repiquez exclusivement en fin d’après-midi (après 17h) sur sol pré-humecté en respectant un maillage de 25 cm × 25 cm avec le plantoir calibré. Veillez à ne jamais enterrer le collet de la plantule EDEN afin d’éviter la pourriture basale.',
    dosageOrMetric: 'Maillage 25 × 25 cm · Collet hors sol',
    yieldImpact: '+105% de rendement (180 kg / 100 m²)'
  },
  {
    id: 'faq-laitue-3',
    crop: 'laitue',
    cropLabel: 'Laitue · Variété EDEN (25 g)',
    packPricesLabel: 'Paquets 5 000 F & 2 000 F',
    stageLabel: 'Étape 3 · Paillage & Micro-dosage (Jours 25 à 45)',
    question: 'Comment éviter la montée en graines précoce de la Laitue EDEN ?',
    quickTip:
      'Étalez un paillis de paille sèche de 3 cm entre les rangs pour garder l’humidité fraîche aux racines. Appliquez le micro-dosage NPK dilué en couronne à 15 jours après repiquage et arrosez matin et soir.',
    dosageOrMetric: 'Paillage 3 cm · NPK au 15e jour',
    yieldImpact: '-40% d’eau consommée & feuilles tendres'
  },
  {
    id: 'faq-oignons-1',
    crop: 'oignons',
    cropLabel: 'Oignon · Variété SAFARI (30 g)',
    packPricesLabel: 'Paquets 6 000 F & 2 500 F',
    stageLabel: 'Étape 1 · Repiquage (Jours 40 à 45)',
    question: 'À quelle profondeur repiquer l’Oignon Variété SAFARI (30 g) pour de gros bulbes ?',
    quickTip:
      'Après pépinière du sachet de 30 g d’Oignon Variété SAFARI, habillez légèrement les racines et repiquez à 15 cm entre les lignes et 10 cm sur la ligne, à seulement 2 cm de profondeur. Un repiquage trop profond étouffe le bulbe SAFARI.',
    dosageOrMetric: 'Sachet 30 g SAFARI · Écartement 15 × 10 cm',
    yieldImpact: '+35% de bulbes SAFARI de gros calibre'
  },
  {
    id: 'faq-oignons-2',
    crop: 'oignons',
    packPricesLabel: 'Paquets 6 000 F & 2 500 F',
    cropLabel: 'Oignon · Variété SAFARI (30 g)',
    stageLabel: 'Étape 2 · Bulbaison & Engrais (Jours 15 & 40)',
    question: 'Comment fractionner l’engrais bulbes NPK 10-20-20 sur l’Oignon SAFARI ?',
    quickTip:
      'Fractionnez en 2 apports : 50% de la dose à 15 jours après repiquage (enracinement) et 50% à 40 jours au début du gonflement des bulbes SAFARI. Effectuez un binage superficiel avant chaque apport pour casser la croûte du sol.',
    dosageOrMetric: '2 apports (J+15 et J+40) + binage',
    yieldImpact: '380 kg récoltés sur 120 m² (+111%)'
  },
  {
    id: 'faq-oignons-3',
    crop: 'oignons',
    cropLabel: 'Oignon · Variété SAFARI (30 g)',
    packPricesLabel: 'Paquets 6 000 F & 2 500 F',
    stageLabel: 'Étape 3 · Sevrage Hydrique & Conservation',
    question: 'Quand arrêter l’arrosage de l’Oignon SAFARI avant la récolte ?',
    quickTip:
      'Coupez totalement l’irrigation 12 à 15 jours avant la récolte dès que 50% des fanes vertes s’inclinent au sol. Après arrachage, laissez sécher les bulbes SAFARI 5 jours à l’ombre aérée pour durcir la tunique.',
    dosageOrMetric: 'Arrêt d’eau J-15 avant récolte',
    yieldImpact: '-80% de pertes post-récolte au stockage'
  }
];

// Dedicated Crop Icon Component for Lettuce vs Onion
const CropTypeIcon: React.FC<{ crop: 'laitue' | 'oignons'; className?: string }> = ({
  crop,
  className = 'w-4 h-4'
}) => {
  if (crop === 'laitue') {
    return <Leaf className={`${className} text-emerald-700 shrink-0`} aria-hidden="true" />;
  }
  // Custom layered Onion Bulb SVG icon
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} text-amber-700 shrink-0`}
      aria-hidden="true"
    >
      <path d="M12 2v4" />
      <path d="M9 3l3 3 3-3" />
      <path d="M12 6c-4.5 2.5-7 6-7 9.5a7 7 0 0 0 14 0c0-3.5-2.5-7-7-9.5Z" />
      <path d="M12 6c-2 2.5-3 6-3 9.5a3 3 0 0 0 6 0c0-3.5-1-7-3-9.5Z" />
      <path d="M10 21.5L12 23l2-1.5" />
    </svg>
  );
};

interface AgronomicFaqSectionProps {
  onNavigateToCatalog?: () => void;
}

export const AgronomicFaqSection: React.FC<AgronomicFaqSectionProps> = ({
  onNavigateToCatalog
}) => {
  const [selectedCrop, setSelectedCrop] = useState<CropFaqCategory>('ALL');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    AGRONOMIC_FAQ_ITEMS.forEach((item) => {
      initial[item.id] = true;
    });
    return initial;
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems =
    selectedCrop === 'ALL'
      ? AGRONOMIC_FAQ_ITEMS
      : AGRONOMIC_FAQ_ITEMS.filter((item) => item.crop === selectedCrop);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const allExpanded = filteredItems.every((item) => expandedIds[item.id]);

  const handleToggleAll = () => {
    const nextState = !allExpanded;
    const updated: Record<string, boolean> = { ...expandedIds };
    filteredItems.forEach((item) => {
      updated[item.id] = nextState;
    });
    setExpandedIds(updated);
  };

  const handleCopyTip = (item: FaqItem) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(
        `FOUT'AGRO Conseil ${item.cropLabel}: ${item.question} -> ${item.quickTip} (${item.yieldImpact})`
      ).catch(() => {});
    }
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header & Interactive Crop Filter Tabs with Crop Icons */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-emerald-800">
              Guide Technique Champ-École FOUT’AGRO
            </span>
            <span aria-hidden="true">·</span>
            <span>Laitue (5 000 F / 2 000 F) & Oignons (6 000 F / 2 500 F)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            FAQ Agronomique — Maximiser le Rendement Laitue & Oignons
          </h2>
        </div>

        {/* Crop Filter Controls with Icons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            <button
              type="button"
              onClick={() => setSelectedCrop('ALL')}
              className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                selectedCrop === 'ALL'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-800" />
              <span>Toutes les cultures (6)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCrop('laitue')}
              className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                selectedCrop === 'laitue'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CropTypeIcon crop="laitue" className="w-3.5 h-3.5" />
              <span>Laitue (3)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCrop('oignons')}
              className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                selectedCrop === 'oignons'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CropTypeIcon crop="oignons" className="w-3.5 h-3.5" />
              <span>Oignons (3)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleAll}
            className="min-h-[36px] px-3 py-1.5 text-xs font-medium text-stone-700 bg-[#F7F7F5] border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            {allExpanded ? 'Tout réduire' : 'Tout déplier'}
          </button>
        </div>
      </div>

      {/* Crop Summary Strip with Icons — Hairline Divided (No Nested Boxes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200 border-b border-stone-200 pb-5">
        <div className="py-2 md:py-0 md:pr-6 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
            <CropTypeIcon crop="laitue" className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900">
                Laitue — Variété EDEN (25 g)
              </h3>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span className="text-xs font-mono-tabular font-semibold text-emerald-800">
                5 000 F (100 m²) & 2 000 F (40 m²)
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Semences certifiées <strong>Variété EDEN (sachet 25 g)</strong> à cycle court de <strong>45 jours</strong>. Objectif : <strong>180 kg</strong> sur 10 planches grâce à l’ombrière de pépinière, au repiquage collet hors sol et au paillage.
            </p>
          </div>
        </div>

        <div className="py-2 md:py-0 md:pl-6 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
            <CropTypeIcon crop="oignons" className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900">
                Oignon — Variété SAFARI (30 g)
              </h3>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span className="text-xs font-mono-tabular font-semibold text-amber-800">
                6 000 F (120 m²) & 2 500 F (50 m²)
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Semences certifiées <strong>Variété SAFARI (sachet 30 g)</strong> à haut calibre. Objectif : <strong>380 kg</strong> sur 12 planches grâce au repiquage superficiel (2 cm), au double apport NPK 10-20-20 et au sevrage hydrique à J-15.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion List — Hairline Divided Rows */}
      <div className="divide-y divide-stone-200">
        {filteredItems.map((item) => {
          const isOpen = !!expandedIds[item.id];
          return (
            <div key={item.id} className="py-4 first:pt-1 last:pb-1">
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="w-full text-left flex items-start justify-between gap-4 py-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded-lg"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                      item.crop === 'laitue'
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-amber-50/70 border-amber-200'
                    }`}
                  >
                    <CropTypeIcon crop={item.crop} className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    {/* Unboxed Metadata Line */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span
                        className={`font-semibold ${
                          item.crop === 'laitue' ? 'text-emerald-800' : 'text-amber-800'
                        }`}
                      >
                        {item.cropLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{item.packPricesLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.stageLabel}</span>
                    </div>

                    <h4 className="text-base font-bold text-stone-900 group-hover:text-emerald-900 transition-colors duration-150">
                      {item.question}
                    </h4>
                  </div>
                </div>

                <span className="w-9 h-9 rounded-lg bg-[#F7F7F5] group-hover:bg-stone-200/70 flex items-center justify-center text-stone-600 shrink-0 transition-colors duration-150">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="mt-3 pl-12.5 space-y-3">
                  <p className="text-sm text-stone-700 leading-relaxed max-w-[75ch]">
                    {item.quickTip}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-100 text-xs">
                    <div className="flex flex-wrap items-center gap-2 font-mono-tabular text-stone-600">
                      <span>Repère technique : <strong>{item.dosageOrMetric}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-800 font-semibold">
                        Gain : {item.yieldImpact}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyTip(item)}
                      className="min-h-[34px] px-3 py-1 bg-[#F7F7F5] hover:bg-stone-200/70 border border-stone-200 rounded-md text-xs font-medium text-stone-700 inline-flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap shrink-0"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-800" />
                          <span>Conseil copié</span>
                        </>
                      ) : (
                        <span>Copier ce mémo SMS</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Action */}
      {onNavigateToCatalog && (
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <span>
            Ces fiches pratiques sont également remises lors de la livraison des paquets Laitue et Oignons dans les 36 villages.
          </span>
          <button
            type="button"
            onClick={onNavigateToCatalog}
            className="min-h-[38px] px-4 py-2 bg-stone-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>Voir les paquets Laitue & Oignons</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
};

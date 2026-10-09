import React, { useState } from 'react';
import {
  VillageFarmerRecord,
  TrainingSession,
  ReferralRecord,
  SubscribedPlan,
  FOUTA_ZONES,
  FOUTA_VILLAGES,
  InterventionZone,
  generateUniqueReferralCode,
  formatFcfa
} from '../data/agroData';
import {
  Search,
  UserPlus,
  CheckSquare,
  PlusCircle,
  Gift,
  Copy,
  Check,
  RefreshCw,
  Send,
  CheckCircle2
} from 'lucide-react';

interface VillageNetworkProps {
  cohort: VillageFarmerRecord[];
  trainings: TrainingSession[];
  referrals: ReferralRecord[];
  plans: SubscribedPlan[];
  onRecordCohortDeposit: (farmerId: string, amountFcfa: number) => void;
  onAddCohortFarmer: (farmer: Omit<VillageFarmerRecord, 'id' | 'codeProducteur'>) => void;
  onToggleTraining: (trainingId: string) => void;
  onCreateReferral: (referral: Omit<ReferralRecord, 'id' | 'createdAt' | 'status'>) => void;
  onValidatePendingReferral: (referralId: string) => void;
  onClaimReferralBonus: (referralId: string, targetPlanId: string) => void;
}

const FOUTA_PACKAGE_OPTIONS = [
  { label: 'Pack Laitue — Grand Format (5 000 F · EDEN 25 g)', price: 5000 },
  { label: 'Pack Laitue — Format Découverte (2 000 F · EDEN 25 g)', price: 2000 },
  { label: 'Pack Bissap Blanc — Grand Format (5 000 F)', price: 5000 },
  { label: 'Pack Bissap Blanc — Format Découverte (2 000 F)', price: 2000 },
  { label: 'Pack Oignons — Grand Format (6 000 F · SAFARI 30 g)', price: 6000 },
  { label: 'Pack Oignons — Format Découverte (2 500 F · SAFARI 30 g)', price: 2500 },
  { label: 'Pack Poules Villageoises — Unité Complète (8 000 F)', price: 8000 }
];

export const VillageNetwork: React.FC<VillageNetworkProps> = ({
  cohort,
  trainings,
  referrals,
  plans,
  onRecordCohortDeposit,
  onAddCohortFarmer,
  onToggleTraining,
  onCreateReferral,
  onValidatePendingReferral,
  onClaimReferralBonus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<'ALL' | InterventionZone>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');
  const [villageDirectoryZone, setVillageDirectoryZone] = useState<'ALL' | InterventionZone>('ALL');
  const [villageSearch, setVillageSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // "Parrainez un voisin" state
  const [refZone, setRefZone] = useState<InterventionZone>('Hamady Ounaré');
  const [refVillage, setRefVillage] = useState<string>('Sinthiane Dioudé');
  const [generatedCode, setGeneratedCode] = useState<string>(() =>
    generateUniqueReferralCode('Hamady Ounaré')
  );
  const [refNeighborName, setRefNeighborName] = useState<string>('');
  const [refNeighborPhone, setRefNeighborPhone] = useState<string>('+221 77 ');
  const [refPackageLabel, setRefPackageLabel] = useState<string>(
    FOUTA_PACKAGE_OPTIONS[4].label
  );
  const [copiedRefCode, setCopiedRefCode] = useState<boolean>(false);
  const [referralBannerMsg, setReferralBannerMsg] = useState<string | null>(null);
  const [targetBonusPlanId, setTargetBonusPlanId] = useState<string>(
    plans.find((p) => p.savedFcfa < p.targetFcfa)?.id || plans[0]?.id || 'plan-101'
  );

  // New farmer form state
  const [newName, setNewName] = useState('');
  const [newVillage, setNewVillage] = useState(FOUTA_VILLAGES[0].name);
  const [newPhone, setNewPhone] = useState('+221 77 ');
  const [newPkg, setNewPkg] = useState(FOUTA_PACKAGE_OPTIONS[0].label);
  const [newTarget, setNewTarget] = useState(5000);
  const [newInitialSaved, setNewInitialSaved] = useState(1000);

  const zoneVillagesForReferral = FOUTA_VILLAGES.filter((v) => v.zone === refZone);

  const handleZoneChangeForReferral = (nextZone: InterventionZone) => {
    setRefZone(nextZone);
    const matchingVillages = FOUTA_VILLAGES.filter((v) => v.zone === nextZone);
    if (matchingVillages.length > 0) {
      setRefVillage(matchingVillages[0].name);
    }
    setGeneratedCode(generateUniqueReferralCode(nextZone));
  };

  const handleRegenerateCode = () => {
    setGeneratedCode(generateUniqueReferralCode(refZone));
  };

  const handleCopyGeneratedCode = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(generatedCode).catch(() => {});
    }
    setCopiedRefCode(true);
    setTimeout(() => setCopiedRefCode(false), 2000);
  };

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = refNeighborName.trim();
    if (!trimmedName) return;

    onCreateReferral({
      referralCode: generatedCode,
      neighborName: trimmedName,
      neighborPhone: refNeighborPhone.trim() || '+221 77 500 00 00',
      village: refVillage,
      zone: refZone,
      packageLabel: refPackageLabel,
      bonusFcfa: 500
    });

    setReferralBannerMsg(
      `Invitation SMS envoyée à ${trimmedName} (${refVillage}, Zone ${refZone}) avec le code unique ${generatedCode}. Bonus de +500 FCFA programmé !`
    );
    setRefNeighborName('');
    setRefNeighborPhone('+221 77 ');
    setGeneratedCode(generateUniqueReferralCode(refZone));
    setTimeout(() => setReferralBannerMsg(null), 5000);
  };

  const filteredCohort = cohort.filter((f) => {
    const matchesSearch =
      f.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.codeProducteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.zone.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedZoneFilter !== 'ALL' && f.zone !== selectedZoneFilter) return false;
    if (statusFilter === 'COMPLETED') return f.savedFcfa >= f.targetFcfa;
    if (statusFilter === 'IN_PROGRESS') return f.savedFcfa < f.targetFcfa;
    return true;
  });

  const filteredDirectoryVillages = FOUTA_VILLAGES.filter((v) => {
    const matchesZone = villageDirectoryZone === 'ALL' || v.zone === villageDirectoryZone;
    const matchesText =
      v.name.toLowerCase().includes(villageSearch.toLowerCase()) ||
      v.zone.toLowerCase().includes(villageSearch.toLowerCase()) ||
      v.relayStore.toLowerCase().includes(villageSearch.toLowerCase());
    return matchesZone && matchesText;
  });

  const totalVillageSaved = cohort.reduce((acc, f) => acc + f.savedFcfa, 0);
  const totalVillageTarget = cohort.reduce((acc, f) => acc + f.targetFcfa, 0);
  const readyForDeliveryCount = cohort.filter((f) => f.savedFcfa >= f.targetFcfa).length;

  const totalCreditedBonus = referrals
    .filter((r) => r.status === 'Crédité sur paquet')
    .reduce((acc, r) => acc + r.bonusFcfa, 0);
  const totalReadyBonus = referrals
    .filter((r) => r.status === 'Validé — Bonus prêt')
    .reduce((acc, r) => acc + r.bonusFcfa, 0);

  const handleAddFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const matchedVillageInfo = FOUTA_VILLAGES.find((v) => v.name === newVillage);
    const resolvedZone: InterventionZone = matchedVillageInfo?.zone || 'Matam';

    onAddCohortFarmer({
      fullName: newName.trim(),
      village: newVillage,
      zone: resolvedZone,
      phone: newPhone,
      packageName: newPkg,
      targetFcfa: newTarget,
      savedFcfa: Math.min(newTarget, newInitialSaved),
      trainingsCompleted: 1,
      totalTrainings: 4,
      lastDepositDate: '09 Oct 2026'
    });
    setNewName('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-14">
      {/* Section 0: Module de Parrainage 'Parrainez un voisin' — Unique Code Generator & Bonus Tracker */}
      <section
        id="village-referral-module"
        className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1.5">
              <Gift className="w-3.5 h-3.5 text-emerald-800" />
              <span className="font-medium text-emerald-800">
                Module « Parrainez un voisin » · Solidarité Inter-Villageoise FOUT’AGRO
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                +500 FCFA de bonus d’épargne par voisin parrainé
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Parrainez un Voisin — Générateur de Code Unique par Zone
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-tabular">
            <span className="text-stone-600">
              Bonus encaissés : <strong className="text-emerald-800">+{formatFcfa(totalCreditedBonus)}</strong>
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-600">
              Prêts à encaisser : <strong className="text-amber-800">+{formatFcfa(totalReadyBonus)}</strong>
            </span>
          </div>
        </div>

        {referralBannerMsg && (
          <div
            role="status"
            className="py-3 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-medium flex items-center justify-between gap-3"
          >
            <span>{referralBannerMsg}</span>
            <button
              type="button"
              onClick={() => setReferralBannerMsg(null)}
              className="font-semibold text-emerald-800 hover:underline whitespace-nowrap shrink-0"
            >
              Fermer
            </button>
          </div>
        )}

        {/* 2-Column Split: Left = Unique Code Generator & SMS Invite Form | Right = Active Referrals & Bonus Claim */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:divide-x lg:divide-stone-200 items-start">
          {/* Left Column: Unique Referral Code Generator & Neighbor Invitation Form */}
          <div className="lg:col-span-6 lg:pr-8 space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-bold text-stone-900">
                1. Sélectionnez votre zone pour générer un code de parrainage unique :
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {FOUTA_ZONES.map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => handleZoneChangeForReferral(z)}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                      refZone === z
                        ? 'bg-emerald-900 text-white font-semibold'
                        : 'bg-[#F7F7F5] text-stone-700 border border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    Zone {z}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Unique Referral Code Strip */}
            <div className="py-3.5 border-y border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-stone-500">
                  Code d’invitation unique ({refZone}) :
                </p>
                <p className="text-xl font-bold font-mono-tabular text-emerald-900 tracking-wide mt-0.5">
                  {generatedCode}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  className="min-h-[38px] px-3 py-1.5 bg-[#F7F7F5] hover:bg-stone-200/70 text-stone-700 border border-stone-300 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Nouveau code</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyGeneratedCode}
                  className="min-h-[38px] px-3.5 py-1.5 bg-stone-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  {copiedRefCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Neighbor Invitation Form */}
            <form onSubmit={handleReferralSubmit} className="space-y-4">
              <p className="text-xs font-bold text-stone-900">
                2. Invitez un agriculteur voisin de votre zone (+500 FCFA de bonus) :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nom complet du voisin agriculteur
                  </label>
                  <input
                    type="text"
                    required
                    value={refNeighborName}
                    onChange={(e) => setRefNeighborName(e.target.value)}
                    placeholder="Ex: Moussa Sow"
                    className="w-full min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Téléphone GSM du voisin
                  </label>
                  <input
                    type="tel"
                    required
                    value={refNeighborPhone}
                    onChange={(e) => setRefNeighborPhone(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm font-mono-tabular text-stone-900 focus:outline-none focus:border-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Village de la zone {refZone} ({zoneVillagesForReferral.length})
                  </label>
                  <select
                    value={refVillage}
                    onChange={(e) => setRefVillage(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-emerald-800"
                  >
                    {zoneVillagesForReferral.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Paquet recommandé au voisin
                  </label>
                  <select
                    value={refPackageLabel}
                    onChange={(e) => setRefPackageLabel(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-emerald-800"
                  >
                    {FOUTA_PACKAGE_OPTIONS.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 px-5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors duration-150 flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>
                  Envoyer le code {generatedCode} par SMS & Parrainer ce voisin (+500 F)
                </span>
              </button>
            </form>
          </div>

          {/* Right Column: Live Referral Registry & Instant Bonus Credit to Active Plan */}
          <div className="lg:col-span-6 lg:pl-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <p className="text-xs font-bold text-stone-900">
                Voisins invités & Bonus d’épargne ({referrals.length}) :
              </p>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500">Créditer sur :</span>
                <select
                  value={targetBonusPlanId}
                  onChange={(e) => setTargetBonusPlanId(e.target.value)}
                  aria-label="Paquet cible pour le bonus de parrainage"
                  className="min-h-[34px] px-2.5 py-1 bg-[#F7F7F5] border border-stone-300 rounded-md text-xs font-semibold text-stone-900"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.packageName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="divide-y divide-stone-200">
              {referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular">
                      <span className="font-bold text-emerald-900">{ref.referralCode}</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="font-sans font-medium text-stone-700">
                        {ref.village} ({ref.zone})
                      </span>
                    </div>
                    <p className="text-sm font-bold text-stone-900">
                      {ref.neighborName}{' '}
                      <span className="font-normal text-xs text-stone-500 font-mono-tabular">
                        ({ref.neighborPhone})
                      </span>
                    </p>
                    <p className="text-xs text-stone-500">{ref.packageLabel}</p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-mono-tabular text-xs font-bold text-emerald-800">
                      +{formatFcfa(ref.bonusFcfa)}
                    </span>

                    {ref.status === 'Crédité sur paquet' && (
                      <span className="min-h-[36px] px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Crédité</span>
                      </span>
                    )}

                    {ref.status === 'Validé — Bonus prêt' && (
                      <button
                        type="button"
                        onClick={() => onClaimReferralBonus(ref.id, targetBonusPlanId)}
                        className="min-h-[38px] px-3.5 py-1.5 bg-stone-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
                      >
                        Encaisser +{formatFcfa(ref.bonusFcfa)}
                      </button>
                    )}

                    {ref.status === 'Invitation envoyée (SMS)' && (
                      <button
                        type="button"
                        onClick={() => onValidatePendingReferral(ref.id)}
                        className="min-h-[38px] px-3 py-1.5 bg-[#F7F7F5] hover:bg-stone-200/70 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
                      >
                        Valider adhésion (+500 F)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Official Directory of Intervention Zones & 36 FOUT'AGRO Villages — Single-Elevation Grid */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <p className="text-xs font-medium text-emerald-800 mb-1.5">
              Couverture Territoriale Officielle FOUT’AGRO · 4 Zones & {FOUTA_VILLAGES.length} Villages
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Zones d’Intervention : Matam · Hamady Ounaré · Kanel · Bakel
            </h2>
          </div>

          {/* Zone Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => setVillageDirectoryZone('ALL')}
              className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
                villageDirectoryZone === 'ALL'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tous ({FOUTA_VILLAGES.length})
            </button>
            {FOUTA_ZONES.map((zone) => {
              const count = FOUTA_VILLAGES.filter((v) => v.zone === zone).length;
              return (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setVillageDirectoryZone(zone)}
                  className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    villageDirectoryZone === zone
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {zone} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Village Search Input */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={villageSearch}
              onChange={(e) => setVillageSearch(e.target.value)}
              placeholder="Rechercher un village (ex: Ganguel Soulé, Sinthiane Dioudé, Orkadiéré, Ogo...)"
              className="w-full min-h-[42px] pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>
          <p className="text-xs text-stone-500">
            Sélectionnez un village pour parrainer ou inscrire un producteur de cette localité
          </p>
        </div>

        {/* Single-Elevation Grid of all 36 FOUT'AGRO Villages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDirectoryVillages.map((vil) => {
            const activeProducersCount = cohort.filter(
              (c) => c.village.toLowerCase() === vil.name.toLowerCase()
            ).length;

            return (
              <div
                key={vil.name}
                className="p-4 bg-white border border-stone-200 hover:border-stone-300 rounded-xl flex flex-col justify-between gap-3 transition-colors duration-150"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                    <span className="font-medium text-emerald-800">{vil.zone}</span>
                    {activeProducersCount > 0 && (
                      <span className="font-mono-tabular text-stone-700">
                        {activeProducersCount} inscrit{activeProducersCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-stone-900 mt-1">{vil.name}</p>
                  <p className="text-xs text-stone-500 truncate mt-0.5">
                    {vil.relayStore}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      setRefZone(vil.zone);
                      setRefVillage(vil.name);
                      setGeneratedCode(generateUniqueReferralCode(vil.zone));
                      const refEl = document.getElementById('village-referral-module');
                      refEl?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left text-xs font-semibold text-emerald-800 hover:underline whitespace-nowrap shrink-0"
                  >
                    Parrainer (+500 F)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewVillage(vil.name);
                      setShowAddForm(true);
                      const formEl = document.getElementById('cohort-enrollment-section');
                      formEl?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-right text-xs font-semibold text-stone-700 hover:text-emerald-800 transition-colors duration-150 whitespace-nowrap shrink-0 truncate"
                  >
                    + Enrôler
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Producer Cohort & Cooperative KPIs — Clean Hairline Architecture */}
      <section
        id="cohort-enrollment-section"
        className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <p className="text-xs font-medium text-emerald-800 mb-1">
              Suivi des Producteurs par Village · Matam, Hamady Ounaré, Kanel & Bakel
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              Registre des Souscriptions & Livraisons Villageoises
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="min-h-[40px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors duration-150 flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>{showAddForm ? 'Fermer le formulaire' : 'Inscrire un producteur'}</span>
          </button>
        </div>

        {/* 3-Column Cooperative Summary — Hairline Dividers (No Nested Boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200 border-b border-stone-200 pb-6">
          <div className="py-2 md:py-0 md:pr-6">
            <p className="text-xs text-stone-500">Épargne collective FOUT’AGRO</p>
            <p className="text-2xl font-bold font-mono-tabular text-stone-900 mt-1">
              {formatFcfa(totalVillageSaved)}
            </p>
            <p className="text-xs text-stone-500 mt-1 font-mono-tabular">
              Sur {formatFcfa(totalVillageTarget)} ({Math.round((totalVillageSaved / totalVillageTarget) * 100)}%)
            </p>
          </div>

          <div className="py-2 md:py-0 md:px-6">
            <p className="text-xs text-stone-500">Producteurs à 100% (Prêts à livrer)</p>
            <p className="text-2xl font-bold font-mono-tabular text-emerald-800 mt-1">
              {readyForDeliveryCount} / {cohort.length} producteurs
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Magasins : Matam, Hamady Ounaré, Kanel & Bakel
            </p>
          </div>

          <div className="py-2 md:py-0 md:pl-6">
            <p className="text-xs text-stone-500">Villages couverts par le réseau</p>
            <p className="text-2xl font-bold font-mono-tabular text-stone-900 mt-1">
              {FOUTA_VILLAGES.length} villages
            </p>
            <p className="text-xs text-stone-500 mt-1">
              4 zones d’intervention actives au Fouta
            </p>
          </div>
        </div>

        {/* Add Producer Form with all 36 Villages — Hairline Separated */}
        {showAddForm && (
          <form
            onSubmit={handleAddFarmerSubmit}
            className="pb-6 border-b border-stone-200 space-y-4"
          >
            <h3 className="text-sm font-bold text-stone-900">
              Enrôler un producteur dans l’un des 36 villages FOUT’AGRO
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nom complet du producteur
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Halima Sall"
                  className="w-full min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Village FOUT’AGRO ({FOUTA_VILLAGES.length} villages)
                </label>
                <select
                  value={newVillage}
                  onChange={(e) => setNewVillage(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm"
                >
                  {FOUTA_VILLAGES.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} (Zone {v.zone})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Téléphone GSM / USSD
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm font-mono-tabular"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Paquet FOUT’AGRO Choisi
                </label>
                <select
                  value={newPkg}
                  onChange={(e) => {
                    const selected = FOUTA_PACKAGE_OPTIONS.find(
                      (o) => o.label === e.target.value
                    );
                    setNewPkg(e.target.value);
                    if (selected) {
                      setNewTarget(selected.price);
                      setNewInitialSaved(Math.min(1000, selected.price));
                    }
                  }}
                  className="w-full min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm"
                >
                  {FOUTA_PACKAGE_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.label}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Premier versement en espèces (FCFA)
                </label>
                <input
                  type="number"
                  min={250}
                  max={newTarget}
                  step={250}
                  value={newInitialSaved}
                  onChange={(e) => setNewInitialSaved(Number(e.target.value))}
                  className="w-full min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm font-mono-tabular"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full min-h-[42px] py-2 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  Valider l’enrôlement à {newVillage}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer par producteur, village ou zone..."
              className="w-full min-h-[40px] pl-10 pr-4 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Zone Filter */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
              {(['ALL', ...FOUTA_ZONES] as const).map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setSelectedZoneFilter(z)}
                  className={`min-h-[34px] px-3 py-1 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    selectedZoneFilter === z
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {z === 'ALL' ? 'Toutes zones' : z}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
              {[
                { id: 'ALL', label: 'Tous' },
                { id: 'COMPLETED', label: '100%' },
                { id: 'IN_PROGRESS', label: 'En cours' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() =>
                    setStatusFilter(f.id as 'ALL' | 'COMPLETED' | 'IN_PROGRESS')
                  }
                  className={`min-h-[34px] px-3 py-1 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    statusFilter === f.id
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* High-Density Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-xs font-semibold text-stone-500">
                <th className="py-3 pr-4">ID Producteur</th>
                <th className="py-3 px-4">Producteur & Village</th>
                <th className="py-3 px-4">Paquets FOUT’AGRO</th>
                <th className="py-3 px-4">Épargne / Objectif</th>
                <th className="py-3 px-4">Formations</th>
                <th className="py-3 pl-4 text-right">Collecte rapide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredCohort.map((farmer) => {
                const pct = Math.min(
                  100,
                  Math.round((farmer.savedFcfa / farmer.targetFcfa) * 100)
                );
                const isDone = farmer.savedFcfa >= farmer.targetFcfa;
                return (
                  <tr
                    key={farmer.id}
                    className="hover:bg-stone-50/90 transition-colors"
                  >
                    <td className="py-3.5 pr-4 font-mono-tabular text-xs font-semibold text-stone-900 whitespace-nowrap">
                      {farmer.codeProducteur}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-semibold text-stone-900">{farmer.fullName}</p>
                      <p className="text-xs text-stone-500">
                        {farmer.village} ({farmer.zone}) · {farmer.phone}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-stone-700 max-w-[240px] truncate">
                      {farmer.packageName}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center justify-between text-xs font-mono-tabular mb-1">
                        <span className="font-semibold text-stone-900">
                          {formatFcfa(farmer.savedFcfa)}
                        </span>
                        <span className="text-stone-500">
                          / {formatFcfa(farmer.targetFcfa)} ({pct}%)
                        </span>
                      </div>
                      <div className="w-40 h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full origin-left transition-transform duration-150 ${
                            isDone ? 'bg-emerald-700' : 'bg-amber-600'
                          }`}
                          style={{ transform: `scaleX(${pct / 100})` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono-tabular text-xs text-stone-700 whitespace-nowrap">
                      {farmer.trainingsCompleted} / {farmer.totalTrainings} séances
                    </td>
                    <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                      {isDone ? (
                        <span className="text-xs font-semibold text-emerald-800">
                          100% — Bon de retrait émis
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRecordCohortDeposit(farmer.id, 500)}
                          className="min-h-[36px] px-3.5 py-1.5 bg-stone-100 hover:bg-emerald-800 hover:text-white text-stone-800 rounded-lg text-xs font-mono-tabular font-medium transition-colors duration-150 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+500 FCFA</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Practical Agronomic Field Training Modules — Single-Elevation Cards */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-emerald-800 mb-1">
              Accompagnement Technique Paysan · Matam, Hamady Ounaré, Kanel & Bakel
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              Programme de Formation au Champ-École FOUT’AGRO
            </h2>
          </div>
          <span className="text-xs font-mono-tabular text-stone-600">
            {trainings.filter((t) => t.completed).length} / {trainings.length} modules validés
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainings.map((mod) => (
            <div
              key={mod.id}
              className="p-6 bg-white border border-stone-200 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>
                    {mod.seasonPhase} · {mod.durationMinutes} min
                  </span>
                  <span className="font-mono-tabular font-medium text-stone-700">
                    {mod.nextSessionDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900">
                  {mod.title}
                </h3>

                <p className="text-xs text-stone-700 leading-relaxed">
                  <strong>Pratique clé :</strong> {mod.keyPractice}
                </p>

                <ol className="space-y-1.5 pt-2 border-t border-stone-100 text-xs text-stone-600 list-decimal list-inside">
                  {mod.steps.map((stepText, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {stepText}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
                <span className="text-xs text-emerald-900 font-medium">
                  Impact : {mod.expectedImpact}
                </span>

                <button
                  type="button"
                  onClick={() => onToggleTraining(mod.id)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    mod.completed
                      ? 'bg-emerald-800 text-white'
                      : 'bg-[#F7F7F5] border border-stone-300 text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>
                    {mod.completed ? 'Séance validée' : 'Marquer comme suivie'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

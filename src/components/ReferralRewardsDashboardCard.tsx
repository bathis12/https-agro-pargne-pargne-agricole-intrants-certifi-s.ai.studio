import React, { useState } from 'react';
import {
  ReferralRecord,
  SubscribedPlan,
  formatFcfa
} from '../data/agroData';
import {
  Gift,
  CheckCircle2,
  ArrowUpRight,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

interface ReferralRewardsDashboardCardProps {
  referrals: ReferralRecord[];
  plans: SubscribedPlan[];
  personalReferralCode: string;
  onClaimReferralBonus: (referralId: string, targetPlanId: string) => void;
  onValidatePendingReferral: (referralId: string) => void;
  onOpenVillageReferralModule: () => void;
}

export const ReferralRewardsDashboardCard: React.FC<ReferralRewardsDashboardCardProps> = ({
  referrals,
  plans,
  personalReferralCode,
  onClaimReferralBonus,
  onValidatePendingReferral,
  onOpenVillageReferralModule
}) => {
  const incompletePlans = plans.filter((p) => p.savedFcfa < p.targetFcfa);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    incompletePlans[0]?.id || plans[0]?.id || 'plan-101'
  );
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  const creditedReferrals = referrals.filter((r) => r.status === 'Crédité sur paquet');
  const readyReferrals = referrals.filter((r) => r.status === 'Validé — Bonus prêt');
  const pendingReferrals = referrals.filter((r) => r.status === 'Invitation envoyée (SMS)');

  const totalEarnedBonusFcfa = creditedReferrals.reduce((acc, r) => acc + r.bonusFcfa, 0);
  const availableBonusFcfa = readyReferrals.reduce((acc, r) => acc + r.bonusFcfa, 0);
  const potentialPendingFcfa = pendingReferrals.reduce((acc, r) => acc + r.bonusFcfa, 0);

  const handleCopyCode = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(personalReferralCode).catch(() => {});
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleClaim = (ref: ReferralRecord) => {
    const targetPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];
    if (!targetPlan) return;
    onClaimReferralBonus(ref.id, targetPlan.id);
    setClaimedNotice(
      `Bonus de ${formatFcfa(ref.bonusFcfa)} (parrainage de ${ref.neighborName} · ${ref.village}) crédité sur votre « ${targetPlan.packageName} » !`
    );
    setTimeout(() => setClaimedNotice(null), 4000);
  };

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header & Direct Link to Villages Referral Module */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-emerald-800">
              Programme « Parrainez un voisin » · Solidarité Agricole du Fouta
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              +500 FCFA de bonus d’épargne par voisin inscrit
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Suivi des Récompenses de Parrainage & Bonus d’Épargne
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyCode}
            className="min-h-[40px] px-3.5 py-2 bg-[#F7F7F5] hover:bg-stone-200/70 text-stone-800 border border-stone-300 rounded-lg text-xs font-mono-tabular font-semibold transition-colors duration-150 inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-800" />
                <span>Code copié : {personalReferralCode}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-emerald-800" />
                <span>Mon code : {personalReferralCode}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenVillageReferralModule}
            className="min-h-[40px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>Parrainer un voisin (Section Villages)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4-Column Rewards Summary Strip — Hairline Divided (Zero Nested Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 border-b border-stone-200 pb-5">
        <div className="py-2 sm:py-0 sm:pr-6">
          <p className="text-xs text-stone-500">Voisins parrainés (Zone Fouta)</p>
          <p className="text-2xl font-bold font-mono-tabular text-stone-900 mt-1">
            {referrals.length} agriculteur{referrals.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-emerald-800 mt-0.5">
            {creditedReferrals.length + readyReferrals.length} adhésion(s) validée(s)
          </p>
        </div>

        <div className="py-2 sm:py-0 sm:px-6">
          <p className="text-xs text-stone-500">Bonus déjà crédités sur vos paquets</p>
          <p className="text-2xl font-bold font-mono-tabular text-emerald-800 mt-1">
            +{formatFcfa(totalEarnedBonusFcfa)}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">
            Ajoutés directement à votre épargne
          </p>
        </div>

        <div className="py-2 sm:py-0 sm:px-6">
          <p className="text-xs text-stone-500">Bonus prêts à encaisser maintenant</p>
          <p className="text-2xl font-bold font-mono-tabular text-amber-800 mt-1">
            +{formatFcfa(availableBonusFcfa)}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">
            {readyReferrals.length} bonus disponible{readyReferrals.length > 1 ? 's' : ''} immédiatement
          </p>
        </div>

        <div className="py-2 sm:py-0 sm:pl-6">
          <p className="text-xs text-stone-500">Invitations SMS en attente</p>
          <p className="text-2xl font-bold font-mono-tabular text-stone-900 mt-1">
            +{formatFcfa(potentialPendingFcfa)}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">
            {pendingReferrals.length} voisin{pendingReferrals.length > 1 ? 's' : ''} invité{pendingReferrals.length > 1 ? 's' : ''} par SMS
          </p>
        </div>
      </div>

      {claimedNotice && (
        <div
          role="status"
          className="py-3 px-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950 font-medium flex items-center justify-between gap-3"
        >
          <span>{claimedNotice}</span>
          <button
            type="button"
            onClick={() => setClaimedNotice(null)}
            className="text-emerald-800 font-semibold hover:underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Target Plan Selector for Applying Available Bonus */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4 text-xs">
        <div className="flex items-center gap-2 text-stone-700">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            Choisissez le paquet FOUT’AGRO sur lequel appliquer vos <strong>bonus de parrainage (+500 FCFA)</strong> :
          </span>
        </div>

        <select
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
          aria-label="Choisir le paquet bénéficiaire du bonus"
          className="min-h-[38px] px-3 py-1.5 bg-[#F7F7F5] border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:border-emerald-800"
        >
          {plans.map((p) => {
            const rem = Math.max(0, p.targetFcfa - p.savedFcfa);
            return (
              <option key={p.id} value={p.id}>
                {p.packageName} ({rem > 0 ? `Reste ${formatFcfa(rem)}` : '100% complété'})
              </option>
            );
          })}
        </select>
      </div>

      {/* Referrals & Bonus Tracking List — Clean Hairline Rows */}
      <div className="divide-y divide-stone-200">
        {referrals.map((ref) => (
          <div
            key={ref.id}
            className="py-4 first:pt-1 last:pb-1 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular">
                <span className="font-bold text-stone-900">{ref.referralCode}</span>
                <span aria-hidden="true" className="text-stone-400">·</span>
                <span className="font-sans font-semibold text-emerald-800">
                  Village : {ref.village} (Zone {ref.zone})
                </span>
                <span aria-hidden="true" className="text-stone-400">·</span>
                <span className="text-stone-500">{ref.createdAt}</span>
              </div>

              <p className="text-sm font-bold text-stone-900">
                Voisin parrainé : {ref.neighborName}{' '}
                <span className="font-normal text-xs text-stone-500 font-mono-tabular">
                  ({ref.neighborPhone})
                </span>
              </p>

              <p className="text-xs text-stone-600">
                Paquet choisi : <strong>{ref.packageLabel}</strong>
                {ref.creditedPlanName && (
                  <span className="text-emerald-800 font-medium">
                    {' '}· Bonus crédité sur « {ref.creditedPlanName} »
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <span className="font-mono-tabular text-sm font-bold text-emerald-900">
                +{formatFcfa(ref.bonusFcfa)}
              </span>

              {ref.status === 'Crédité sur paquet' && (
                <span className="min-h-[36px] px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Bonus encaissé</span>
                </span>
              )}

              {ref.status === 'Validé — Bonus prêt' && (
                <button
                  type="button"
                  onClick={() => handleClaim(ref)}
                  className="min-h-[38px] px-4 py-1.5 bg-stone-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  Appliquer +{formatFcfa(ref.bonusFcfa)} sur mon paquet
                </button>
              )}

              {ref.status === 'Invitation envoyée (SMS)' && (
                <button
                  type="button"
                  onClick={() => onValidatePendingReferral(ref.id)}
                  className="min-h-[38px] px-3.5 py-1.5 bg-[#F7F7F5] hover:bg-stone-200/70 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  Simuler l’adhésion de {ref.neighborName} (Débloquer +500 F)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { SubscribedPlan, formatFcfa } from '../data/agroData';
import { Bell, Send, CheckCircle2, ArrowUpRight, Check } from 'lucide-react';

interface HarvestDeliveryReminderCardProps {
  plans: SubscribedPlan[];
  onTriggerJ7Sms: (plan: SubscribedPlan, j7DateLabel: string, harvestWindowLabel: string, pickupCode: string) => void;
  onCompletePlanNow?: (planId: string) => void;
}

interface ComputedReminderSchedule {
  plan: SubscribedPlan;
  isCompleted: boolean;
  j7ReminderDate: string;
  deliveryDate: string;
  harvestTargetWindow: string;
  prepChecklist: string;
  pickupCode: string;
}

// Helper to compute exact J-7 date and expected harvest window from deliveryDate
function computeScheduleForPlan(plan: SubscribedPlan, index: number): ComputedReminderSchedule {
  const isCompleted = plan.savedFcfa >= plan.targetFcfa;
  const match = plan.deliveryDate.match(/^(\d{1,2})\s+([A-Za-zÀ-ÿ]+)\s+(\d{4})$/);

  let j7ReminderDate = '03 Mai 2027 (J-7)';
  if (match) {
    const dayNum = parseInt(match[1], 10);
    const monthStr = match[2];
    const yearStr = match[3];
    const j7Day = Math.max(1, dayNum - 7);
    const paddedDay = j7Day < 10 ? `0${j7Day}` : `${j7Day}`;
    j7ReminderDate = `${paddedDay} ${monthStr} ${yearStr} (J-7)`;
  }

  const nameLower = plan.packageName.toLowerCase();
  let harvestTargetWindow = '25 Juin – 05 Juil 2027 (Cycle 45j)';
  let prepChecklist =
    'Ameublir les 10 planches, épandre le compost de fond et installer les piquets d’ombrière (50 cm).';

  if (nameLower.includes('oignon')) {
    harvestTargetWindow = '05 – 15 Sept 2027 (Cycle 115j · ~380 kg)';
    prepChecklist =
      'Confectionner les planches de pépinière surélevées, tamiser la fumure organique et vérifier les arrosoirs.';
  } else if (nameLower.includes('bissap')) {
    harvestTargetWindow = '18 – 28 Août 2027 (Cycle 95j · ~160 kg calices)';
    prepChecklist =
      'Marquer les poquets à 40 × 40 cm et enfouir la fumure organique 5 jours avant le retrait des semences.';
  } else if (nameLower.includes('poule')) {
    harvestTargetWindow = 'Dès Août 2027 (Ponte & sujets adultes)';
    prepChecklist =
      'Désinfecter le poulailler villageois, étaler une litière sèche de copeaux et nettoyer l’emplacement de l’abreuvoir.';
  }

  const numSuffix = plan.id.replace(/[^0-9]/g, '') || `${101 + index}`;
  const pickupCode = `BON-FT-${numSuffix}`;

  return {
    plan,
    isCompleted,
    j7ReminderDate,
    deliveryDate: plan.deliveryDate,
    harvestTargetWindow,
    prepChecklist,
    pickupCode
  };
}

export const HarvestDeliveryReminderCard: React.FC<HarvestDeliveryReminderCardProps> = ({
  plans,
  onTriggerJ7Sms,
  onCompletePlanNow
}) => {
  const [filterMode, setFilterMode] = useState<'COMPLETED' | 'ALL'>('ALL');
  const [dispatchedPlanIds, setDispatchedPlanIds] = useState<Record<string, boolean>>({});

  const schedules = plans.map((p, idx) => computeScheduleForPlan(p, idx));
  const completedSchedules = schedules.filter((s) => s.isCompleted);
  const visibleSchedules =
    filterMode === 'COMPLETED' ? completedSchedules : schedules;

  const handleSendSingleJ7 = (sched: ComputedReminderSchedule) => {
    onTriggerJ7Sms(
      sched.plan,
      sched.j7ReminderDate,
      sched.harvestTargetWindow,
      sched.pickupCode
    );
    setDispatchedPlanIds((prev) => ({ ...prev, [sched.plan.id]: true }));
    setTimeout(() => {
      setDispatchedPlanIds((prev) => ({ ...prev, [sched.plan.id]: false }));
    }, 3000);
  };

  const handleDispatchAllCompleted = () => {
    completedSchedules.forEach((sched) => {
      onTriggerJ7Sms(
        sched.plan,
        sched.j7ReminderDate,
        sched.harvestTargetWindow,
        sched.pickupCode
      );
      setDispatchedPlanIds((prev) => ({ ...prev, [sched.plan.id]: true }));
    });
    setTimeout(() => {
      setDispatchedPlanIds({});
    }, 3000);
  };

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-emerald-800">
              Alerte Automatique J-7 Avant Livraison · Préparation des Semis & Récoltes
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              {completedSchedules.length} paquet{completedSchedules.length > 1 ? 's' : ''} complété{completedSchedules.length > 1 ? 's' : ''} (100%)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Rappels de Récolte & Notification SMS à J-7 de la Livraison
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            <button
              type="button"
              onClick={() => setFilterMode('ALL')}
              className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
                filterMode === 'ALL'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tous les paquets ({schedules.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('COMPLETED')}
              className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
                filterMode === 'COMPLETED'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Paquets complétés 100% ({completedSchedules.length})
            </button>
          </div>

          {completedSchedules.length > 0 && (
            <button
              type="button"
              onClick={handleDispatchAllCompleted}
              className="min-h-[38px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simuler SMS J-7 ({completedSchedules.length} complété{completedSchedules.length > 1 ? 's' : ''})</span>
            </button>
          )}
        </div>
      </div>

      {/* Rule Summary Strip — Hairline Separated */}
      <div className="border-b border-stone-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-stone-600">
        <div className="flex items-start gap-2.5 max-w-[82ch]">
          <Bell className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-stone-900">Protocole FOUT’AGRO J-7 :</strong> Pour chaque paquet intégralement cotisé (<strong>100%</strong>), un SMS automatique est envoyé <strong>7 jours exactement avant la date de livraison prévue</strong> au magasin coopératif. Il contient le code de bon de retrait, les consignes de préparation des planches et la fenêtre de récolte attendue.
          </p>
        </div>
        <span className="font-mono-tabular text-stone-500 whitespace-nowrap shrink-0">
          Destinataire : <strong className="text-stone-900">+221 77 412 89 30</strong>
        </span>
      </div>

      {/* List of Package J-7 Delivery & Harvest Reminders — Clean Hairline Rows (Zero Nested Cards) */}
      {visibleSchedules.length === 0 ? (
        <div className="py-8 text-center text-sm text-stone-500">
          Aucun paquet complété à 100% pour le moment. Soldez un paquet pour activer son rappel SMS à J-7.
        </div>
      ) : (
        <div className="divide-y divide-stone-200">
          {visibleSchedules.map((sched) => {
            const remaining = Math.max(0, sched.plan.targetFcfa - sched.plan.savedFcfa);
            const pct = Math.min(
              100,
              Math.round((sched.plan.savedFcfa / sched.plan.targetFcfa) * 100)
            );
            const wasJustDispatched = !!dispatchedPlanIds[sched.plan.id];

            return (
              <div
                key={sched.plan.id}
                className="py-5 first:pt-1 last:pb-1 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  {/* Top Metadata Line */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular">
                    {sched.isCompleted ? (
                      <span className="font-sans font-bold text-emerald-800 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Paquet 100% complété · Rappel J-7 actif</span>
                      </span>
                    ) : (
                      <span className="font-sans font-semibold text-amber-800">
                        En cours d’épargne ({pct}%) · Rappel J-7 activé dès 100%
                      </span>
                    )}
                    <span aria-hidden="true" className="text-stone-400">·</span>
                    <span className="text-stone-600">
                      Bon de retrait : <strong className="text-stone-900">{sched.pickupCode}</strong>
                    </span>
                    <span aria-hidden="true" className="text-stone-400">·</span>
                    <span className="font-sans text-stone-500">{sched.plan.deliveryHub}</span>
                  </div>

                  {/* Package Title */}
                  <h3 className="text-base font-bold text-stone-900">
                    {sched.plan.packageName}
                  </h3>

                  {/* 3-Column Timeline: J-7 SMS Date -> Delivery Date -> Harvest Target */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <p className="text-xs text-emerald-800 font-semibold">
                        01. Envoi SMS Rappel (J-7)
                      </p>
                      <p className="text-sm font-bold font-mono-tabular text-stone-900 mt-0.5">
                        {sched.j7ReminderDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">
                        02. Date de Livraison Prévue
                      </p>
                      <p className="text-sm font-bold font-mono-tabular text-stone-900 mt-0.5">
                        {sched.deliveryDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-amber-800 font-semibold">
                        03. Objectif de Récolte Estimé
                      </p>
                      <p className="text-sm font-bold font-mono-tabular text-stone-900 mt-0.5">
                        {sched.harvestTargetWindow}
                      </p>
                    </div>
                  </div>

                  {/* Pre-Delivery Field Preparation Instruction */}
                  <p className="text-xs text-stone-600 leading-relaxed pt-1">
                    <strong className="text-stone-900">Consigne préparatoire à J-7 :</strong>{' '}
                    {sched.prepChecklist}
                  </p>
                </div>

                {/* Action Column */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                  {sched.isCompleted ? (
                    <button
                      type="button"
                      onClick={() => handleSendSingleJ7(sched)}
                      className="min-h-[40px] px-4 py-2 bg-stone-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      {wasJustDispatched ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>SMS J-7 envoyé</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-amber-300" />
                          <span>Envoyer le rappel SMS J-7</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <>
                      {onCompletePlanNow && (
                        <button
                          type="button"
                          onClick={() => onCompletePlanNow(sched.plan.id)}
                          className="min-h-[40px] px-3.5 py-2 bg-[#F7F7F5] hover:bg-stone-200/70 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                        >
                          <span>Solder ({formatFcfa(remaining)})</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSendSingleJ7(sched)}
                        className="min-h-[40px] px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg text-xs font-medium transition-colors duration-150 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Tester SMS J-7</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

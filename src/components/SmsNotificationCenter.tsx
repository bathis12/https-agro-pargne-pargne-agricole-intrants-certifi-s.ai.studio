import React, { useState } from 'react';
import {
  SmsNotification,
  SubscribedPlan,
  SmsThresholdType,
  formatFcfa
} from '../data/agroData';
import { Send, CheckCheck, ArrowUpRight } from 'lucide-react';

interface SmsNotificationCenterProps {
  notifications: SmsNotification[];
  plans: SubscribedPlan[];
  onSimulateThresholdSms: (planId: string, threshold: SmsThresholdType) => void;
  onMarkAllRead: () => void;
  onSelectPlanForDeposit?: (planId: string) => void;
}

export const SmsNotificationCenter: React.FC<SmsNotificationCenterProps> = ({
  notifications,
  plans,
  onSimulateThresholdSms,
  onMarkAllRead,
  onSelectPlanForDeposit
}) => {
  const [filterThreshold, setFilterThreshold] = useState<'ALL' | '50%' | '90%' | '100%'>('ALL');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plans.find((p) => p.savedFcfa < p.targetFcfa)?.id || plans[0]?.id || 'plan-104'
  );

  const filteredSms =
    filterThreshold === 'ALL'
      ? notifications
      : notifications.filter((n) => n.threshold === filterThreshold);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-emerald-800">
              Passerelle GSM FOUT’AGRO · Rappels Automatiques 50%, 90% & J-7 Livraison
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">Destinataire : +221 77 412 89 30</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Alertes SMS de Progression (50% / 90%) & Rappels de Livraison J-7
          </h2>
        </div>

        {/* Segmented Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-lg">
            {[
              { id: 'ALL', label: `Tous (${notifications.length})` },
              { id: '50%', label: 'Seuil 50%' },
              { id: '90%', label: 'Seuil 90%' },
              { id: '100%', label: 'Rappels J-7 (100%)' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterThreshold(tab.id as 'ALL' | '50%' | '90%' | '100%')}
                className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  filterThreshold === tab.id
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="min-h-[36px] px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-[#F7F7F5] border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-800" />
              <span>Tout marquer comme lu</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive SMS Trigger & Threshold Rules Bar — Clean Hairline Separation */}
      <div className="border-b border-stone-200 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5 space-y-1">
          <p className="text-xs font-bold text-stone-900">
            Règle d’envoi automatique FOUT’AGRO
          </p>
          <p className="text-xs text-stone-600 leading-relaxed">
            Envoi d’un SMS automatique aux seuils d’épargne de <strong>50%</strong> et <strong>90%</strong>, puis d’un <strong>rappel de récolte et préparation des planches 7 jours (J-7) avant la date de livraison</strong> de chaque paquet complété à <strong>100%</strong>.
          </p>
        </div>

        <div className="lg:col-span-7 flex flex-wrap sm:flex-nowrap items-center gap-2 justify-end">
          <select
            aria-label="Choisir un paquet pour tester l'envoi d'un SMS"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="w-full sm:w-auto flex-1 min-h-[40px] px-3 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-xs font-medium text-stone-900 truncate"
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.packageName} ({Math.round((p.savedFcfa / p.targetFcfa) * 100)}%)
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onSimulateThresholdSms(selectedPlanId, '50%')}
            className="min-h-[40px] px-3 py-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-amber-600" />
            <span>SMS 50%</span>
          </button>

          <button
            type="button"
            onClick={() => onSimulateThresholdSms(selectedPlanId, '90%')}
            className="min-h-[40px] px-3 py-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-emerald-700" />
            <span>SMS 90%</span>
          </button>

          <button
            type="button"
            onClick={() => onSimulateThresholdSms(selectedPlanId, '100%')}
            className="min-h-[40px] px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>SMS J-7 (100%)</span>
          </button>
        </div>
      </div>

      {/* SMS Inbox List — Hairline Divided Rows */}
      {filteredSms.length === 0 ? (
        <div className="py-8 text-center text-sm text-stone-500">
          Aucune alerte SMS enregistrée pour ce filtre. Utilisez les boutons ci-dessus ou effectuez un versement pour déclencher un rappel.
        </div>
      ) : (
        <div className="divide-y divide-stone-200">
          {filteredSms.map((sms) => (
            <div
              key={sms.id}
              className={`py-5 first:pt-1 last:pb-1 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                sms.isUnread ? 'bg-amber-50/30 -mx-4 px-4 rounded-lg' : ''
              }`}
            >
              <div className="space-y-2 max-w-[78ch]">
                {/* Unboxed metadata line */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-mono-tabular">
                  <span
                    className={`font-sans font-bold ${
                      sms.threshold === '100%'
                        ? 'text-emerald-900'
                        : sms.threshold === '90%'
                        ? 'text-emerald-800'
                        : 'text-amber-700'
                    }`}
                  >
                    {sms.threshold === '100%'
                      ? 'Rappel Récolte & Livraison J-7 (Paquet 100%)'
                      : `Rappel Seuil ${sms.threshold} atteint (${sms.progressPct}%)`}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{sms.timestamp}</span>
                  <span aria-hidden="true">·</span>
                  <span>Vers : {sms.recipientPhone}</span>
                  {sms.isUnread && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-sans font-semibold text-stone-900">
                        Nouveau SMS
                      </span>
                    </>
                  )}
                </div>

                {/* Actual GSM SMS Body */}
                <p className="text-sm text-stone-900 font-mono-tabular leading-relaxed">
                  {sms.messageBody}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-mono-tabular">
                  <span>Paquet : {sms.planName}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Épargné : {formatFcfa(sms.savedFcfa)} / {formatFcfa(sms.targetFcfa)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-stone-800">
                    Reste à cotiser : {formatFcfa(sms.remainingFcfa)}
                  </span>
                </div>
              </div>

              {onSelectPlanForDeposit && sms.remainingFcfa > 0 && (
                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectPlanForDeposit(sms.planId)}
                    className="min-h-[40px] px-4 py-2 bg-stone-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <span>Compléter ({formatFcfa(sms.remainingFcfa)})</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

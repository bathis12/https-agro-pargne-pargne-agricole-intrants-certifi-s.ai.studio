import React, { useState } from 'react';
import {
  SubscribedPlan,
  ScratchVoucher,
  DepositTransaction,
  PaymentChannel,
  formatFcfa
} from '../data/agroData';
import { CheckCircle2, Download, Plus, Banknote } from 'lucide-react';

interface DepositStudioProps {
  plans: SubscribedPlan[];
  vouchers: ScratchVoucher[];
  transactions: DepositTransaction[];
  initialSelectedPlanId?: string;
  onScratchVoucher: (code: string) => void;
  onCreateDemoVoucher: (amountFcfa: number) => void;
  onRedeemVoucher: (code: string, planId: string) => { success: boolean; message: string };
  onMobileDeposit: (
    amount: number,
    channel: PaymentChannel,
    phone: string,
    planId: string
  ) => { success: boolean; message: string };
}

const VILLAGE_CASH_AGENTS = [
  'Point Relais Hamady Ounaré — Amadou Ba',
  'Coopérative Sinthiane Dioudé — Aïssata Tall',
  'Magasin Central Matam & Ogo — Mamadou Sylla',
  'Point Relais Orkadiéré & Kanel — Ousmane Dia',
  'Magasin Coopératif Bakel — Fatoumata Konté'
];

export const DepositStudio: React.FC<DepositStudioProps> = ({
  plans,
  vouchers,
  transactions,
  initialSelectedPlanId,
  onCreateDemoVoucher,
  onRedeemVoucher,
  onMobileDeposit
}) => {
  const [activeMode, setActiveMode] = useState<'especes' | 'mobile'>('especes');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    initialSelectedPlanId || plans[0]?.id || 'plan-101'
  );

  // Paiement Espèces state
  const [cashAmount, setCashAmount] = useState<number>(1000);
  const [cashAgentRelay, setCashAgentRelay] = useState<string>(VILLAGE_CASH_AGENTS[0]);
  const [cashReceiptInput, setCashReceiptInput] = useState('');

  // Mobile Money state
  const [mobileChannel, setMobileChannel] = useState<PaymentChannel>('Wave Mobile Money');
  const [mobilePhone, setMobilePhone] = useState('+221 77 412 89 30');
  const [mobileAmount, setMobileAmount] = useState<number>(1000);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [channelFilter, setChannelFilter] = useState<string>('ALL');

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  // Direct Cash Deposit or Cash Receipt Validation
  const handleCashSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    // If a pre-issued receipt code is entered, validate that receipt
    if (cashReceiptInput.trim().length > 0) {
      const result = onRedeemVoucher(cashReceiptInput.trim(), selectedPlan.id);
      setFeedback({
        type: result.success ? 'success' : 'error',
        text: result.message
      });
      if (result.success) {
        setCashReceiptInput('');
      }
      return;
    }

    // Otherwise record a direct Paiement Espèces for the selected amount and village relay
    const receiptRef = `ESP-${Math.floor(1000 + Math.random() * 9000)} (${cashAgentRelay.split('—')[0].trim()})`;
    const result = onMobileDeposit(
      cashAmount,
      'Paiement Espèces',
      receiptRef,
      selectedPlan.id
    );
    setFeedback({
      type: result.success ? 'success' : 'error',
      text: result.message
    });
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    const result = onMobileDeposit(
      mobileAmount,
      mobileChannel,
      mobilePhone,
      selectedPlan.id
    );
    setFeedback({
      type: result.success ? 'success' : 'error',
      text: result.message
    });
  };

  const handleExportCsv = () => {
    const headers = ['Reference', 'Date', 'Montant_FCFA', 'Canal', 'Paquet_FOUTAGRO', 'Detail'];
    const rows = transactions.map((tx) => [
      tx.reference,
      tx.date,
      tx.amountFcfa.toString(),
      tx.channel,
      `"${tx.planName}"`,
      tx.voucherCode || tx.phoneNumber || ''
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'releve_epargne_foutagro_2027.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions =
    channelFilter === 'ALL'
      ? transactions
      : transactions.filter((t) => t.channel === channelFilter);

  return (
    <div className="space-y-12">
      {/* Top Split: Payment Form Left + Cash Receipts Book Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Deposit Form */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <p className="text-xs font-medium text-emerald-800 mb-1">
                FOUT’AGRO · Épargne Progressive (Paiement Espèces & Mobile Money)
              </p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                Créditer un Paquet FOUT’AGRO
              </h2>
            </div>

            {/* Segmented Mode Control: Paiement Espèces vs Mobile Money */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('especes');
                  setFeedback(null);
                }}
                className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  activeMode === 'especes'
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Paiement Espèces
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode('mobile');
                  setFeedback(null);
                }}
                className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  activeMode === 'mobile'
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Mobile Money
              </button>
            </div>
          </div>

          {/* Target Package Selector */}
          <div className="space-y-2">
            <label
              htmlFor="target-plan-select"
              className="block text-xs font-semibold text-stone-700"
            >
              01. Sélectionner le paquet FOUT’AGRO bénéficiaire
            </label>
            <select
              id="target-plan-select"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full min-h-[42px] px-3.5 py-2.5 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              {plans.map((plan) => {
                const remaining = Math.max(0, plan.targetFcfa - plan.savedFcfa);
                return (
                  <option key={plan.id} value={plan.id}>
                    {plan.packageName} — Épargné : {formatFcfa(plan.savedFcfa)} / {formatFcfa(plan.targetFcfa)} (Reste : {formatFcfa(remaining)})
                  </option>
                );
              })}
            </select>
            {selectedPlan && (
              <div className="pt-1 flex items-center justify-between text-xs text-stone-500 font-mono-tabular">
                <span>
                  Progression actuelle : {Math.min(100, Math.round((selectedPlan.savedFcfa / selectedPlan.targetFcfa) * 100))}%
                </span>
                <span>
                  Reste à cotiser : {formatFcfa(Math.max(0, selectedPlan.targetFcfa - selectedPlan.savedFcfa))}
                </span>
              </div>
            )}
          </div>

          {/* Mode A: Paiement Espèces (Cash Deposit at Village Point Relais) */}
          {activeMode === 'especes' ? (
            <form onSubmit={handleCashSubmit} className="space-y-5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="cash-agent-select"
                    className="block text-xs font-semibold text-stone-700"
                  >
                    02. Point Relais / Agent collecteur d’espèces
                  </label>
                  <select
                    id="cash-agent-select"
                    value={cashAgentRelay}
                    onChange={(e) => setCashAgentRelay(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  >
                    {VILLAGE_CASH_AGENTS.map((ag) => (
                      <option key={ag} value={ag}>
                        {ag}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="cash-amount-input"
                    className="block text-xs font-semibold text-stone-700"
                  >
                    03. Montant versé en espèces (FCFA)
                  </label>
                  <input
                    id="cash-amount-input"
                    type="number"
                    min={250}
                    step={250}
                    value={cashAmount}
                    onChange={(e) => setCashAmount(Number(e.target.value))}
                    className="w-full min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg font-mono-tabular text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    required
                  />
                </div>
              </div>

              {/* Quick Cash Denominations */}
              <div className="space-y-1.5">
                <span className="block text-xs text-stone-500">
                  Billets / montants rapides en espèces :
                </span>
                <div className="flex flex-wrap gap-2">
                  {[500, 1000, 2000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setCashAmount(amt);
                        setCashReceiptInput('');
                      }}
                      className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-mono-tabular font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                        cashAmount === amt && !cashReceiptInput
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {formatFcfa(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Pre-Issued Cash Receipt Number */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100">
                <label
                  htmlFor="cash-receipt-input"
                  className="block text-xs font-semibold text-stone-700"
                >
                  Ou saisir un numéro de reçu espèces déjà délivré au village (optionnel) :
                </label>
                <input
                  id="cash-receipt-input"
                  type="text"
                  value={cashReceiptInput}
                  onChange={(e) => setCashReceiptInput(e.target.value)}
                  placeholder="Ex: ESP-4920-8173 (ou laissez vide pour un versement espèces direct)"
                  className="w-full min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg font-mono-tabular text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-3 px-5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Banknote className="w-4 h-4 text-emerald-200" />
                <span>
                  {cashReceiptInput.trim()
                    ? `Valider le reçu espèces ${cashReceiptInput}`
                    : `Enregistrer le paiement espèces de ${formatFcfa(cashAmount)}`}
                </span>
              </button>
            </form>
          ) : (
            /* Mode B: Mobile Money Form */
            <form onSubmit={handleMobileSubmit} className="space-y-5 pt-2">
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-stone-700">
                  02. Choisir l’opérateur Mobile Money
                </span>
                <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-lg">
                  {(
                    [
                      'Wave Mobile Money',
                      'Orange Money',
                      'Free Money'
                    ] as PaymentChannel[]
                  ).map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setMobileChannel(op)}
                      className={`min-h-[38px] py-2 px-3 rounded-md text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 truncate ${
                        mobileChannel === op
                          ? 'bg-white text-stone-900 shadow-sm'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="momo-phone"
                    className="block text-xs font-semibold text-stone-700"
                  >
                    Numéro de téléphone débité
                  </label>
                  <input
                    id="momo-phone"
                    type="tel"
                    value={mobilePhone}
                    onChange={(e) => setMobilePhone(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2.5 bg-[#F7F7F5] border border-stone-300 rounded-lg font-mono-tabular text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="momo-amount"
                    className="block text-xs font-semibold text-stone-700"
                  >
                    Montant du versement (FCFA)
                  </label>
                  <input
                    id="momo-amount"
                    type="number"
                    min={250}
                    step={250}
                    value={mobileAmount}
                    onChange={(e) => setMobileAmount(Number(e.target.value))}
                    className="w-full min-h-[42px] px-3.5 py-2.5 bg-[#F7F7F5] border border-stone-300 rounded-lg font-mono-tabular text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    required
                  />
                </div>
              </div>

              {/* Quick Denominations */}
              <div className="space-y-1.5">
                <span className="block text-xs text-stone-500">
                  Montants adaptés aux paquets FOUT’AGRO :
                </span>
                <div className="flex flex-wrap gap-2">
                  {[500, 1000, 2000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setMobileAmount(amt)}
                      className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-mono-tabular font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                        mobileAmount === amt
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {formatFcfa(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-3 px-5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                Confirmer le versement de {formatFcfa(mobileAmount)}
              </button>
            </form>
          )}

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-4 rounded-lg border text-sm flex items-start gap-3 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-700" />
              <div className="space-y-1">
                <p className="font-semibold">
                  {feedback.type === 'success'
                    ? 'Paiement FOUT’AGRO enregistré et confirmé par SMS'
                    : 'Impossible de valider la transaction'}
                </p>
                <p className="text-xs leading-relaxed">{feedback.text}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Cash Payment Receipts Book (Reçus de Paiement Espèces) — Hairline List */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-5">
          <div className="border-b border-stone-200 pb-4">
            <h3 className="text-base font-bold text-stone-900">
              Reçus de Paiement Espèces (Points Relais)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Quittances délivrées contre espèces par les agents villageois FOUT’AGRO
            </p>
          </div>

          {/* Issue New Cash Receipt Bar */}
          <div className="border-b border-stone-200 pb-4 space-y-2.5">
            <p className="text-xs font-medium text-stone-700">
              Émettre un nouveau reçu de paiement espèces :
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[500, 1000, 2000, 2500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onCreateDemoVoucher(val)}
                  className="min-h-[38px] py-1.5 px-2.5 bg-[#F7F7F5] hover:bg-stone-200/80 border border-stone-300 rounded-lg text-xs font-mono-tabular font-semibold text-stone-800 flex items-center justify-center gap-1 transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-800" />
                  <span>{val} F</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cash Receipts List — Divided by Hairlines */}
          <div className="divide-y divide-stone-200 max-h-[420px] overflow-y-auto pr-1">
            {vouchers.map((voucher) => (
              <div
                key={voucher.code}
                className={`py-4 first:pt-1 last:pb-1 transition-opacity ${
                  voucher.isRedeemed ? 'opacity-55' : ''
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                  <span>{voucher.pointOfSale}</span>
                  <span className="font-mono-tabular">{voucher.batchId}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold font-mono-tabular text-stone-900">
                      {formatFcfa(voucher.amountFcfa)}
                    </p>
                    <p className="text-xs text-stone-500">
                      {voucher.isRedeemed
                        ? 'État : Reçu espèces déjà crédité'
                        : 'Quittance espèces prête à créditer'}
                    </p>
                  </div>

                  {voucher.isRedeemed ? (
                    <span className="text-xs font-mono-tabular text-stone-500">
                      Crédité ({voucher.code})
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tabular text-xs font-bold text-stone-900">
                        {voucher.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode('especes');
                          setCashReceiptInput(voucher.code);
                        }}
                        className="min-h-[38px] px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
                      >
                        Utiliser ce reçu
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Section: Transaction History Table */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <p className="text-xs font-medium text-emerald-800 mb-1">
              Journal Comptable & Reçus Producteur
            </p>
            <h3 className="text-xl font-bold text-stone-900">
              Historique des Versements FOUT’AGRO
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
              {['ALL', 'Paiement Espèces', 'Wave Mobile Money', 'Orange Money'].map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setChannelFilter(ch)}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    channelFilter === ch
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {ch === 'ALL' ? 'Tous les canaux' : ch}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExportCsv}
              className="min-h-[38px] px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-xs font-semibold text-stone-500">
                <th className="py-3 pr-4">Référence</th>
                <th className="py-3 px-4">Date & Heure</th>
                <th className="py-3 px-4">Canal de paiement</th>
                <th className="py-3 px-4">Reçu Espèces / Téléphone</th>
                <th className="py-3 px-4">Paquet crédité</th>
                <th className="py-3 pl-4 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 pr-4 font-mono-tabular font-medium text-stone-900 whitespace-nowrap">
                    {tx.reference}
                  </td>
                  <td className="py-3.5 px-4 font-mono-tabular text-xs text-stone-600 whitespace-nowrap">
                    {tx.date}
                  </td>
                  <td className="py-3.5 px-4 text-stone-800 whitespace-nowrap">
                    {tx.channel}
                  </td>
                  <td className="py-3.5 px-4 font-mono-tabular text-xs text-stone-600 whitespace-nowrap">
                    {tx.voucherCode || tx.phoneNumber}
                  </td>
                  <td className="py-3.5 px-4 text-stone-700 max-w-[260px] truncate">
                    {tx.planName}
                  </td>
                  <td className="py-3.5 pl-4 text-right font-mono-tabular font-semibold text-emerald-800 whitespace-nowrap">
                    +{formatFcfa(tx.amountFcfa)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

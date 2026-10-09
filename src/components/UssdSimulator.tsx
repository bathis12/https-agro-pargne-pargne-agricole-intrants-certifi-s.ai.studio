import React, { useState } from 'react';
import {
  SubscribedPlan,
  ScratchVoucher,
  formatFcfa,
  PaymentChannel
} from '../data/agroData';
import { RotateCcw, CornerDownLeft } from 'lucide-react';

interface UssdSimulatorProps {
  plans: SubscribedPlan[];
  vouchers: ScratchVoucher[];
  onRedeemVoucher: (code: string, planId: string) => { success: boolean; message: string };
  onMobileDeposit: (
    amount: number,
    channel: PaymentChannel,
    phone: string,
    planId: string
  ) => { success: boolean; message: string };
}

type UssdStep =
  | 'HOME'
  | 'SOLDE'
  | 'CARTE_SELECT_PLAN'
  | 'CARTE_ENTER_CODE'
  | 'MOMO_SELECT_PLAN'
  | 'MOMO_ENTER_AMOUNT'
  | 'LIVRAISON'
  | 'CONSEIL'
  | 'RESULT';

export const UssdSimulator: React.FC<UssdSimulatorProps> = ({
  plans,
  vouchers,
  onRedeemVoucher,
  onMobileDeposit
}) => {
  const [step, setStep] = useState<UssdStep>('HOME');
  const [inputVal, setInputVal] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || 'plan-101');
  const [resultMessage, setResultMessage] = useState('');

  const totalSaved = plans.reduce((acc, p) => acc + p.savedFcfa, 0);
  const totalTarget = plans.reduce((acc, p) => acc + p.targetFcfa, 0);
  const availableVouchers = vouchers.filter((v) => !v.isRedeemed);

  const handleReset = () => {
    setStep('HOME');
    setInputVal('');
    setResultMessage('');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    setInputVal('');

    if (trimmed === '0' || trimmed === '00') {
      handleReset();
      return;
    }

    if (step === 'HOME') {
      switch (trimmed) {
        case '1':
          setStep('SOLDE');
          break;
        case '2':
          setStep('CARTE_SELECT_PLAN');
          break;
        case '3':
          setStep('MOMO_SELECT_PLAN');
          break;
        case '4':
          setStep('LIVRAISON');
          break;
        case '5':
          setStep('CONSEIL');
          break;
        default:
          setResultMessage('Option invalide. Tapez un chiffre entre 1 et 5.');
          setStep('RESULT');
      }
      return;
    }

    if (step === 'CARTE_SELECT_PLAN') {
      const idx = parseInt(trimmed, 10) - 1;
      if (idx >= 0 && idx < plans.length) {
        setSelectedPlanId(plans[idx].id);
        setStep('CARTE_ENTER_CODE');
      } else {
        setResultMessage('Numéro de paquet invalide.');
        setStep('RESULT');
      }
      return;
    }

    if (step === 'CARTE_ENTER_CODE') {
      const res = onRedeemVoucher(trimmed, selectedPlanId);
      setResultMessage(res.message);
      setStep('RESULT');
      return;
    }

    if (step === 'MOMO_SELECT_PLAN') {
      const idx = parseInt(trimmed, 10) - 1;
      if (idx >= 0 && idx < plans.length) {
        setSelectedPlanId(plans[idx].id);
        setStep('MOMO_ENTER_AMOUNT');
      } else {
        setResultMessage('Numéro de paquet invalide.');
        setStep('RESULT');
      }
      return;
    }

    if (step === 'MOMO_ENTER_AMOUNT') {
      const amount = parseInt(trimmed, 10);
      if (isNaN(amount) || amount < 250) {
        setResultMessage('Montant minimum : 250 FCFA.');
        setStep('RESULT');
        return;
      }
      const res = onMobileDeposit(
        amount,
        'Wave Mobile Money',
        '+221 77 412 89 30',
        selectedPlanId
      );
      setResultMessage(res.message);
      setStep('RESULT');
      return;
    }

    handleReset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left column: Explanation & Quick-Fill Codes */}
      <div className="lg:col-span-7 space-y-6">
        <div className="border-b border-stone-200 pb-5">
          <p className="text-xs font-medium text-emerald-800 mb-2">
            FOUT’AGRO Sans Internet · Protocole GSM *456# (Matam · Hamady Ounaré · Kanel · Bakel)
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">
            Terminal USSD & SMS FOUT’AGRO pour les 36 Villages
          </h2>
          <p className="mt-2 text-sm text-stone-600 leading-relaxed max-w-[68ch]">
            Dans les 36 villages couverts (de Ganguel Soulé, Sinthiane Dioudé et Orkadiéré jusqu’à Waoundé, Semmé, Ogo et Balel), chaque producteur peut épargner pour ses paquets <strong>Laitue (5 000 F / 2 000 F)</strong>, <strong>Bissap Blanc (5 000 F / 2 000 F)</strong>, <strong>Oignons (6 000 F / 2 500 F)</strong> et <strong>Poules (8 000 F)</strong> depuis un téléphone simple en composant le <span className="font-mono-tabular font-semibold text-stone-900">*456#</span>.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Reçus de Paiement Espèces FOUT’AGRO Disponibles
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Cliquez sur un numéro de reçu espèces ci-dessous pour le valider dans le téléphone USSD *456#
              </p>
            </div>
            <span className="text-xs text-stone-500 font-mono-tabular">
              {availableVouchers.length} reçus actifs
            </span>
          </div>

          {availableVouchers.length === 0 ? (
            <p className="text-sm text-stone-500 py-2">
              Tous les reçus espèces de démonstration ont été crédités. Émettez-en de nouveaux dans l’onglet Versements.
            </p>
          ) : (
            <div className="divide-y divide-stone-100">
              {availableVouchers.map((v) => (
                <div
                  key={v.code}
                  className="py-3 flex flex-wrap items-center justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-mono-tabular font-semibold text-stone-900">
                      {v.code}
                    </p>
                    <p className="text-xs text-stone-500">
                      {v.pointOfSale} · {v.batchId}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono-tabular font-semibold text-emerald-800">
                      {formatFcfa(v.amountFcfa)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('CARTE_ENTER_CODE');
                        setInputVal(v.code);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      Pré-remplir dans *456#
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-stone-100/80 border border-stone-200 rounded-xl p-5 space-y-3">
          <h4 className="text-sm font-semibold text-stone-900">
            01. Points relais dans les zones de Matam, Hamady Ounaré, Kanel & Bakel
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Laitue : 5 000 F et 2 000 F · Bissap Blanc : 5 000 F et 2 000 F · Oignons : 6 000 F et 2 500 F · Poules : 8 000 F. Dès que le cumul des versements atteint 50% ou 90%, un SMS de rappel est envoyé. À 100%, le bon de retrait est disponible au magasin relais de votre zone.
          </p>
        </div>
      </div>

      {/* Right column: Realistic Feature Phone USSD Screen */}
      <div className="lg:col-span-5 flex justify-center">
        <div className="w-full max-w-[380px] bg-stone-900 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-sm">
          {/* Phone Earpiece & Header */}
          <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-3 mb-4 font-mono-tabular">
            <span>ORANGE SN · MATAM/BAKEL</span>
            <span>*456# ACTIF</span>
            <span>100%</span>
          </div>

          {/* LCD Screen */}
          <div className="bg-[#D8E2DC] text-stone-900 rounded-xl p-4 font-mono-tabular text-xs leading-relaxed min-h-[260px] flex flex-col justify-between border-2 border-stone-700">
            <div className="space-y-2">
              <div className="border-b border-stone-400/60 pb-1.5 mb-2 flex items-center justify-between font-semibold text-[11px] text-stone-700">
                <span>FOUT’AGRO *456#</span>
                <span>ID: FT-48291</span>
              </div>

              {step === 'HOME' && (
                <div className="space-y-1">
                  <p className="font-semibold text-stone-900 mb-1.5">
                    Bienvenue Aïssata Tall (Sinthiane Dioudé)
                  </p>
                  <p>1. Solde & Mes Paquets</p>
                  <p>2. Valider Reçu Paiement Espèces</p>
                  <p>3. Versement Mobile Money</p>
                  <p>4. Date Livraison Paquets</p>
                  <p>5. Conseil Maraîchage & Poules</p>
                </div>
              )}

              {step === 'SOLDE' && (
                <div className="space-y-1.5">
                  <p className="font-semibold">SOLDE GLOBAL : {formatFcfa(totalSaved)}</p>
                  <p className="text-[11px] text-stone-700">
                    Objectif : {formatFcfa(totalTarget)} ({Math.round((totalSaved / totalTarget) * 100)}%)
                  </p>
                  <div className="pt-1 space-y-1 border-t border-stone-400/50">
                    {plans.map((p, i) => (
                      <p key={p.id} className="truncate">
                        {i + 1}. {p.packageName.slice(0, 22)} : {formatFcfa(p.savedFcfa)}/{formatFcfa(p.targetFcfa)}
                      </p>
                    ))}
                  </div>
                  <p className="pt-2 text-stone-700">0. Menu principal</p>
                </div>
              )}

              {step === 'CARTE_SELECT_PLAN' && (
                <div className="space-y-1.5">
                  <p className="font-semibold">Choisir le paquet FOUT’AGRO :</p>
                  {plans.map((p, i) => (
                    <p key={p.id}>
                      {i + 1}. {p.packageName.slice(0, 25)} ({Math.round((p.savedFcfa / p.targetFcfa) * 100)}%)
                    </p>
                  ))}
                  <p className="pt-2 text-stone-700">0. Retour</p>
                </div>
              )}

              {step === 'CARTE_ENTER_CODE' && (
                <div className="space-y-2">
                  <p className="font-semibold">PAIEMENT ESPÈCES FOUT’AGRO</p>
                  <p>
                    Entrez le numéro de votre reçu espèces délivré par l’agent :
                  </p>
                  <p className="text-[11px] text-stone-700">
                    Ex: ESP-4920-8173
                  </p>
                  <p className="pt-2 text-stone-700">0. Annuler</p>
                </div>
              )}

              {step === 'MOMO_SELECT_PLAN' && (
                <div className="space-y-1.5">
                  <p className="font-semibold">MOBILE MONEY — Choisir Paquet :</p>
                  {plans.map((p, i) => (
                    <p key={p.id}>
                      {i + 1}. {p.packageName.slice(0, 25)}
                    </p>
                  ))}
                  <p className="pt-2 text-stone-700">0. Retour</p>
                </div>
              )}

              {step === 'MOMO_ENTER_AMOUNT' && (
                <div className="space-y-2">
                  <p className="font-semibold">MONTANT WAVE / ORANGE MONEY</p>
                  <p>Saisissez le montant en FCFA (min. 250 FCFA) :</p>
                  <p className="text-[11px] text-stone-700">
                    Compte : +221 77 412 89 30
                  </p>
                  <p className="pt-2 text-stone-700">0. Annuler</p>
                </div>
              )}

              {step === 'LIVRAISON' && (
                <div className="space-y-1.5">
                  <p className="font-semibold">LIVRAISON FOUT’AGRO</p>
                  <p>Point relais : Magasin Hamady Ounaré & Matam</p>
                  <p>Date prévue : 10 – 20 Mai 2027</p>
                  <p>
                    Paquets 100% payés : {plans.filter((p) => p.savedFcfa >= p.targetFcfa).length} / {plans.length}
                  </p>
                  <p className="pt-2 text-stone-700">0. Menu principal</p>
                </div>
              )}

              {step === 'CONSEIL' && (
                <div className="space-y-1.5">
                  <p className="font-semibold">CONSEIL FOUT’AGRO #14</p>
                  <p>
                    Oignons & Laitue : Repiquez en fin d’après-midi sans enterrer le collet. Pour le Bissap Blanc, pincez la tige à 35 jours pour doubler les calices.
                  </p>
                  <p className="pt-2 text-stone-700">0. Menu principal</p>
                </div>
              )}

              {step === 'RESULT' && (
                <div className="space-y-2">
                  <p className="font-semibold">MESSAGE RÉSEAU FOUT’AGRO</p>
                  <p>{resultMessage}</p>
                  <p className="pt-2 text-stone-700">0. Menu principal</p>
                </div>
              )}
            </div>

            {/* USSD Input Line */}
            <form onSubmit={handleSend} className="mt-4 pt-2 border-t border-stone-400">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Réponse USSD..."
                  className="w-full bg-white/90 text-stone-900 px-2.5 py-1.5 rounded border border-stone-400 text-xs font-mono-tabular focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded text-xs font-medium hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
                >
                  <span>Envoyer</span>
                  <CornerDownLeft className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>

          {/* Numeric Quick Keypad */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '0'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => setInputVal((prev) => prev + digit)}
                className="py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg font-mono-tabular text-sm font-medium transition-colors"
              >
                {digit}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser session *456#</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

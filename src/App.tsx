/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AGRI_PACKAGES,
  INITIAL_SUBSCRIBED_PLANS,
  INITIAL_TRANSACTIONS,
  INITIAL_SCRATCH_VOUCHERS,
  INITIAL_VILLAGE_COHORT,
  INITIAL_TRAINING_MODULES,
  INITIAL_SMS_NOTIFICATIONS,
  INITIAL_REFERRALS,
  FOUTA_ZONES,
  FOUTA_VILLAGES,
  HERO_IMAGE_URL,
  AgriPackage,
  SubscribedPlan,
  DepositTransaction,
  ScratchVoucher,
  VillageFarmerRecord,
  TrainingSession,
  SmsNotification,
  SmsThresholdType,
  PaymentChannel,
  InterventionZone,
  ReferralRecord,
  createThresholdSmsNotification,
  formatFcfa
} from './data/agroData';
import { ResilientImage } from './components/ResilientImage';
import { DepositStudio } from './components/DepositStudio';
import { PackageCatalog } from './components/PackageCatalog';
import { UssdSimulator } from './components/UssdSimulator';
import { VillageNetwork } from './components/VillageNetwork';
import { SavingsProgressionChart } from './components/SavingsProgressionChart';
import { SmsNotificationCenter } from './components/SmsNotificationCenter';
import { YieldEstimatorDashboard } from './components/YieldEstimatorDashboard';
import { AgronomicFaqSection } from './components/AgronomicFaqSection';
import { AgroWeatherCard } from './components/AgroWeatherCard';
import { SowingCalendarDashboard } from './components/SowingCalendarDashboard';
import { HarvestDeliveryReminderCard } from './components/HarvestDeliveryReminderCard';
import { ReferralRewardsDashboardCard } from './components/ReferralRewardsDashboardCard';
import { WhatsAppFieldAgentModal } from './components/WhatsAppFieldAgentModal';
import { generateProducerHistoryPdf } from './utils/exportProducerPdf';
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
  MessageCircle,
  FileDown,
  X
} from 'lucide-react';

type ActiveTab = 'dashboard' | 'catalog' | 'deposit' | 'ussd' | 'village';

const STORAGE_KEYS = {
  PLANS: 'foutagro_plans_v7',
  TXS: 'foutagro_txs_v7',
  VOUCHERS: 'foutagro_vouchers_v7',
  COHORT: 'foutagro_cohort_v7',
  TRAININGS: 'foutagro_trainings_v7',
  SMS: 'foutagro_sms_v7',
  REFERRALS: 'foutagro_referrals_v7'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [preselectedPlanId, setPreselectedPlanId] = useState<string>('plan-104');
  const [liveSmsToast, setLiveSmsToast] = useState<SmsNotification | null>(null);
  const [exportedPdfName, setExportedPdfName] = useState<string | null>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);

  const [plans, setPlans] = useState<SubscribedPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIBED_PLANS;
    } catch {
      return INITIAL_SUBSCRIBED_PLANS;
    }
  });

  const [transactions, setTransactions] = useState<DepositTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TXS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [vouchers, setVouchers] = useState<ScratchVoucher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VOUCHERS);
      return saved ? JSON.parse(saved) : INITIAL_SCRATCH_VOUCHERS;
    } catch {
      return INITIAL_SCRATCH_VOUCHERS;
    }
  });

  const [cohort, setCohort] = useState<VillageFarmerRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COHORT);
      return saved ? JSON.parse(saved) : INITIAL_VILLAGE_COHORT;
    } catch {
      return INITIAL_VILLAGE_COHORT;
    }
  });

  const [trainings, setTrainings] = useState<TrainingSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRAININGS);
      return saved ? JSON.parse(saved) : INITIAL_TRAINING_MODULES;
    } catch {
      return INITIAL_TRAINING_MODULES;
    }
  });

  const [smsNotifications, setSmsNotifications] = useState<SmsNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SMS);
      return saved ? JSON.parse(saved) : INITIAL_SMS_NOTIFICATIONS;
    } catch {
      return INITIAL_SMS_NOTIFICATIONS;
    }
  });

  const [referrals, setReferrals] = useState<ReferralRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REFERRALS);
      return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
    } catch {
      return INITIAL_REFERRALS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
      localStorage.setItem(STORAGE_KEYS.TXS, JSON.stringify(transactions));
      localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(vouchers));
      localStorage.setItem(STORAGE_KEYS.COHORT, JSON.stringify(cohort));
      localStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(trainings));
      localStorage.setItem(STORAGE_KEYS.SMS, JSON.stringify(smsNotifications));
      localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
    } catch {
      // Ignore storage quota errors
    }
  }, [plans, transactions, vouchers, cohort, trainings, smsNotifications, referrals]);

  const totalSavedFcfa = plans.reduce((sum, p) => sum + p.savedFcfa, 0);
  const totalTargetFcfa = plans.reduce((sum, p) => sum + p.targetFcfa, 0);
  const overallProgressPct =
    totalTargetFcfa > 0
      ? Math.min(100, Math.round((totalSavedFcfa / totalTargetFcfa) * 100))
      : 0;
  const completedPlansCount = plans.filter((p) => p.savedFcfa >= p.targetFcfa).length;

  // Helper to evaluate and dispatch 50% or 90% SMS threshold alerts
  const checkAndEmitThresholdSms = (
    recipientName: string,
    recipientPhone: string,
    planId: string,
    planName: string,
    prevSaved: number,
    nextSaved: number,
    targetFcfa: number
  ): SmsNotification | null => {
    if (targetFcfa <= 0) return null;
    const prevPct = (prevSaved / targetFcfa) * 100;
    const nextPct = (nextSaved / targetFcfa) * 100;

    let triggeredThreshold: SmsThresholdType | null = null;
    if (prevPct < 100 && nextPct >= 100) {
      triggeredThreshold = '100%';
    } else if (prevPct < 90 && nextPct >= 90 && nextPct < 100) {
      triggeredThreshold = '90%';
    } else if (prevPct < 50 && nextPct >= 50) {
      triggeredThreshold = '50%';
    }

    if (!triggeredThreshold) return null;

    const sms = createThresholdSmsNotification({
      recipientName,
      recipientPhone,
      planId,
      planName,
      threshold: triggeredThreshold,
      savedFcfa: Math.min(targetFcfa, nextSaved),
      targetFcfa
    });

    setSmsNotifications((prev) => [sms, ...prev]);
    setLiveSmsToast(sms);
    return sms;
  };

  // Manual 1-click simulation of 50%, 90%, or 100% (J-7) SMS alert
  const handleSimulateThresholdSms = (
    planId: string,
    threshold: SmsThresholdType
  ) => {
    const targetPlan = plans.find((p) => p.id === planId) || plans[0];
    if (!targetPlan) return;

    const simulatedSaved =
      threshold === '50%'
        ? Math.round(targetPlan.targetFcfa * 0.5)
        : threshold === '90%'
        ? Math.round(targetPlan.targetFcfa * 0.9)
        : targetPlan.targetFcfa;

    const sms = createThresholdSmsNotification({
      recipientName: 'Aïssata Tall',
      recipientPhone: '+221 77 412 89 30',
      planId: targetPlan.id,
      planName: targetPlan.packageName,
      threshold,
      savedFcfa: simulatedSaved,
      targetFcfa: targetPlan.targetFcfa
    });

    setSmsNotifications((prev) => [sms, ...prev]);
    setLiveSmsToast(sms);
  };

  // Trigger specific J-7 Pre-Delivery & Harvest Preparation SMS for a package
  const handleTriggerJ7Sms = (
    plan: SubscribedPlan,
    j7DateLabel: string,
    harvestWindowLabel: string,
    pickupCode: string
  ) => {
    const j7Sms: SmsNotification = {
      id: `sms-j7-${Date.now()}`,
      timestamp: `${j7DateLabel} · Simulation SMS`,
      recipientName: 'Aïssata Tall',
      recipientPhone: '+221 77 412 89 30',
      planId: plan.id,
      planName: plan.packageName,
      threshold: '100%',
      progressPct: 100,
      savedFcfa: plan.targetFcfa,
      targetFcfa: plan.targetFcfa,
      remainingFcfa: 0,
      messageBody: `FOUT’AGRO RAPPEL J-7 LIVRAISON & RÉCOLTE : Bonjour Aïssata Tall, votre « ${plan.packageName} » (100% payé) sera livré dans 7 jours (le ${plan.deliveryDate}) au ${plan.deliveryHub}. Préparez vos planches et votre pépinière pour viser une récolte optimale (${harvestWindowLabel}). Bon de retrait : ${pickupCode}.`,
      isUnread: true
    };
    setSmsNotifications((prev) => [j7Sms, ...prev]);
    setLiveSmsToast(j7Sms);
  };

  const handleMarkAllSmsRead = () => {
    setSmsNotifications((prev) =>
      prev.map((n) => ({ ...n, isUnread: false }))
    );
  };

  // Dispatch contextual weather & sowing SMS alert for a zone
  const handleSendWeatherSmsAlert = (
    zone: InterventionZone,
    summaryText: string
  ) => {
    const targetPlan = plans[0];
    const weatherSms: SmsNotification = {
      id: `sms-weather-${Date.now()}`,
      timestamp: '09 Oct 2026 · Maintenant',
      recipientName: 'Aïssata Tall',
      recipientPhone: '+221 77 412 89 30',
      planId: targetPlan?.id || 'plan-101',
      planName: `Semis Zone ${zone}`,
      threshold: '90%',
      progressPct: 100,
      savedFcfa: targetPlan?.savedFcfa || 5000,
      targetFcfa: targetPlan?.targetFcfa || 5000,
      remainingFcfa: 0,
      messageBody: summaryText,
      isUnread: true
    };
    setSmsNotifications((prev) => [weatherSms, ...prev]);
    setLiveSmsToast(weatherSms);
  };

  // Scratch a card to reveal its 12-digit code
  const handleScratchVoucher = (code: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.code === code ? { ...v, isScratched: true } : v))
    );
  };

  // Create a new demo cash payment receipt
  const handleCreateDemoVoucher = (amountFcfa: number) => {
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const newCode = `ESP-${part1}-${part2}`;
    const newVoucher: ScratchVoucher = {
      code: newCode,
      amountFcfa,
      batchId: 'CAISSE-FT-2026-D',
      isScratched: true,
      isRedeemed: false,
      pointOfSale: 'Caisse Coopérative Hamady Ounaré'
    };
    setVouchers((prev) => [newVoucher, ...prev]);
  };

  // Credit a plan and log a transaction
  const applyCreditToPlan = (
    planId: string,
    amountFcfa: number,
    channel: PaymentChannel,
    detail: { voucherCode?: string; phoneNumber?: string }
  ): { targetPlan?: SubscribedPlan; triggeredSms: SmsNotification | null } => {
    const targetPlan = plans.find((p) => p.id === planId);
    const prevSaved = targetPlan?.savedFcfa || 0;
    const nextSaved = prevSaved + amountFcfa;

    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        const updatedSaved = plan.savedFcfa + amountFcfa;
        const isNowDone = updatedSaved >= plan.targetFcfa;
        return {
          ...plan,
          savedFcfa: updatedSaved,
          status: isNowDone ? 'Complété — Prêt à livrer' : 'En cours',
          lastPaymentDate: '09 Oct 2026'
        };
      })
    );

    const refNumber = `FOUTA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: DepositTransaction = {
      id: `tx-${Date.now()}`,
      reference: refNumber,
      date: '09 Oct 2026 · Maintenant',
      amountFcfa,
      channel,
      voucherCode: detail.voucherCode,
      phoneNumber: detail.phoneNumber,
      planId,
      planName: targetPlan?.packageName || 'Paquet FOUT’AGRO',
      villageAgent:
        channel === 'Paiement Espèces'
          ? 'Amadou Ba (Caisse Villageoise Sinthiane Dioudé)'
          : 'Auto-versement Mobile'
    };

    setTransactions((prev) => [newTx, ...prev]);

    setCohort((prev) =>
      prev.map((member) =>
        member.codeProducteur === 'FT-OUN-48291'
          ? {
              ...member,
              savedFcfa: member.savedFcfa + amountFcfa,
              lastDepositDate: '09 Oct 2026'
            }
          : member
      )
    );

    let triggeredSms: SmsNotification | null = null;
    if (targetPlan) {
      triggeredSms = checkAndEmitThresholdSms(
        'Aïssata Tall',
        detail.phoneNumber || '+221 77 412 89 30',
        targetPlan.id,
        targetPlan.packageName,
        prevSaved,
        nextSaved,
        targetPlan.targetFcfa
      );
    }

    return { targetPlan, triggeredSms };
  };

  // Validate a cash payment receipt
  const handleRedeemVoucher = (
    rawCode: string,
    planId: string
  ): { success: boolean; message: string } => {
    const cleanDigits = rawCode.replace(/[^0-9]/g, '');
    const normalizedInput = rawCode.trim().toUpperCase();
    if (cleanDigits.length < 4 && normalizedInput.length < 6) {
      return {
        success: false,
        message:
          'Format de reçu invalide. Veuillez saisir le numéro du reçu de paiement espèces FOUT’AGRO (ex: ESP-4920-8173).'
      };
    }

    const matchedVoucher = vouchers.find(
      (v) =>
        v.code.toUpperCase() === normalizedInput ||
        (cleanDigits.length >= 6 && v.code.replace(/[^0-9]/g, '') === cleanDigits)
    );

    if (!matchedVoucher) {
      return {
        success: false,
        message: `Aucun reçu de paiement espèces actif trouvé pour ${rawCode}. Vérifiez le numéro ou émettez un reçu espèces.`
      };
    }

    if (matchedVoucher.isRedeemed) {
      return {
        success: false,
        message: `Le reçu espèces ${matchedVoucher.code} a déjà été crédité sur un paquet.`
      };
    }

    setVouchers((prev) =>
      prev.map((v) =>
        v.code === matchedVoucher.code
          ? { ...v, isScratched: true, isRedeemed: true }
          : v
      )
    );

    const { targetPlan, triggeredSms } = applyCreditToPlan(
      planId,
      matchedVoucher.amountFcfa,
      'Paiement Espèces',
      { voucherCode: matchedVoucher.code }
    );

    const newBalance = (targetPlan?.savedFcfa || 0) + matchedVoucher.amountFcfa;
    const thresholdNote = triggeredSms
      ? ` [ALERTE SMS SEUIL ${triggeredSms.threshold} ENVOYÉE AU +221 77 412 89 30]`
      : '';

    return {
      success: true,
      message: `SMS FOUT’AGRO : Paiement espèces (Reçu ${matchedVoucher.code}) de ${formatFcfa(
        matchedVoucher.amountFcfa
      )} validé sur « ${targetPlan?.packageName} ». Nouveau solde du paquet : ${formatFcfa(
        newBalance
      )}.${thresholdNote}`
    };
  };

  // Mobile Money Deposit
  const handleMobileDeposit = (
    amount: number,
    channel: PaymentChannel,
    phone: string,
    planId: string
  ): { success: boolean; message: string } => {
    if (!amount || amount < 250) {
      return {
        success: false,
        message: 'Le montant minimum par versement Mobile Money est de 250 FCFA.'
      };
    }

    const { targetPlan, triggeredSms } = applyCreditToPlan(planId, amount, channel, {
      phoneNumber: phone
    });

    const newBalance = (targetPlan?.savedFcfa || 0) + amount;
    const thresholdNote = triggeredSms
      ? ` [ALERTE SMS SEUIL ${triggeredSms.threshold} ENVOYÉE AU ${phone}]`
      : '';

    return {
      success: true,
      message: `SMS FOUT’AGRO : Paiement ${channel} de ${formatFcfa(
        amount
      )} reçu (${phone}). Solde sur « ${
        targetPlan?.packageName
      } » : ${formatFcfa(newBalance)} / ${formatFcfa(
        targetPlan?.targetFcfa || 0
      )}.${thresholdNote}`
    };
  };

  // Subscribe to a new agricultural package
  const handleSubscribePackage = (pkg: AgriPackage, initialDepositFcfa: number) => {
    const newPlanId = `plan-${Date.now()}`;
    const newPlan: SubscribedPlan = {
      id: newPlanId,
      packageId: pkg.id,
      packageName: pkg.name,
      categoryLabel: pkg.categoryLabel,
      surfaceLabel: pkg.surfaceLabel,
      targetFcfa: pkg.priceFcfa,
      savedFcfa: initialDepositFcfa,
      deliveryHub: 'Magasin Coopératif Hamady Ounaré & Matam',
      deliveryDate: '15 Mai 2027',
      status:
        initialDepositFcfa >= pkg.priceFcfa
          ? 'Complété — Prêt à livrer'
          : 'En cours',
      lastPaymentDate: '09 Oct 2026',
      includedItems: pkg.includedItems.slice(0, 3)
    };

    setPlans((prev) => [newPlan, ...prev]);

    const newTx: DepositTransaction = {
      id: `tx-${Date.now()}`,
      reference: `FOUTA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: '09 Oct 2026 · Souscription',
      amountFcfa: initialDepositFcfa,
      channel: 'Wave Mobile Money',
      phoneNumber: '+221 77 412 89 30',
      planId: newPlanId,
      planName: pkg.name,
      villageAgent: 'Souscription FOUT’AGRO 2027'
    };

    setTransactions((prev) => [newTx, ...prev]);

    checkAndEmitThresholdSms(
      'Aïssata Tall',
      '+221 77 412 89 30',
      newPlanId,
      pkg.name,
      0,
      initialDepositFcfa,
      pkg.priceFcfa
    );
  };

  // Village Cohort Quick Deposit
  const handleRecordCohortDeposit = (farmerId: string, amountFcfa: number) => {
    const targetFarmer = cohort.find((f) => f.id === farmerId);
    if (targetFarmer) {
      const prevSaved = targetFarmer.savedFcfa;
      const nextSaved = Math.min(
        targetFarmer.targetFcfa,
        targetFarmer.savedFcfa + amountFcfa
      );
      checkAndEmitThresholdSms(
        targetFarmer.fullName,
        targetFarmer.phone,
        targetFarmer.id,
        targetFarmer.packageName,
        prevSaved,
        nextSaved,
        targetFarmer.targetFcfa
      );
    }

    setCohort((prev) =>
      prev.map((f) =>
        f.id === farmerId
          ? {
              ...f,
              savedFcfa: Math.min(f.targetFcfa, f.savedFcfa + amountFcfa),
              lastDepositDate: '09 Oct 2026'
            }
          : f
      )
    );
  };

  // Add new farmer to Village Cohort
  const handleAddCohortFarmer = (
    farmerData: Omit<VillageFarmerRecord, 'id' | 'codeProducteur'>
  ) => {
    const zonePrefix =
      farmerData.zone === 'Matam'
        ? 'MAT'
        : farmerData.zone === 'Hamady Ounaré'
        ? 'OUN'
        : farmerData.zone === 'Bakel'
        ? 'BAK'
        : 'KAN';
    const randomCode = `FT-${zonePrefix}-${Math.floor(48500 + Math.random() * 900)}`;
    const newRecord: VillageFarmerRecord = {
      ...farmerData,
      id: `vf-${Date.now()}`,
      codeProducteur: randomCode
    };
    setCohort((prev) => [newRecord, ...prev]);
    checkAndEmitThresholdSms(
      farmerData.fullName,
      farmerData.phone,
      newRecord.id,
      farmerData.packageName,
      0,
      farmerData.savedFcfa,
      farmerData.targetFcfa
    );
  };

  // Toggle agronomic training completion
  const handleToggleTraining = (trainingId: string) => {
    setTrainings((prev) =>
      prev.map((t) =>
        t.id === trainingId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Export PDF summary of all transactions and current packages
  const handleExportHistoryPdf = () => {
    const fileName = generateProducerHistoryPdf({
      producerName: 'Aïssata Tall',
      producerCode: 'FT-OUN-48291',
      village: 'Sinthiane Dioudé',
      zone: 'Hamady Ounaré',
      phone: '+221 77 412 89 30',
      plans,
      transactions
    });
    setExportedPdfName(fileName);
    setTimeout(() => setExportedPdfName(null), 4000);
  };

  // Create a new neighbor referral with a unique code
  const handleCreateReferral = (
    newRefData: Omit<ReferralRecord, 'id' | 'createdAt' | 'status'>
  ) => {
    const newReferral: ReferralRecord = {
      ...newRefData,
      id: `ref-${Date.now()}`,
      status: 'Invitation envoyée (SMS)',
      createdAt: '09 Oct 2026'
    };
    setReferrals((prev) => [newReferral, ...prev]);

    const inviteSms: SmsNotification = {
      id: `sms-ref-${Date.now()}`,
      timestamp: '09 Oct 2026 · Parrainage SMS',
      recipientName: newRefData.neighborName,
      recipientPhone: newRefData.neighborPhone,
      planId: plans[0]?.id || 'plan-101',
      planName: newRefData.packageLabel,
      threshold: '50%',
      progressPct: 50,
      savedFcfa: 500,
      targetFcfa: 5000,
      remainingFcfa: 4500,
      messageBody: `FOUT’AGRO INVITATION PARRAINAGE : Bonjour ${newRefData.neighborName} (${newRefData.village}, Zone ${newRefData.zone}), Aïssata Tall vous invite avec le code unique ${newRefData.referralCode} pour souscrire au « ${newRefData.packageLabel} ». Bonus de +500 FCFA offert dès votre premier versement !`,
      isUnread: true
    };
    setSmsNotifications((prev) => [inviteSms, ...prev]);
    setLiveSmsToast(inviteSms);
  };

  // Validate a pending referral so its +500 FCFA bonus becomes ready to claim
  const handleValidatePendingReferral = (referralId: string) => {
    const targetRef = referrals.find((r) => r.id === referralId);
    if (!targetRef) return;

    setReferrals((prev) =>
      prev.map((r) =>
        r.id === referralId ? { ...r, status: 'Validé — Bonus prêt' } : r
      )
    );

    const validSms: SmsNotification = {
      id: `sms-ref-val-${Date.now()}`,
      timestamp: '09 Oct 2026 · Bonus Débloqué',
      recipientName: 'Aïssata Tall',
      recipientPhone: '+221 77 412 89 30',
      planId: plans[0]?.id || 'plan-101',
      planName: targetRef.packageLabel,
      threshold: '90%',
      progressPct: 90,
      savedFcfa: totalSavedFcfa,
      targetFcfa: totalTargetFcfa,
      remainingFcfa: Math.max(0, totalTargetFcfa - totalSavedFcfa),
      messageBody: `FOUT’AGRO BONUS PARRAINAGE (+500 F) : Votre voisin(e) ${targetRef.neighborName} (${targetRef.village}) a activé votre code ${targetRef.referralCode}. Votre récompense de +500 FCFA est prête à être appliquée sur vos paquets !`,
      isUnread: true
    };
    setSmsNotifications((prev) => [validSms, ...prev]);
    setLiveSmsToast(validSms);
  };

  // Claim a +500 FCFA referral bonus onto a target active package
  const handleClaimReferralBonus = (referralId: string, targetPlanId: string) => {
    const targetRef = referrals.find((r) => r.id === referralId);
    const targetPlan = plans.find((p) => p.id === targetPlanId) || plans[0];
    if (!targetRef || !targetPlan || targetRef.status === 'Crédité sur paquet') return;

    const prevSaved = targetPlan.savedFcfa;
    const nextSaved = Math.min(targetPlan.targetFcfa, prevSaved + targetRef.bonusFcfa);

    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== targetPlan.id) return p;
        return {
          ...p,
          savedFcfa: nextSaved,
          status:
            nextSaved >= p.targetFcfa ? 'Complété — Prêt à livrer' : 'En cours',
          lastPaymentDate: '09 Oct 2026'
        };
      })
    );

    setReferrals((prev) =>
      prev.map((r) =>
        r.id === referralId
          ? {
              ...r,
              status: 'Crédité sur paquet',
              creditedPlanId: targetPlan.id,
              creditedPlanName: targetPlan.packageName
            }
          : r
      )
    );

    const newTx: DepositTransaction = {
      id: `tx-ref-${Date.now()}`,
      reference: `FOUTA-PARRAIN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: '09 Oct 2026 · Bonus Parrainage',
      amountFcfa: targetRef.bonusFcfa,
      channel: 'Bonus Parrainage Voisin',
      voucherCode: targetRef.referralCode,
      planId: targetPlan.id,
      planName: targetPlan.packageName,
      villageAgent: `Parrainage ${targetRef.neighborName} (${targetRef.village})`
    };
    setTransactions((prev) => [newTx, ...prev]);

    checkAndEmitThresholdSms(
      'Aïssata Tall',
      '+221 77 412 89 30',
      targetPlan.id,
      targetPlan.packageName,
      prevSaved,
      nextSaved,
      targetPlan.targetFcfa
    );
  };

  // Reset demo data
  const handleResetDemo = () => {
    setPlans(INITIAL_SUBSCRIBED_PLANS);
    setTransactions(INITIAL_TRANSACTIONS);
    setVouchers(INITIAL_SCRATCH_VOUCHERS);
    setCohort(INITIAL_VILLAGE_COHORT);
    setTrainings(INITIAL_TRAINING_MODULES);
    setSmsNotifications(INITIAL_SMS_NOTIFICATIONS);
    setReferrals(INITIAL_REFERRALS);
    setLiveSmsToast(null);
    localStorage.removeItem(STORAGE_KEYS.PLANS);
    localStorage.removeItem(STORAGE_KEYS.TXS);
    localStorage.removeItem(STORAGE_KEYS.VOUCHERS);
    localStorage.removeItem(STORAGE_KEYS.COHORT);
    localStorage.removeItem(STORAGE_KEYS.TRAININGS);
    localStorage.removeItem(STORAGE_KEYS.SMS);
    localStorage.removeItem(STORAGE_KEYS.REFERRALS);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-stone-900">
      {/* Strict One-Row 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('dashboard');
            }}
            className="font-display text-lg font-bold tracking-tight text-emerald-950 whitespace-nowrap shrink-0"
          >
            FOUT’AGRO
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-stone-900 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'dashboard'
                  ? 'text-stone-900 underline underline-offset-8 decoration-2 decoration-emerald-800 font-semibold'
                  : ''
              }`}
            >
              Tableau de bord
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`hover:text-stone-900 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'catalog'
                  ? 'text-stone-900 underline underline-offset-8 decoration-2 decoration-emerald-800 font-semibold'
                  : ''
              }`}
            >
              Catalogue
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('deposit')}
              className={`hover:text-stone-900 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'deposit'
                  ? 'text-stone-900 underline underline-offset-8 decoration-2 decoration-emerald-800 font-semibold'
                  : ''
              }`}
            >
              Versements
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ussd')}
              className={`hover:text-stone-900 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'ussd'
                  ? 'text-stone-900 underline underline-offset-8 decoration-2 decoration-emerald-800 font-semibold'
                  : ''
              }`}
            >
              Terminal USSD
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('village')}
              className={`hover:text-stone-900 transition-colors duration-150 whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'village'
                  ? 'text-stone-900 underline underline-offset-8 decoration-2 decoration-emerald-800 font-semibold'
                  : ''
              }`}
            >
              Villages
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('deposit')}
              className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              Effectuer un versement
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-6 py-8 md:py-12 space-y-10">
        {/* Mobile Workspace Navigation Bar (Non-sticky to preserve 15% mobile sticky cap) */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
          {[
            { id: 'dashboard', label: 'Tableau de bord' },
            { id: 'catalog', label: 'Catalogue' },
            { id: 'deposit', label: 'Versements' },
            { id: 'ussd', label: 'Terminal USSD' },
            { id: 'village', label: 'Villages' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 ${
                activeTab === item.id
                  ? 'bg-emerald-900 text-white'
                  : 'text-stone-700 bg-white border border-stone-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Live Incoming SMS Banner when a 50% or 90% threshold is crossed */}
        {liveSmsToast && (
          <div
            role="status"
            aria-live="polite"
            className="bg-stone-900 text-stone-100 border border-stone-700 rounded-xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <MessageSquare className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300 font-mono-tabular">
                  <span className="font-sans font-bold">
                    Nouveau SMS entrant · Seuil {liveSmsToast.threshold} atteint
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Vers : {liveSmsToast.recipientPhone}</span>
                  <span aria-hidden="true">·</span>
                  <span>{liveSmsToast.timestamp}</span>
                </div>
                <p className="text-sm font-mono-tabular text-stone-100 leading-relaxed">
                  {liveSmsToast.messageBody}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {liveSmsToast.remainingFcfa > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setPreselectedPlanId(liveSmsToast.planId);
                    setActiveTab('deposit');
                    setLiveSmsToast(null);
                  }}
                  className="min-h-[38px] px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  Verser le solde ({formatFcfa(liveSmsToast.remainingFcfa)})
                </button>
              )}
              <button
                type="button"
                onClick={() => setLiveSmsToast(null)}
                aria-label="Fermer la notification SMS"
                className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-white rounded-lg transition-colors duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            {/* 2-Column Split Hero with items-stretch (Zero Nested Cards) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: Producer Context & Primary Action */}
              <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-8 md:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Unboxed regional & producer metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span className="font-semibold text-emerald-800">
                      FOUT’AGRO · Zones : Matam · Hamady Ounaré · Kanel · Bakel
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Village : Sinthiane Dioudé</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">ID : FT-OUN-48291</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold tracking-tight text-stone-900 leading-[1.14]">
                    Épargnez petit à petit pour vos paquets Laitue, Bissap Blanc, Oignons et Poules.
                  </h1>

                  <p className="text-base text-stone-600 leading-relaxed max-w-[64ch]">
                    Bienvenue <strong>Aïssata Tall</strong> sur <strong>FOUT’AGRO</strong>. Dans nos <strong>36 villages</strong> répartis sur <strong>Matam, Hamady Ounaré, Kanel et Bakel</strong>, cotisez par paiement espèces ou Mobile Money sans crédit bancaire.
                  </p>
                </div>

                {/* Official FOUT'AGRO Packages & Certified Varieties Hairline Strip (No nested boxes) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 border-t border-stone-200 pt-4">
                  <div className="py-1.5 sm:py-0 sm:pr-4">
                    <p className="text-xs font-medium text-stone-600">Laitue</p>
                    <p className="text-xs font-mono-tabular font-bold text-emerald-800 mt-0.5">
                      5 000 F · 2 000 F
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Variété EDEN · 25 g
                    </p>
                  </div>
                  <div className="py-1.5 sm:py-0 sm:px-4">
                    <p className="text-xs font-medium text-stone-600">Bissap Blanc</p>
                    <p className="text-xs font-mono-tabular font-bold text-emerald-800 mt-0.5">
                      5 000 F · 2 000 F
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Calices & feuilles
                    </p>
                  </div>
                  <div className="py-1.5 sm:py-0 sm:px-4">
                    <p className="text-xs font-medium text-stone-600">Oignons</p>
                    <p className="text-xs font-mono-tabular font-bold text-emerald-800 mt-0.5">
                      6 000 F · 2 500 F
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Variété SAFARI · 30 g
                    </p>
                  </div>
                  <div className="py-1.5 sm:py-0 sm:pl-4">
                    <p className="text-xs font-medium text-stone-600">Poules</p>
                    <p className="text-xs font-mono-tabular font-bold text-emerald-800 mt-0.5">
                      8 000 F
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Lot avicole vacciné
                    </p>
                  </div>
                </div>

                {/* Progress Bar Summary inside Hero Left */}
                <div className="pt-4 border-t border-stone-200 space-y-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-stone-700">
                      Avancement global de votre épargne FOUT’AGRO 2027
                    </span>
                    <span className="font-mono-tabular text-sm font-bold text-emerald-900">
                      {formatFcfa(totalSavedFcfa)} / {formatFcfa(totalTargetFcfa)} ({overallProgressPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-800 origin-left transition-transform duration-150"
                      style={{ transform: `scaleX(${overallProgressPct / 100})` }}
                    />
                  </div>
                </div>

                {/* Hero CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('deposit')}
                    className="min-h-[44px] px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-lg transition-colors duration-150 flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    <span>Créditer en Espèces ou Mobile Money</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleExportHistoryPdf}
                    className="min-h-[44px] px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-lg transition-colors duration-150 flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    <FileDown className="w-4 h-4 text-amber-300" />
                    <span>Exporter mon historique (PDF)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('village')}
                    className="min-h-[44px] px-4 py-2.5 bg-[#F7F7F5] hover:bg-stone-200/70 text-stone-800 border border-stone-300 text-sm font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0"
                  >
                    Explorer les 36 villages
                  </button>
                </div>

                {exportedPdfName && (
                  <div
                    role="status"
                    className="py-2.5 px-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-3 text-xs text-emerald-950"
                  >
                    <span>
                      Récapitulatif PDF généré avec succès :{' '}
                      <strong className="font-mono-tabular">{exportedPdfName}</strong> ({plans.length} paquets & {transactions.length} transactions).
                    </span>
                    <button
                      type="button"
                      onClick={() => setExportedPdfName(null)}
                      className="font-semibold text-emerald-800 hover:underline whitespace-nowrap shrink-0"
                    >
                      Fermer
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: High-Resolution Documentary Image with Measured Contrast Scrim */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-stone-200 min-h-[340px]">
                <ResilientImage
                  src={HERO_IMAGE_URL}
                  alt="Productrice agricole du Fouta inspectant sa récolte maraîchère"
                  fallbackTitle="FOUT’AGRO — Matam, Hamady Ounaré, Kanel & Bakel"
                  className="w-full h-full lg:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
                  <blockquote className="text-sm leading-relaxed text-stone-100 mb-3 tracking-[0.01em]">
                    « Avec FOUT’AGRO à Sinthiane Dioudé, j’épargne 500 F ou 1 000 F après chaque marché. Avant ce système, j’achetais des semences non certifiées et je perdais un tiers de ma récolte. Aujourd’hui, mes paquets Laitue, Oignons et Poules doublent mon revenu maraîcher. »
                  </blockquote>
                  <div className="text-xs text-amber-300 font-medium">
                    Aïssata Tall · Productrice maraîchère · Coopérative de Sinthiane Dioudé (Zone Hamady Ounaré)
                  </div>
                </div>
              </div>
            </section>

            {/* Full-Width 4-Column KPI Row Below Hero Split */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <p className="text-xs text-stone-500 font-medium">
                  Épargne cumulée (Campagne 2027)
                </p>
                <p className="text-2xl font-bold font-mono-tabular text-stone-900 mt-2">
                  {formatFcfa(totalSavedFcfa)}
                </p>
                <p className="text-xs text-emerald-800 mt-1 font-mono-tabular">
                  Reste à cotiser : {formatFcfa(Math.max(0, totalTargetFcfa - totalSavedFcfa))}
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <p className="text-xs text-stone-500 font-medium">
                  Paquets FOUT’AGRO 100% financés
                </p>
                <p className="text-2xl font-bold font-mono-tabular text-stone-900 mt-2">
                  {completedPlansCount} / {plans.length} paquets
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Garantie de livraison avant semis
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <p className="text-xs text-stone-500 font-medium">
                  Alertes SMS 50% & 90% envoyées
                </p>
                <p className="text-2xl font-bold font-mono-tabular text-stone-900 mt-2">
                  {smsNotifications.length} SMS
                </p>
                <p className="text-xs text-stone-500 mt-1 font-mono-tabular">
                  Passerelle GSM +221 77 412 89 30
                </p>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <p className="text-xs text-stone-500 font-medium">
                  Couverture territoriale FOUT’AGRO
                </p>
                <p className="text-2xl font-bold font-mono-tabular text-stone-900 mt-2">
                  {FOUTA_ZONES.length} Zones · {FOUTA_VILLAGES.length} Villages
                </p>
                <p className="text-xs text-stone-500 mt-1 truncate">
                  Matam, Hamady Ounaré, Kanel, Bakel
                </p>
              </div>
            </section>

            {/* Active Layaway Plans Section — Single-Elevation Cards */}
            <section className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <p className="text-xs font-medium text-emerald-800 mb-1">
                    Suivi Individuel par Paquet · Seuils d’Alerte SMS à 50% et 90%
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-stone-900">
                    Mes Paquets FOUT’AGRO en Cours d’Épargne ({plans.length})
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportHistoryPdf}
                    className="min-h-[38px] px-3.5 py-1.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-lg text-xs font-semibold transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <FileDown className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Exporter mon historique</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('catalog')}
                    className="min-h-[38px] px-3.5 py-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <span>Ajouter un paquet (dès 2 000 F)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => {
                  const pct = Math.min(
                    100,
                    Math.round((plan.savedFcfa / plan.targetFcfa) * 100)
                  );
                  const remaining = Math.max(0, plan.targetFcfa - plan.savedFcfa);
                  const isComplete = plan.savedFcfa >= plan.targetFcfa;

                  return (
                    <div
                      key={plan.id}
                      className="bg-white border border-stone-200 rounded-2xl p-6 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        {/* Unboxed metadata line */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                          <span className="font-medium text-emerald-800">
                            {plan.categoryLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{plan.surfaceLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-stone-800">
                            {plan.status}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-stone-900">
                          {plan.packageName}
                        </h3>

                        {/* Progress Bar with 50% and 90% Threshold Markers */}
                        <div className="space-y-2 pt-1">
                          <div className="flex items-baseline justify-between font-mono-tabular">
                            <span className="text-xl font-bold text-stone-900">
                              {formatFcfa(plan.savedFcfa)}
                            </span>
                            <span className="text-xs text-stone-500">
                              sur {formatFcfa(plan.targetFcfa)} ({pct}%)
                            </span>
                          </div>
                          <div className="relative w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full origin-left transition-transform duration-150 ${
                                isComplete ? 'bg-emerald-700' : 'bg-amber-600'
                              }`}
                              style={{ transform: `scaleX(${pct / 100})` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono-tabular">
                            <span>
                              {pct >= 50 ? 'Seuil SMS 50% validé' : `Seuil SMS 50% : ${formatFcfa(plan.targetFcfa * 0.5)}`}
                            </span>
                            <span>
                              {pct >= 90 ? 'Seuil SMS 90% validé' : `Seuil SMS 90% : ${formatFcfa(plan.targetFcfa * 0.9)}`}
                            </span>
                          </div>
                        </div>

                        {/* Included items — Clean Hairline Rows (No Line-by-Line Decorative Icons) */}
                        <div className="pt-3 border-t border-stone-100 space-y-1.5">
                          <p className="text-xs font-semibold text-stone-700">
                            Contenu réservé à votre nom :
                          </p>
                          <ul className="divide-y divide-stone-100 text-xs text-stone-600">
                            {plan.includedItems.map((it, idx) => (
                              <li key={idx} className="py-1 first:pt-0 last:pb-0">
                                {it}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-stone-100 space-y-3">
                        <div className="flex items-center justify-between text-xs text-stone-500">
                          <span className="truncate max-w-[260px]">{plan.deliveryHub}</span>
                          <span className="font-mono-tabular">{plan.deliveryDate}</span>
                        </div>

                        {isComplete ? (
                          <div className="w-full min-h-[40px] py-2 px-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>Prêt pour retrait au magasin FOUT’AGRO</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setPreselectedPlanId(plan.id);
                              setActiveTab('deposit');
                            }}
                            className="w-full min-h-[40px] py-2 px-4 bg-stone-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
                          >
                            Verser sur ce paquet ({formatFcfa(remaining)} restants)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* J-7 Pre-Delivery & Harvest Reminder Component */}
            <HarvestDeliveryReminderCard
              plans={plans}
              onTriggerJ7Sms={handleTriggerJ7Sms}
              onCompletePlanNow={(planId) => {
                setPreselectedPlanId(planId);
                setActiveTab('deposit');
              }}
            />

            {/* Referral Rewards & Neighbor Savings Bonus Tracker in Dashboard */}
            <ReferralRewardsDashboardCard
              referrals={referrals}
              plans={plans}
              personalReferralCode="PARRAIN-OUN-482A"
              onClaimReferralBonus={handleClaimReferralBonus}
              onValidatePendingReferral={handleValidatePendingReferral}
              onOpenVillageReferralModule={() => setActiveTab('village')}
            />

            {/* Weekly Savings Progression Line Chart (Recharts) */}
            <SavingsProgressionChart
              totalSavedFcfa={totalSavedFcfa}
              totalTargetFcfa={totalTargetFcfa}
              transactions={transactions}
            />

            {/* Estimated Harvest Yield Calculator by Package & Cultivated Surface */}
            <YieldEstimatorDashboard
              packages={AGRI_PACKAGES}
              activePlans={plans}
              onSubscribePackage={(pkg, initAmt) => {
                handleSubscribePackage(pkg, initAmt);
              }}
            />

            {/* Agricultural Weather Forecast & Contextual Sowing Alerts (Matam, Hamady Ounaré, Kanel, Bakel) */}
            <AgroWeatherCard
              onSendWeatherSmsAlert={handleSendWeatherSmsAlert}
            />

            {/* Optimal Sowing Calendar by Climatic Zone & Selected Crops (Lettuce, Bissap, Onions) */}
            <SowingCalendarDashboard
              onSendCalendarSms={handleSendWeatherSmsAlert}
            />

            {/* Agronomic FAQ Section for Lettuce & Onions Yield Optimization */}
            <AgronomicFaqSection
              onNavigateToCatalog={() => setActiveTab('catalog')}
            />

            {/* Simulated SMS Notification Center (50% and 90% Thresholds) */}
            <SmsNotificationCenter
              notifications={smsNotifications}
              plans={plans}
              onSimulateThresholdSms={handleSimulateThresholdSms}
              onMarkAllRead={handleMarkAllSmsRead}
              onSelectPlanForDeposit={(planId) => {
                setPreselectedPlanId(planId);
                setActiveTab('deposit');
              }}
            />

            {/* Overview of the 4 Zones & 36 Villages — Clean Hairline Architecture (Zero Nested Cards) */}
            <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                  <p className="text-xs font-medium text-emerald-800 mb-1">
                    Maillage Territorial FOUT’AGRO · Points Relais & Entrepreneurs Villageois
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                    Zones d’Intervention (Matam · Hamady Ounaré · Kanel · Bakel) & les 36 Villages
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('village')}
                  className="min-h-[40px] px-4 py-2 bg-stone-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  Ouvrir le répertoire des 36 villages
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-stone-200">
                {FOUTA_ZONES.map((zone, idx) => {
                  const zoneVillages = FOUTA_VILLAGES.filter((v) => v.zone === zone);
                  return (
                    <div
                      key={zone}
                      className={`py-4 md:py-0 ${
                        idx === 0
                          ? 'md:pr-6'
                          : idx === FOUTA_ZONES.length - 1
                          ? 'md:pl-6'
                          : 'md:px-6'
                      } space-y-2.5`}
                    >
                      <div className="flex items-baseline justify-between border-b border-stone-100 pb-2">
                        <h3 className="text-sm font-bold text-stone-900">
                          Zone {zone}
                        </h3>
                        <span className="text-xs font-mono-tabular font-semibold text-emerald-800">
                          {zoneVillages.length} villages
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {zoneVillages.map((v) => v.name).join(' · ')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'catalog' && (
          <PackageCatalog
            packages={AGRI_PACKAGES}
            onSubscribePackage={(pkg, initAmt) => {
              handleSubscribePackage(pkg, initAmt);
            }}
          />
        )}

        {activeTab === 'deposit' && (
          <div className="space-y-12">
            <DepositStudio
              plans={plans}
              vouchers={vouchers}
              transactions={transactions}
              initialSelectedPlanId={preselectedPlanId}
              onScratchVoucher={handleScratchVoucher}
              onCreateDemoVoucher={handleCreateDemoVoucher}
              onRedeemVoucher={handleRedeemVoucher}
              onMobileDeposit={handleMobileDeposit}
            />
            <SmsNotificationCenter
              notifications={smsNotifications}
              plans={plans}
              onSimulateThresholdSms={handleSimulateThresholdSms}
              onMarkAllRead={handleMarkAllSmsRead}
            />
          </div>
        )}

        {activeTab === 'ussd' && (
          <UssdSimulator
            plans={plans}
            vouchers={vouchers}
            onRedeemVoucher={handleRedeemVoucher}
            onMobileDeposit={handleMobileDeposit}
          />
        )}

        {activeTab === 'village' && (
          <VillageNetwork
            cohort={cohort}
            trainings={trainings}
            referrals={referrals}
            plans={plans}
            onRecordCohortDeposit={handleRecordCohortDeposit}
            onAddCohortFarmer={handleAddCohortFarmer}
            onToggleTraining={handleToggleTraining}
            onCreateReferral={handleCreateReferral}
            onValidatePendingReferral={handleValidatePendingReferral}
            onClaimReferralBonus={handleClaimReferralBonus}
          />
        )}
      </main>

      {/* Clean Footer with Real User Actions & WhatsApp Field Agent Button */}
      <footer className="border-t border-stone-200 bg-white mt-16">
        <div className="max-w-[1360px] mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-6 text-xs text-stone-500">
          <div className="space-y-1">
            <p className="font-semibold text-stone-900">
              FOUT’AGRO — Épargne Prépayée Maraîchage & Aviculture (Laitue EDEN 25g, Bissap Blanc, Oignon SAFARI 30g, Poules)
            </p>
            <p>
              Zones d’intervention : Matam · Hamady Ounaré · Kanel · Bakel (36 villages couverts)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => setIsWhatsAppOpen(true)}
              className="min-h-[42px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>Contactez notre assistant WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ussd')}
              className="min-h-[40px] px-2 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Protocole USSD *456#
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('village')}
              className="min-h-[40px] px-2 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Répertoire des 36 Villages
            </button>
            <button
              type="button"
              onClick={handleResetDemo}
              className="min-h-[40px] px-2 text-stone-600 hover:text-stone-900 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser les données démo</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Simulated WhatsApp Chat Modal with FOUT'AGRO Field Agents */}
      <WhatsAppFieldAgentModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        plans={plans}
        packages={AGRI_PACKAGES}
        onNavigateToDeposit={(planId) => {
          if (planId) setPreselectedPlanId(planId);
          setActiveTab('deposit');
        }}
        onNavigateToCatalog={() => setActiveTab('catalog')}
      />
    </div>
  );
}

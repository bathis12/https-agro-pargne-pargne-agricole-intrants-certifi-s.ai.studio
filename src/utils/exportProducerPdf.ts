import { jsPDF } from 'jspdf';
import {
  SubscribedPlan,
  DepositTransaction,
  formatFcfa
} from '../data/agroData';

export interface ProducerPdfExportData {
  producerName: string;
  producerCode: string;
  village: string;
  zone: string;
  phone: string;
  plans: SubscribedPlan[];
  transactions: DepositTransaction[];
}

// Helper to ensure clean ASCII-compatible spacing for thousand separators in standard PDF fonts
const pdfFcfa = (amount: number): string => {
  return formatFcfa(amount).replace(/\u202F|\u00A0/g, ' ');
};

export const generateProducerHistoryPdf = (data: ProducerPdfExportData): string => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 16;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 18;
    }
  };

  const totalSaved = data.plans.reduce((acc, p) => acc + p.savedFcfa, 0);
  const totalTarget = data.plans.reduce((acc, p) => acc + p.targetFcfa, 0);
  const totalRemaining = Math.max(0, totalTarget - totalSaved);
  const overallPct =
    totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
  const completedCount = data.plans.filter((p) => p.savedFcfa >= p.targetFcfa).length;

  // 1. Header Banner
  doc.setFillColor(6, 78, 59); // Emerald 900
  doc.rect(0, 0, pageWidth, 34, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text("FOUT'AGRO - RELEVE D'EPARGNE & HISTORIQUE", margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    "Zones d'intervention : Matam · Hamady Ounare · Kanel · Bakel (36 villages couverts)",
    margin,
    21
  );
  doc.text(
    'Paquets : Laitue EDEN 25g (5 000 F / 2 000 F) · Bissap Blanc (5 000 F / 2 000 F) · Oignons SAFARI 30g (6 000 F / 2 500 F) · Poules (8 000 F)',
    margin,
    27
  );

  y = 43;

  // 2. Producer Identity & Global Summary Box
  doc.setDrawColor(214, 211, 209);
  doc.setFillColor(247, 247, 245);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'FD');

  doc.setTextColor(28, 25, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Productrice : ${data.producerName}`, margin + 4, y + 7);
  doc.text(`ID Producteur : ${data.producerCode}`, margin + 4, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    `Localite : Village de ${data.village} (Zone ${data.zone})`,
    margin + 4,
    y + 19
  );
  doc.text(`Telephone GSM / USSD : ${data.phone}`, margin + 4, y + 24.5);

  // Right side of summary box: Global KPIs
  const rightColX = margin + contentWidth * 0.54;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(6, 95, 70);
  doc.text(
    `Epargne cumulee : ${pdfFcfa(totalSaved)} / ${pdfFcfa(totalTarget)} (${overallPct}%)`,
    rightColX,
    y + 7
  );

  doc.setTextColor(28, 25, 23);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Reste a cotiser : ${pdfFcfa(totalRemaining)}`, rightColX, y + 13);
  doc.text(
    `Paquets 100% finances : ${completedCount} sur ${data.plans.length} paquets`,
    rightColX,
    y + 19
  );
  doc.text(
    `Transactions enregistrees : ${data.transactions.length} versements`,
    rightColX,
    y + 24.5
  );

  y += 36;

  // 3. Section 1: Current Status of Subscribed Savings Packages
  doc.setTextColor(6, 95, 70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(
    `1. ETAT ACTUEL DES PAQUETS D'EPARGNE (${data.plans.length} PAQUETS SOUSCRITS)`,
    margin,
    y
  );
  y += 3;
  doc.setDrawColor(214, 211, 209);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  // Table Header for Plans
  doc.setFillColor(231, 229, 228);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(68, 64, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Paquet FOUT’AGRO & Surface', margin + 2, y + 4.8);
  doc.text('Epargne', margin + 78, y + 4.8);
  doc.text('Objectif', margin + 104, y + 4.8);
  doc.text('Reste', margin + 129, y + 4.8);
  doc.text('Avancement & Statut', margin + 152, y + 4.8);
  y += 7;

  data.plans.forEach((plan, idx) => {
    checkPageBreak(15);
    const pct = Math.min(100, Math.round((plan.savedFcfa / plan.targetFcfa) * 100));
    const rem = Math.max(0, plan.targetFcfa - plan.savedFcfa);

    if (idx % 2 === 1) {
      doc.setFillColor(250, 250, 249);
      doc.rect(margin, y, contentWidth, 12, 'F');
    }

    doc.setTextColor(28, 25, 23);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(plan.packageName.slice(0, 42), margin + 2, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 113, 108);
    doc.text(
      `${plan.categoryLabel} · ${plan.surfaceLabel} · Livraison : ${plan.deliveryDate}`,
      margin + 2,
      y + 9.5
    );

    doc.setTextColor(6, 95, 70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(pdfFcfa(plan.savedFcfa), margin + 78, y + 6.5);

    doc.setTextColor(28, 25, 23);
    doc.setFont('helvetica', 'normal');
    doc.text(pdfFcfa(plan.targetFcfa), margin + 104, y + 6.5);
    doc.text(pdfFcfa(rem), margin + 129, y + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    if (pct >= 100) {
      doc.setTextColor(6, 95, 70);
      doc.text('100% - Pret a livrer', margin + 152, y + 6.5);
    } else {
      doc.setTextColor(180, 83, 9);
      doc.text(`${pct}% - En cours`, margin + 152, y + 6.5);
    }

    y += 12;
    doc.setDrawColor(231, 229, 228);
    doc.line(margin, y, margin + contentWidth, y);
  });

  y += 9;

  // 4. Section 2: Complete Transaction History
  checkPageBreak(25);
  doc.setTextColor(6, 95, 70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(
    `2. HISTORIQUE COMPLET DES TRANSACTIONS (${data.transactions.length} VERSEMENTS)`,
    margin,
    y
  );
  y += 3;
  doc.setDrawColor(214, 211, 209);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  // Table Header for Transactions
  doc.setFillColor(231, 229, 228);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(68, 64, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Reference', margin + 2, y + 4.8);
  doc.text('Date', margin + 35, y + 4.8);
  doc.text('Canal de paiement', margin + 68, y + 4.8);
  doc.text('Paquet credite', margin + 112, y + 4.8);
  doc.text('Montant', margin + 160, y + 4.8);
  y += 7;

  data.transactions.forEach((tx, idx) => {
    checkPageBreak(10);
    if (idx % 2 === 1) {
      doc.setFillColor(250, 250, 249);
      doc.rect(margin, y, contentWidth, 8.5, 'F');
    }

    doc.setTextColor(28, 25, 23);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(tx.reference, margin + 2, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(87, 83, 78);
    doc.text(tx.date.slice(0, 18), margin + 35, y + 5.5);

    const channelText = tx.voucherCode
      ? `${tx.channel} (${tx.voucherCode})`
      : tx.channel;
    doc.text(channelText.slice(0, 26), margin + 68, y + 5.5);

    doc.setTextColor(28, 25, 23);
    doc.text(tx.planName.slice(0, 28), margin + 112, y + 5.5);

    doc.setTextColor(6, 95, 70);
    doc.setFont('helvetica', 'bold');
    doc.text(`+${pdfFcfa(tx.amountFcfa)}`, margin + 160, y + 5.5);

    y += 8.5;
    doc.setDrawColor(231, 229, 228);
    doc.line(margin, y, margin + contentWidth, y);
  });

  // 5. Footer Certification Stamp
  checkPageBreak(22);
  y += 8;
  doc.setFillColor(247, 247, 245);
  doc.setDrawColor(214, 211, 209);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'FD');

  doc.setTextColor(68, 64, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(
    "ATTESTATION DE SOLDE FOUT'AGRO - MAGASIN COOPERATIF HAMADY OUNARE & MATAM",
    margin + 4,
    y + 6
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(
    'Ce document certifie les versements effectues en especes et Mobile Money pour la campagne 2027. Livraison garantie avant semis.',
    margin + 4,
    y + 11.5
  );

  const fileName = `releve_historique_foutagro_${data.producerCode.toLowerCase()}.pdf`;
  doc.save(fileName);
  return fileName;
};

export type PackageCategory = 'laitue' | 'bissap' | 'oignons' | 'poules';

export type InterventionZone = 'Matam' | 'Hamady Ounaré' | 'Kanel' | 'Bakel';

export interface FoutaVillageInfo {
  name: string;
  zone: InterventionZone;
  relayStore: string;
}

export const FOUTA_ZONES: InterventionZone[] = [
  'Matam',
  'Hamady Ounaré',
  'Kanel',
  'Bakel'
];

export const FOUTA_VILLAGES: FoutaVillageInfo[] = [
  { name: 'Ganguel Soulé', zone: 'Kanel', relayStore: 'Magasin Coopératif Hamady Ounaré' },
  { name: 'Sinthiane Dioudé', zone: 'Hamady Ounaré', relayStore: 'Point Relais Hamady Ounaré' },
  { name: 'Dioudé', zone: 'Hamady Ounaré', relayStore: 'Point Relais Hamady Ounaré' },
  { name: 'Gouriky Coliabé', zone: 'Kanel', relayStore: 'Magasin Coopératif Kanel' },
  { name: 'Bapalel', zone: 'Hamady Ounaré', relayStore: 'Point Relais Ndendory' },
  { name: 'Orndoldé', zone: 'Matam', relayStore: 'Magasin Central Matam' },
  { name: 'Barmathial', zone: 'Matam', relayStore: 'Point Relais Ogo' },
  { name: 'Ngano', zone: 'Matam', relayStore: 'Magasin Central Matam' },
  { name: 'Thially', zone: 'Kanel', relayStore: 'Point Relais Semmé' },
  { name: 'Odabéré', zone: 'Kanel', relayStore: 'Magasin Coopératif Kanel' },
  { name: 'Bow', zone: 'Hamady Ounaré', relayStore: 'Point Relais Sinthiou Bamambé' },
  { name: 'Thiemping', zone: 'Kanel', relayStore: 'Point Relais Waoundé' },
  { name: 'Garly', zone: 'Bakel', relayStore: 'Magasin Coopératif Bakel' },
  { name: 'Padalal', zone: 'Kanel', relayStore: 'Point Relais Semmé' },
  { name: 'Barkatou', zone: 'Hamady Ounaré', relayStore: 'Point Relais Hamady Ounaré' },
  { name: 'Barkéwi', zone: 'Hamady Ounaré', relayStore: 'Point Relais Hamady Ounaré' },
  { name: 'Goumal', zone: 'Kanel', relayStore: 'Point Relais Sinthiou Garba' },
  { name: 'Waoundé', zone: 'Kanel', relayStore: 'Magasin Coopératif Waoundé' },
  { name: 'Diella', zone: 'Kanel', relayStore: 'Point Relais Waoundé' },
  { name: 'Balel', zone: 'Bakel', relayStore: 'Magasin Coopératif Bakel' },
  { name: 'Gassambéry', zone: 'Kanel', relayStore: 'Point Relais Orkadiéré' },
  { name: 'Semmé', zone: 'Kanel', relayStore: 'Magasin Coopératif Semmé' },
  { name: 'Aouré', zone: 'Kanel', relayStore: 'Point Relais Orkadiéré' },
  { name: 'Doundé', zone: 'Hamady Ounaré', relayStore: 'Point Relais Ndendory' },
  { name: 'Dialloubé', zone: 'Matam', relayStore: 'Magasin Central Matam' },
  { name: 'Appé Diaobé', zone: 'Kanel', relayStore: 'Point Relais Orkadiéré' },
  { name: 'Orkadiéré', zone: 'Kanel', relayStore: 'Magasin Coopératif Orkadiéré' },
  { name: 'Ounaré', zone: 'Hamady Ounaré', relayStore: 'Magasin Coopératif Hamady Ounaré' },
  { name: 'Ndendory', zone: 'Hamady Ounaré', relayStore: 'Point Relais Ndendory' },
  { name: 'Sinthiou Bamambé', zone: 'Hamady Ounaré', relayStore: 'Magasin Sinthiou Bamambé' },
  { name: 'Séno Palel', zone: 'Kanel', relayStore: 'Point Relais Semmé' },
  { name: 'Foumihara Diamwelly', zone: 'Kanel', relayStore: 'Magasin Coopératif Kanel' },
  { name: 'Kanel', zone: 'Kanel', relayStore: 'Magasin Coopératif Kanel' },
  { name: 'Sinthiane', zone: 'Hamady Ounaré', relayStore: 'Point Relais Hamady Ounaré' },
  { name: 'Sinthiou Garba', zone: 'Matam', relayStore: 'Point Relais Sinthiou Garba' },
  { name: 'Ogo', zone: 'Matam', relayStore: 'Magasin Coopératif Ogo (Matam)' }
];

export interface AgriPackage {
  id: string;
  name: string;
  category: PackageCategory;
  categoryLabel: string;
  formatLabel: string;
  surfaceHa: number;
  surfaceLabel: string;
  priceFcfa: number;
  minWeeklyFcfa: number;
  imageUrl: string;
  deliveryWindow: string;
  expectedYieldKg: number;
  traditionalYieldKg: number;
  yieldIncreasePct: number;
  estimatedNetGainFcfa: number;
  description: string;
  includedItems: string[];
  agronomicMethod: string;
}

export interface SubscribedPlan {
  id: string;
  packageId: string;
  packageName: string;
  categoryLabel: string;
  surfaceLabel: string;
  targetFcfa: number;
  savedFcfa: number;
  deliveryHub: string;
  deliveryDate: string;
  status: 'En cours' | 'Complété — Prêt à livrer';
  lastPaymentDate: string;
  includedItems: string[];
}

export type PaymentChannel =
  | 'Paiement Espèces'
  | 'Wave Mobile Money'
  | 'Orange Money'
  | 'Free Money'
  | 'Bonus Parrainage Voisin';

export interface DepositTransaction {
  id: string;
  reference: string;
  date: string;
  amountFcfa: number;
  channel: PaymentChannel;
  voucherCode?: string;
  phoneNumber?: string;
  planId: string;
  planName: string;
  villageAgent: string;
}

export interface ScratchVoucher {
  code: string;
  amountFcfa: number;
  batchId: string;
  isScratched: boolean;
  isRedeemed: boolean;
  pointOfSale: string;
}

export interface VillageFarmerRecord {
  id: string;
  codeProducteur: string;
  fullName: string;
  village: string;
  zone: InterventionZone;
  phone: string;
  packageName: string;
  targetFcfa: number;
  savedFcfa: number;
  trainingsCompleted: number;
  totalTrainings: number;
  lastDepositDate: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  seasonPhase: string;
  durationMinutes: number;
  keyPractice: string;
  expectedImpact: string;
  completed: boolean;
  nextSessionDate: string;
  steps: string[];
}

export type SmsThresholdType = '50%' | '90%' | '100%';

export interface SmsNotification {
  id: string;
  timestamp: string;
  recipientName: string;
  recipientPhone: string;
  planId: string;
  planName: string;
  threshold: SmsThresholdType;
  progressPct: number;
  savedFcfa: number;
  targetFcfa: number;
  remainingFcfa: number;
  messageBody: string;
  isUnread: boolean;
}

export const HERO_IMAGE_URL = '/src/assets/images/hero_farmer_harvest_1791514603938.jpg';

export const AGRI_PACKAGES: AgriPackage[] = [
  {
    id: 'pack-laitue-5000',
    name: 'Pack Laitue — Grand Format (5 000 F)',
    category: 'laitue',
    categoryLabel: 'Laitue · Variété EDEN (25 g)',
    formatLabel: 'Pack 5 000 FCFA',
    surfaceHa: 0.02,
    surfaceLabel: '10 Planches (100 m²)',
    priceFcfa: 5000,
    minWeeklyFcfa: 500,
    imageUrl: '/src/assets/images/pack_laitue_fouta_1791575858960.jpg',
    deliveryWindow: 'Campagne 2027 · Livraison sous 7 jours',
    expectedYieldKg: 180,
    traditionalYieldKg: 95,
    yieldIncreasePct: 89,
    estimatedNetGainFcfa: 45000,
    description:
      'Kit complet de semences certifiées de Laitue Variété EDEN (25 g) résistante à la chaleur de Matam, Hamady Ounaré, Kanel et Bakel, avec bio-compost enrichi.',
    includedItems: [
      'Sachet 25 g de semences certifiées Laitue Variété EDEN (haute germination)',
      '10 kg de compost organique tamisé spécial pépinière et repiquage',
      '1 kg d’engrais d’appoint micro-dosé NPK 10-10-20',
      '1 plantoir de repiquage en bois & fiche technique d’ombrage'
    ],
    agronomicMethod: 'Semis de la variété EDEN (25 g) en pépinière ombragée pendant 21 jours puis repiquage à 25 cm × 25 cm avec paillage.'
  },
  {
    id: 'pack-laitue-2000',
    name: 'Pack Laitue — Format Découverte (2 000 F)',
    category: 'laitue',
    categoryLabel: 'Laitue · Variété EDEN (25 g)',
    formatLabel: 'Pack 2 000 FCFA',
    surfaceHa: 0.01,
    surfaceLabel: '4 Planches (40 m²)',
    priceFcfa: 2000,
    minWeeklyFcfa: 250,
    imageUrl: '/src/assets/images/pack_laitue_fouta_1791575858960.jpg',
    deliveryWindow: 'Campagne 2027 · Livraison sous 7 jours',
    expectedYieldKg: 75,
    traditionalYieldKg: 40,
    yieldIncreasePct: 88,
    estimatedNetGainFcfa: 18500,
    description:
      'Format accessible avec semences certifiées Laitue Variété EDEN (25 g) pour démarrer 4 planches de laitue croquante au périmètre maraîcher villageois.',
    includedItems: [
      'Sachet 25 g de semences certifiées Laitue Variété EDEN résistante à la chaleur',
      '4 kg de compost organique enrichi pour pépinière',
      '400 g d’engrais micro-dosé spécial feuillage',
      'Fiche pratique d’arrosage fractionné matin et soir'
    ],
    agronomicMethod: 'Arrosage doux en pluie fine et binage léger chaque semaine pour aérer les racines de la Laitue EDEN.'
  },
  {
    id: 'pack-bissap-5000',
    name: 'Pack Bissap Blanc — Grand Format (5 000 F)',
    category: 'bissap',
    categoryLabel: 'Bissap Blanc',
    formatLabel: 'Pack 5 000 FCFA',
    surfaceHa: 0.05,
    surfaceLabel: 'Parcelle 500 m²',
    priceFcfa: 5000,
    minWeeklyFcfa: 500,
    imageUrl: '/src/assets/images/pack_bissap_blanc_1791575869509.jpg',
    deliveryWindow: 'Campagne 2027 · Hivernage & Contre-saison',
    expectedYieldKg: 140,
    traditionalYieldKg: 75,
    yieldIncreasePct: 87,
    estimatedNetGainFcfa: 52000,
    description:
      'Semences triées de Bissap Blanc du Fouta à gros calices charnus et feuilles tendres, très prisé sur les marchés de Matam, Hamady Ounaré et Bakel.',
    includedItems: [
      '500 g de semences certifiées Bissap Blanc (variété locale sélectionnée)',
      '10 kg de bio-fertilisant organique riche en phosphore et potasse',
      'Sachet de poudre de feuilles de neem pour protection naturelle des feuilles',
      'Formation au pincement des tiges pour doubler le nombre de calices'
    ],
    agronomicMethod: 'Semis en poquets espacés de 60 cm × 40 cm avec micro-dose de compost au fond du poquet.'
  },
  {
    id: 'pack-bissap-2000',
    name: 'Pack Bissap Blanc — Format Découverte (2 000 F)',
    category: 'bissap',
    categoryLabel: 'Bissap Blanc',
    formatLabel: 'Pack 2 000 FCFA',
    surfaceHa: 0.02,
    surfaceLabel: 'Parcelle 200 m²',
    priceFcfa: 2000,
    minWeeklyFcfa: 250,
    imageUrl: '/src/assets/images/pack_bissap_blanc_1791575869509.jpg',
    deliveryWindow: 'Campagne 2027 · Hivernage & Contre-saison',
    expectedYieldKg: 60,
    traditionalYieldKg: 32,
    yieldIncreasePct: 88,
    estimatedNetGainFcfa: 21000,
    description:
      'Format économique de Bissap Blanc pour bordures de champs ou jardins de case, assurant feuilles et calices de qualité.',
    includedItems: [
      '200 g de semences sélectionnées de Bissap Blanc',
      '4 kg de bio-fertilisant organique',
      'Doseur calibré pour micro-dosage au poquet',
      'Guide de séchage hygiénique des calices sur claie'
    ],
    agronomicMethod: 'Éclaircissage à 2 plants par poquet 15 jours après la levée.'
  },
  {
    id: 'pack-oignons-6000',
    name: 'Pack Oignons — Grand Format (6 000 F)',
    category: 'oignons',
    categoryLabel: 'Oignon · Variété SAFARI (30 g)',
    formatLabel: 'Pack 6 000 FCFA',
    surfaceHa: 0.03,
    surfaceLabel: '12 Planches (120 m²)',
    priceFcfa: 6000,
    minWeeklyFcfa: 600,
    imageUrl: '/src/assets/images/pack_oignons_galmi_1791575878942.jpg',
    deliveryWindow: 'Campagne 2027 · Octobre – Février',
    expectedYieldKg: 320,
    traditionalYieldKg: 170,
    yieldIncreasePct: 88,
    estimatedNetGainFcfa: 68000,
    description:
      'Semences certifiées d’Oignon Variété SAFARI (30 g) à haut calibre adaptées aux périmètres irrigués de Matam, Kanel, Hamady Ounaré et Bakel.',
    includedItems: [
      'Sachet 30 g de semences certifiées Oignon Variété SAFARI (haut pouvoir germinatif)',
      '5 kg d’engrais spécial bulbes NPK 10-20-20 faible en azote tardif',
      '8 kg de fumure organique bien décomposée',
      'Formation au sevrage hydrique avant récolte pour éviter la pourriture'
    ],
    agronomicMethod: 'Repiquage de l’Oignon SAFARI à 15 cm × 10 cm à faible profondeur (collet affleurant) et arrêt d’eau 15 jours avant récolte.'
  },
  {
    id: 'pack-oignons-2500',
    name: 'Pack Oignons — Format Découverte (2 500 F)',
    category: 'oignons',
    categoryLabel: 'Oignon · Variété SAFARI (30 g)',
    formatLabel: 'Pack 2 500 FCFA',
    surfaceHa: 0.012,
    surfaceLabel: '5 Planches (50 m²)',
    priceFcfa: 2500,
    minWeeklyFcfa: 250,
    imageUrl: '/src/assets/images/pack_oignons_galmi_1791575878942.jpg',
    deliveryWindow: 'Campagne 2027 · Octobre – Février',
    expectedYieldKg: 135,
    traditionalYieldKg: 72,
    yieldIncreasePct: 87,
    estimatedNetGainFcfa: 28000,
    description:
      'Pack découverte d’Oignon Variété SAFARI (30 g) conçu pour les parcelles individuelles des groupements féminins des villages du Fouta.',
    includedItems: [
      'Sachet 30 g de semences certifiées Oignon Variété SAFARI',
      '2 kg d’engrais spécial bulbes NPK 10-20-20',
      '3 kg de compost organique tamisé',
      'Gabarit d’espacement 15 cm × 10 cm'
    ],
    agronomicMethod: 'Binages réguliers toutes les 2 semaines pour favoriser le grossissement homogène du bulbe SAFARI.'
  },
  {
    id: 'pack-poules-8000',
    name: 'Pack Poules Villageoises — Unité Complète (8 000 F)',
    category: 'poules',
    categoryLabel: 'Élevage Poules',
    formatLabel: 'Pack 8 000 FCFA',
    surfaceHa: 0.01,
    surfaceLabel: 'Lot Avicole Familial',
    priceFcfa: 8000,
    minWeeklyFcfa: 800,
    imageUrl: '/src/assets/images/pack_volaille_villageoise_1791514645385.jpg',
    deliveryWindow: 'Livraison mensuelle toute l’année',
    expectedYieldKg: 45,
    traditionalYieldKg: 20,
    yieldIncreasePct: 125,
    estimatedNetGainFcfa: 38000,
    description:
      'Pack avicole résilient comprenant des sujets vaccinés contre la maladie de Newcastle, aliment de démarrage riche et abreuvoir.',
    includedItems: [
      'Sujets rustiques vaccinés contre Newcastle (souche résistante à la chaleur)',
      '5 kg d’aliment démarrage complet riche en protéines et calcium',
      '1 abreuvoir siphoïde hygiénique & 1 bloc minéral vitaminé',
      'Suivi par l’auxiliaire vétérinaire villageois de FOUT’AGRO'
    ],
    agronomicMethod: 'Rappel vaccinal thermostable I-2 et distribution d’eau propre renouvelée deux fois par jour.'
  }
];

export const INITIAL_SUBSCRIBED_PLANS: SubscribedPlan[] = [
  {
    id: 'plan-101',
    packageId: 'pack-oignons-6000',
    packageName: 'Pack Oignons — Grand Format (6 000 F)',
    categoryLabel: 'Oignon · Variété SAFARI (30 g)',
    surfaceLabel: '12 Planches (120 m²)',
    targetFcfa: 6000,
    savedFcfa: 5400,
    deliveryHub: 'Magasin Coopératif Hamady Ounaré (Sinthiane Dioudé)',
    deliveryDate: '15 Mai 2027',
    status: 'En cours',
    lastPaymentDate: '08 Oct 2026',
    includedItems: [
      '30 g Semences Oignon Variété SAFARI',
      '5 kg Engrais bulbes NPK 10-20-20',
      '8 kg Fumure organique tamisée'
    ]
  },
  {
    id: 'plan-102',
    packageId: 'pack-laitue-5000',
    packageName: 'Pack Laitue — Grand Format (5 000 F)',
    categoryLabel: 'Laitue · Variété EDEN (25 g)',
    surfaceLabel: '10 Planches (100 m²)',
    targetFcfa: 5000,
    savedFcfa: 5000,
    deliveryHub: 'Magasin Coopératif de Matam (Ogo)',
    deliveryDate: '10 Mai 2027',
    status: 'Complété — Prêt à livrer',
    lastPaymentDate: '02 Oct 2026',
    includedItems: [
      '25 g Semences Laitue Variété EDEN',
      '10 kg Compost pépinière',
      '1 kg Engrais NPK & plantoir'
    ]
  },
  {
    id: 'plan-103',
    packageId: 'pack-bissap-2000',
    packageName: 'Pack Bissap Blanc — Format Découverte (2 000 F)',
    categoryLabel: 'Bissap Blanc',
    surfaceLabel: 'Parcelle 200 m²',
    targetFcfa: 2000,
    savedFcfa: 1000,
    deliveryHub: 'Point Relais de Ganguel Soulé (Kanel)',
    deliveryDate: '18 Mai 2027',
    status: 'En cours',
    lastPaymentDate: '06 Oct 2026',
    includedItems: [
      '200 g Semences Bissap Blanc',
      '4 kg Bio-fertilisant organique',
      'Doseur calibré & guide séchage'
    ]
  },
  {
    id: 'plan-104',
    packageId: 'pack-poules-8000',
    packageName: 'Pack Poules Villageoises — Unité Complète (8 000 F)',
    categoryLabel: 'Élevage Poules',
    surfaceLabel: 'Lot Avicole Familial',
    targetFcfa: 8000,
    savedFcfa: 3500,
    deliveryHub: 'Magasin Coopératif Hamady Ounaré',
    deliveryDate: '20 Mai 2027',
    status: 'En cours',
    lastPaymentDate: '04 Oct 2026',
    includedItems: [
      'Sujets vaccinés Newcastle',
      '5 kg Aliment démarrage complet',
      'Abreuvoir hygiénique & bloc minéral'
    ]
  }
];

export const INITIAL_SMS_NOTIFICATIONS: SmsNotification[] = [
  {
    id: 'sms-300',
    timestamp: '03 Mai 2027 (Programmation J-7) · Actif',
    recipientName: 'Aïssata Tall',
    recipientPhone: '+221 77 412 89 30',
    planId: 'plan-102',
    planName: 'Pack Laitue — Grand Format (5 000 F)',
    threshold: '100%',
    progressPct: 100,
    savedFcfa: 5000,
    targetFcfa: 5000,
    remainingFcfa: 0,
    messageBody:
      'FOUT’AGRO RAPPEL J-7 LIVRAISON & RÉCOLTE : Bonjour Aïssata Tall, votre « Pack Laitue — Grand Format (5 000 F) » (100% financé) sera livré dans 7 jours (le 10 Mai 2027) au Magasin Coopératif de Matam (Ogo). Préparez vos 10 planches et l’ombrière de pépinière pour garantir une récolte optimale de 180 kg dès fin juin (Code retrait : BON-FT-102).',
    isUnread: true
  },
  {
    id: 'sms-301',
    timestamp: '08 Oct 2026 · 14:23',
    recipientName: 'Aïssata Tall',
    recipientPhone: '+221 77 412 89 30',
    planId: 'plan-101',
    planName: 'Pack Oignons — Grand Format (6 000 F)',
    threshold: '90%',
    progressPct: 90,
    savedFcfa: 5400,
    targetFcfa: 6000,
    remainingFcfa: 600,
    messageBody:
      'FOUT’AGRO ALERTE 90% : Bravo Aïssata Tall ! Vous avez atteint 90% (5 400 FCFA / 6 000 FCFA) sur votre « Pack Oignons — Grand Format (6 000 F) ». Il ne vous reste plus que 600 FCFA à cotiser pour débloquer votre bon de livraison au Magasin de Hamady Ounaré.',
    isUnread: true
  },
  {
    id: 'sms-302',
    timestamp: '06 Oct 2026 · 09:16',
    recipientName: 'Aïssata Tall',
    recipientPhone: '+221 77 412 89 30',
    planId: 'plan-103',
    planName: 'Pack Bissap Blanc — Format Découverte (2 000 F)',
    threshold: '50%',
    progressPct: 50,
    savedFcfa: 1000,
    targetFcfa: 2000,
    remainingFcfa: 1000,
    messageBody:
      'FOUT’AGRO RAPPEL 50% : Félicitations Aïssata Tall, vous êtes à mi-parcours (50% · 1 000 FCFA / 2 000 FCFA) sur votre « Pack Bissap Blanc — Format Découverte (2 000 F) ». Continuez votre épargne hebdomadaire (reste : 1 000 FCFA) par paiement espèces ou via *456#.',
    isUnread: false
  }
];

export function createThresholdSmsNotification(params: {
  recipientName: string;
  recipientPhone: string;
  planId: string;
  planName: string;
  threshold: SmsThresholdType;
  savedFcfa: number;
  targetFcfa: number;
}): SmsNotification {
  const remaining = Math.max(0, params.targetFcfa - params.savedFcfa);
  const pct = Math.min(100, Math.round((params.savedFcfa / params.targetFcfa) * 100));

  let messageBody = '';
  if (params.threshold === '50%') {
    messageBody = `FOUT’AGRO RAPPEL 50% : Félicitations ${params.recipientName}, vous êtes à mi-parcours (${pct}% · ${formatFcfa(
      params.savedFcfa
    )} / ${formatFcfa(params.targetFcfa)}) sur votre « ${
      params.planName
    } ». Continuez votre épargne progressive (reste : ${formatFcfa(
      remaining
    )}) par paiement espèces ou via *456#.`;
  } else if (params.threshold === '90%') {
    messageBody = `FOUT’AGRO ALERTE 90% : Bravo ${params.recipientName} ! Vous avez atteint ${pct}% (${formatFcfa(
      params.savedFcfa
    )} / ${formatFcfa(params.targetFcfa)}) sur votre « ${
      params.planName
    } ». Dernière ligne droite : il ne reste plus que ${formatFcfa(
      remaining
    )} avant la validation de votre livraison au village !`;
  } else {
    messageBody = `FOUT’AGRO RAPPEL J-7 LIVRAISON & RÉCOLTE : Félicitations ${params.recipientName}, votre paquet « ${
      params.planName
    } » est 100% financé (${formatFcfa(
      params.targetFcfa
    )}). Livraison prévue dans 7 jours au magasin coopératif FOUT’AGRO. Préparez vos planches dès aujourd’hui pour maximiser votre récolte !`;
  }

  return {
    id: `sms-${Date.now()}-${Math.floor(100 + Math.random() * 899)}`,
    timestamp: '09 Oct 2026 · À l’instant',
    recipientName: params.recipientName,
    recipientPhone: params.recipientPhone,
    planId: params.planId,
    planName: params.planName,
    threshold: params.threshold,
    progressPct: pct,
    savedFcfa: params.savedFcfa,
    targetFcfa: params.targetFcfa,
    remainingFcfa: remaining,
    messageBody,
    isUnread: true
  };
}

export const INITIAL_TRANSACTIONS: DepositTransaction[] = [
  {
    id: 'tx-901',
    reference: 'FOUTA-2026-8841',
    date: '08 Oct 2026 · 14:22',
    amountFcfa: 1400,
    channel: 'Paiement Espèces',
    voucherCode: 'ESP-8492-3104',
    planId: 'plan-101',
    planName: 'Pack Oignons — Grand Format (6 000 F)',
    villageAgent: 'Amadou Ba (EV Hamady Ounaré)'
  },
  {
    id: 'tx-902',
    reference: 'FOUTA-2026-8790',
    date: '06 Oct 2026 · 09:15',
    amountFcfa: 500,
    channel: 'Wave Mobile Money',
    phoneNumber: '+221 77 412 89 30',
    planId: 'plan-103',
    planName: 'Pack Bissap Blanc — Format Découverte (2 000 F)',
    villageAgent: 'Auto-versement USSD *456#'
  },
  {
    id: 'tx-903',
    reference: 'FOUTA-2026-8612',
    date: '04 Oct 2026 · 17:40',
    amountFcfa: 1500,
    channel: 'Paiement Espèces',
    voucherCode: 'ESP-5519-0923',
    planId: 'plan-104',
    planName: 'Pack Poules Villageoises — Unité Complète (8 000 F)',
    villageAgent: 'Amadou Ba (EV Sinthiane Dioudé)'
  },
  {
    id: 'tx-904',
    reference: 'FOUTA-2026-8405',
    date: '02 Oct 2026 · 11:08',
    amountFcfa: 2000,
    channel: 'Orange Money',
    phoneNumber: '+221 77 412 89 30',
    planId: 'plan-102',
    planName: 'Pack Laitue — Grand Format (5 000 F)',
    villageAgent: 'Auto-versement Mobile'
  },
  {
    id: 'tx-905',
    reference: 'FOUTA-2026-8199',
    date: '25 Sep 2026 · 16:05',
    amountFcfa: 2000,
    channel: 'Paiement Espèces',
    voucherCode: 'ESP-3901-6620',
    planId: 'plan-101',
    planName: 'Pack Oignons — Grand Format (6 000 F)',
    villageAgent: 'Point Relais Ganguel Soulé'
  }
];

export const INITIAL_SCRATCH_VOUCHERS: ScratchVoucher[] = [
  {
    code: 'ESP-4920-8173',
    amountFcfa: 500,
    batchId: 'QUITTANCE-OUN-01',
    isScratched: true,
    isRedeemed: false,
    pointOfSale: 'Point Relais Hamady Ounaré (Amadou Ba)'
  },
  {
    code: 'ESP-7318-9042',
    amountFcfa: 1000,
    batchId: 'QUITTANCE-OUN-02',
    isScratched: true,
    isRedeemed: false,
    pointOfSale: 'Coopérative Agricole de Sinthiane Dioudé'
  },
  {
    code: 'ESP-6045-2289',
    amountFcfa: 2000,
    batchId: 'QUITTANCE-KAN-03',
    isScratched: true,
    isRedeemed: false,
    pointOfSale: 'Point Relais Orkadiéré & Semmé (Kanel)'
  },
  {
    code: 'ESP-9182-4407',
    amountFcfa: 2500,
    batchId: 'QUITTANCE-MAT-04',
    isScratched: true,
    isRedeemed: false,
    pointOfSale: 'Magasin Coopératif de Matam & Ogo'
  }
];

export const INITIAL_VILLAGE_COHORT: VillageFarmerRecord[] = [
  {
    id: 'vf-1',
    codeProducteur: 'FT-OUN-48291',
    fullName: 'Aïssata Tall',
    village: 'Sinthiane Dioudé',
    zone: 'Hamady Ounaré',
    phone: '+221 77 412 89 30',
    packageName: 'Oignons (6 000 F) + Laitue (5 000 F) + Bissap (2 000 F) + Poules (8 000 F)',
    targetFcfa: 21000,
    savedFcfa: 14900,
    trainingsCompleted: 3,
    totalTrainings: 4,
    lastDepositDate: '08 Oct 2026'
  },
  {
    id: 'vf-2',
    codeProducteur: 'FT-KAN-48304',
    fullName: 'Mamadou Ly',
    village: 'Ganguel Soulé',
    zone: 'Kanel',
    phone: '+221 76 589 12 44',
    packageName: 'Pack Oignons — Grand Format (6 000 F)',
    targetFcfa: 6000,
    savedFcfa: 6000,
    trainingsCompleted: 4,
    totalTrainings: 4,
    lastDepositDate: '05 Oct 2026'
  },
  {
    id: 'vf-3',
    codeProducteur: 'FT-MAT-48319',
    fullName: 'Hawa Dia',
    village: 'Ogo',
    zone: 'Matam',
    phone: '+221 77 803 45 19',
    packageName: 'Pack Laitue (5 000 F) + Pack Bissap Blanc (5 000 F)',
    targetFcfa: 10000,
    savedFcfa: 8500,
    trainingsCompleted: 3,
    totalTrainings: 4,
    lastDepositDate: '06 Oct 2026'
  },
  {
    id: 'vf-4',
    codeProducteur: 'FT-KAN-48352',
    fullName: 'Oumar Kane',
    village: 'Orkadiéré',
    zone: 'Kanel',
    phone: '+221 78 219 60 08',
    packageName: 'Pack Poules Villageoises (8 000 F)',
    targetFcfa: 8000,
    savedFcfa: 8000,
    trainingsCompleted: 4,
    totalTrainings: 4,
    lastDepositDate: '03 Oct 2026'
  },
  {
    id: 'vf-5',
    codeProducteur: 'FT-KAN-48388',
    fullName: 'Mariam Sy',
    village: 'Waoundé',
    zone: 'Kanel',
    phone: '+221 77 934 11 72',
    packageName: 'Pack Oignons — Format Découverte (2 500 F)',
    targetFcfa: 2500,
    savedFcfa: 2000,
    trainingsCompleted: 2,
    totalTrainings: 4,
    lastDepositDate: '01 Oct 2026'
  },
  {
    id: 'vf-6',
    codeProducteur: 'FT-BAK-48410',
    fullName: 'Abdoulaye Wane',
    village: 'Balel',
    zone: 'Bakel',
    phone: '+221 70 611 38 95',
    packageName: 'Pack Bissap Blanc — Grand Format (5 000 F)',
    targetFcfa: 5000,
    savedFcfa: 2000,
    trainingsCompleted: 2,
    totalTrainings: 4,
    lastDepositDate: '29 Sep 2026'
  },
  {
    id: 'vf-7',
    codeProducteur: 'FT-OUN-48442',
    fullName: 'Fatimata Ka',
    village: 'Sinthiou Bamambé',
    zone: 'Hamady Ounaré',
    phone: '+221 77 319 04 52',
    packageName: 'Pack Laitue — Format Découverte (2 000 F)',
    targetFcfa: 2000,
    savedFcfa: 1500,
    trainingsCompleted: 3,
    totalTrainings: 4,
    lastDepositDate: '07 Oct 2026'
  },
  {
    id: 'vf-8',
    codeProducteur: 'FT-KAN-48479',
    fullName: 'Ibrahima Konté',
    village: 'Semmé',
    zone: 'Kanel',
    phone: '+221 76 408 71 19',
    packageName: 'Pack Oignons — Grand Format (6 000 F)',
    targetFcfa: 6000,
    savedFcfa: 4500,
    trainingsCompleted: 3,
    totalTrainings: 4,
    lastDepositDate: '07 Oct 2026'
  }
];

export const INITIAL_TRAINING_MODULES: TrainingSession[] = [
  {
    id: 'tr-1',
    title: '01. Pépinière ombragée & repiquage de la Laitue Variété EDEN 25 g (Packs 2 000 F & 5 000 F)',
    seasonPhase: 'Mise en place (Octobre)',
    durationMinutes: 45,
    keyPractice: 'Protéger la pépinière de Laitue EDEN (25 g) sous ombrière pendant 21 jours et repiquer à 25 cm × 25 cm en fin d’après-midi.',
    expectedImpact: '+90% de reprise des plants et pommes de laitue EDEN denses sans montée en graines précoce.',
    completed: true,
    nextSessionDate: 'Complété · Champ-École Sinthiane Dioudé',
    steps: [
      'Préparer un lit de semence finement émietté enrichi avec le compost du pack FOUT’AGRO.',
      'Semer le sachet de 25 g de Laitue Variété EDEN en lignes espacées de 10 cm à 0,5 cm de profondeur sous ombrière.',
      'Arroser matin et soir en pluie fine jusqu’au stade 4 à 5 vraies feuilles (21 jours).',
      'Repiquer au champ à 25 cm × 25 cm sans enterrer le cœur de la jeune laitue EDEN.'
    ]
  },
  {
    id: 'tr-2',
    title: '02. Conduite du Bissap Blanc & pincement des tiges (Packs 2 000 F & 5 000 F)',
    seasonPhase: 'Croissance végétative',
    durationMinutes: 50,
    keyPractice: 'Apporter une micro-dose de bio-fertilisant au poquet et pincer le bourgeon terminal à 35 jours.',
    expectedImpact: '+85% de calices blancs charnus par pied et meilleure résistance aux ravageurs.',
    completed: true,
    nextSessionDate: 'Complété · Champ-École Ganguel Soulé & Ounaré',
    steps: [
      'Creuser des poquets espacés de 60 cm entre les lignes et 40 cm sur la ligne.',
      'Déposer une poignée de bio-fertilisant au fond du poquet, recouvrir d’un peu de terre puis semer 3 graines.',
      'Démarier à 15 jours pour conserver les 2 plants les plus vigoureux.',
      'Pincer l’extrémité de la tige principale à 35 jours pour stimuler les ramifications porteuses de calices.'
    ]
  },
  {
    id: 'tr-3',
    title: '03. Bulbaison de l’Oignon Variété SAFARI 30 g (Packs 2 500 F & 6 000 F)',
    seasonPhase: 'Grossissement des bulbes',
    durationMinutes: 40,
    keyPractice: 'Repiquer les plants d’Oignon Variété SAFARI (30 g) peu profondément (collet affleurant) et appliquer l’engrais NPK 10-20-20 au binage.',
    expectedImpact: 'Bulbes SAFARI fermes de gros calibre et conservation prolongée de 5 à 6 mois sans pourriture.',
    completed: true,
    nextSessionDate: 'Complété · Périmètre Waoundé & Semmé',
    steps: [
      'Semer le sachet de 30 g d’Oignon Variété SAFARI en pépinière puis repiquer à 15 cm × 10 cm (collet affleurant).',
      'Réaliser un binage superficiel toutes les 2 semaines pour casser la croûte du sol et aérer le bulbe.',
      'Apporter l’engrais spécial bulbes à 20 et 45 jours après repiquage.',
      'Stopper totalement l’irrigation 15 jours avant la récolte lorsque 50% des fanes tombent.'
    ]
  },
  {
    id: 'tr-4',
    title: '04. Biosécurité & vaccination des Poules Villageoises (Pack 8 000 F)',
    seasonPhase: 'Suivi mensuel',
    durationMinutes: 45,
    keyPractice: 'Maintenir l’abreuvoir siphoïde propre à l’ombre et respecter le rappel vaccinal Newcastle I-2.',
    expectedImpact: 'Taux de survie supérieur à 92% et ponte régulière toute l’année.',
    completed: false,
    nextSessionDate: '16 Oct 2026 · Centre FOUT’AGRO Orkadiéré & Matam',
    steps: [
      'Installer l’abreuvoir siphoïde sur deux briques plates à l’ombre pour éviter les souillures de litière.',
      'Distribuer l’aliment démarrage riche en protéines le matin et compléter avec le bloc minéral.',
      'Nettoyer le poulailler chaque semaine et saupoudrer de la cendre de bois dans les nids contre les parasites.',
      'Administrer une goutte oculaire du vaccin thermostable I-2 tous les 3 mois.'
    ]
  }
];

export type ReferralStatus =
  | 'Invitation envoyée (SMS)'
  | 'Validé — Bonus prêt'
  | 'Crédité sur paquet';

export interface ReferralRecord {
  id: string;
  referralCode: string;
  neighborName: string;
  neighborPhone: string;
  village: string;
  zone: InterventionZone;
  packageLabel: string;
  bonusFcfa: number;
  status: ReferralStatus;
  creditedPlanId?: string;
  creditedPlanName?: string;
  createdAt: string;
}

export function generateUniqueReferralCode(zone: InterventionZone): string {
  const prefixMap: Record<InterventionZone, string> = {
    'Hamady Ounaré': 'OUN',
    Matam: 'MAT',
    Kanel: 'KAN',
    Bakel: 'BAK'
  };
  const zoneCode = prefixMap[zone] || 'FT';
  const randNum = Math.floor(100 + Math.random() * 900);
  const randAlpha = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `PARRAIN-${zoneCode}-${randNum}${randAlpha}`;
}

export const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: 'ref-101',
    referralCode: 'PARRAIN-OUN-842K',
    neighborName: 'Mariama Kane',
    neighborPhone: '+221 77 618 40 22',
    village: 'Sinthiane Dioudé',
    zone: 'Hamady Ounaré',
    packageLabel: 'Pack Oignons — Grand Format (6 000 F · SAFARI 30 g)',
    bonusFcfa: 500,
    status: 'Crédité sur paquet',
    creditedPlanId: 'plan-101',
    creditedPlanName: 'Pack Oignons — Grand Format (6 000 F)',
    createdAt: '04 Oct 2026'
  },
  {
    id: 'ref-102',
    referralCode: 'PARRAIN-OUN-519B',
    neighborName: 'Samba Diallo',
    neighborPhone: '+221 78 309 15 84',
    village: 'Dioudé',
    zone: 'Hamady Ounaré',
    packageLabel: 'Pack Laitue — Grand Format (5 000 F · EDEN 25 g)',
    bonusFcfa: 500,
    status: 'Validé — Bonus prêt',
    createdAt: '07 Oct 2026'
  },
  {
    id: 'ref-103',
    referralCode: 'PARRAIN-KAN-307M',
    neighborName: 'Khadija Sy',
    neighborPhone: '+221 76 492 71 03',
    village: 'Ganguel Soulé',
    zone: 'Kanel',
    packageLabel: 'Pack Bissap Blanc — Format Découverte (2 000 F)',
    bonusFcfa: 500,
    status: 'Invitation envoyée (SMS)',
    createdAt: '09 Oct 2026'
  }
];

export function formatFcfa(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
}


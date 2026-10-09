import React, { useState } from 'react';
import { InterventionZone } from '../data/agroData';
import { Calendar, Leaf, Sprout, Send, Check } from 'lucide-react';

export type CalendarCropKey = 'laitue' | 'bissap' | 'oignons';

export type MonthPhase = 'NONE' | 'PREP' | 'SOWING' | 'GROWTH' | 'HARVEST';

export interface CropZoneSchedule {
  crop: CalendarCropKey;
  cropName: string;
  packPrices: string;
  cycleDays: string;
  soilPrepDates: string;
  optimalSowingDates: string;
  transplantOrThinningDates: string;
  expectedHarvestDates: string;
  secondWindowSowingDates: string;
  climaticNote: string;
  // 12 months starting from October (Campaign start): Oct, Nov, Déc, Jan, Fév, Mar, Avr, Mai, Juin, Juil, Août, Sep
  monthlyPhases: MonthPhase[];
}

export interface ClimaticZoneCalendar {
  zone: InterventionZone;
  climateZoneLabel: string;
  thermalProfile: string;
  villagesSummary: string;
  schedules: Record<CalendarCropKey, CropZoneSchedule>;
}

const CAMPAIGN_MONTHS = [
  'Oct',
  'Nov',
  'Déc',
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sep'
];

const CLIMATIC_CALENDAR_DATA: Record<InterventionZone, ClimaticZoneCalendar> = {
  Matam: {
    zone: 'Matam',
    climateZoneLabel: 'Zone Climatique Walo & Vallée Alluviale (Matam)',
    thermalProfile: 'Nuits fraîches (18–22°C d’Oct à Fév) · Humidité fluviale élevée',
    villagesSummary:
      'Ganguel Soulé · Goumal · Ngano · Orndoldé · Thially · Ogo · Sinthiane · Bapalel · Dialloubé',
    schedules: {
      laitue: {
        crop: 'laitue',
        cropName: 'Laitue — Variété EDEN (25 g)',
        packPrices: '5 000 F & 2 000 F',
        cycleDays: '45 jours',
        soilPrepDates: '05 Oct – 12 Oct',
        optimalSowingDates: '12 Oct – 25 Nov (1er cycle)',
        transplantOrThinningDates: '02 Nov – 15 Déc (à J+21)',
        expectedHarvestDates: '28 Nov – 20 Jan',
        secondWindowSowingDates: '10 Jan – 15 Fév (2e cycle froid)',
        climaticNote:
          'Dans le Walo de Matam, la fraîcheur nocturne dès mi-octobre permet d’enchaîner 2 cycles consécutifs de Laitue Variété EDEN (25 g) sans montée en graines.',
        monthlyPhases: [
          'SOWING',  // Oct
          'GROWTH',  // Nov
          'HARVEST', // Déc
          'SOWING',  // Jan
          'HARVEST', // Fév
          'NONE',    // Mar
          'NONE',    // Avr
          'NONE',    // Mai
          'NONE',    // Juin
          'NONE',    // Juil
          'NONE',    // Août
          'PREP'     // Sep
        ]
      },
      bissap: {
        crop: 'bissap',
        cropName: 'Bissap Blanc (variété Vimto / Koor)',
        packPrices: '5 000 F & 2 000 F',
        cycleDays: '95 jours',
        soilPrepDates: '10 Oct – 20 Oct',
        optimalSowingDates: '20 Oct – 15 Nov (Contre-saison)',
        transplantOrThinningDates: '05 Nov – 25 Nov (Démariage 2 plants/poquet)',
        expectedHarvestDates: '25 Jan – 28 Fév',
        secondWindowSowingDates: '15 Juin – 20 Juil (Hivernage principal)',
        climaticNote:
          'Semis direct en poquets (40 × 40 cm) sur sols alluviaux ressuyés en octobre ou dès la première pluie utile de juin-juillet.',
        monthlyPhases: [
          'SOWING',  // Oct
          'GROWTH',  // Nov
          'GROWTH',  // Déc
          'HARVEST', // Jan
          'HARVEST', // Fév
          'NONE',    // Mar
          'NONE',    // Avr
          'PREP',    // Mai
          'SOWING',  // Juin
          'GROWTH',  // Juil
          'GROWTH',  // Août
          'HARVEST'  // Sep
        ]
      },
      oignons: {
        crop: 'oignons',
        cropName: 'Oignon — Variété SAFARI (30 g)',
        packPrices: '6 000 F & 2 500 F',
        cycleDays: '110 à 120 jours',
        soilPrepDates: '01 Oct – 10 Oct',
        optimalSowingDates: '10 Oct – 05 Nov (Pépinière)',
        transplantOrThinningDates: '20 Nov – 15 Déc (Repiquage 15 × 10 cm)',
        expectedHarvestDates: '15 Fév – 25 Mar',
        secondWindowSowingDates: '01 Déc – 20 Déc (Cycle tardif)',
        climaticNote:
          'Semer le sachet de 30 g d’Oignon Variété SAFARI entre le 10 octobre et le 5 novembre garantit que la bulbaison coïncide avec les nuits froides de janvier à Matam.',
        monthlyPhases: [
          'SOWING',  // Oct
          'SOWING',  // Nov
          'GROWTH',  // Déc
          'GROWTH',  // Jan
          'HARVEST', // Fév
          'HARVEST', // Mar
          'NONE',    // Avr
          'NONE',    // Mai
          'NONE',    // Juin
          'NONE',    // Juil
          'NONE',    // Août
          'PREP'     // Sep
        ]
      }
    }
  },
  'Hamady Ounaré': {
    zone: 'Hamady Ounaré',
    climateZoneLabel: 'Zone Climatique Bassin Maraîcher Continental (Hamady Ounaré)',
    thermalProfile: 'Journées chaudes (35–38°C en Oct) · Refroidissement nocturne dès fin Octobre',
    villagesSummary:
      'Sinthiane Dioudé · Dioudé · Hamady Ounaré · Ounaré · Barkatou · Sinthiou Bamambé · Doundé · Garly',
    schedules: {
      laitue: {
        crop: 'laitue',
        cropName: 'Laitue — Variété EDEN (25 g)',
        packPrices: '5 000 F & 2 000 F',
        cycleDays: '45 jours',
        soilPrepDates: '10 Oct – 18 Oct',
        optimalSowingDates: '18 Oct – 30 Nov (sous ombrière 50 cm)',
        transplantOrThinningDates: '08 Nov – 20 Déc (après 17h30)',
        expectedHarvestDates: '05 Déc – 25 Jan',
        secondWindowSowingDates: '05 Jan – 10 Fév (Plein frais)',
        climaticNote:
          'À Sinthiane Dioudé et Hamady Ounaré, décalez le semis de Laitue EDEN (25 g) de 8 jours (dès le 18 Oct) avec ombrière obligatoire.',
        monthlyPhases: [
          'SOWING',  // Oct
          'GROWTH',  // Nov
          'HARVEST', // Déc
          'SOWING',  // Jan
          'HARVEST', // Fév
          'NONE',    // Mar
          'NONE',    // Avr
          'NONE',    // Mai
          'NONE',    // Juin
          'NONE',    // Juil
          'NONE',    // Août
          'PREP'     // Sep
        ]
      },
      bissap: {
        crop: 'bissap',
        cropName: 'Bissap Blanc (variété Vimto / Koor)',
        packPrices: '5 000 F & 2 000 F',
        cycleDays: '90 à 100 jours',
        soilPrepDates: '05 Oct – 15 Oct',
        optimalSowingDates: '15 Oct – 10 Nov (Contre-saison irriguée)',
        transplantOrThinningDates: '30 Oct – 25 Nov (Pincement à J+35)',
        expectedHarvestDates: '15 Jan – 20 Fév',
        secondWindowSowingDates: '20 Juin – 25 Juil (Semis pluvial)',
        climaticNote:
          'Le Bissap Blanc valorise parfaitement la chaleur d’octobre à Hamady Ounaré : semez dès le 15 octobre avec 15 kg de fumure organique enfouie.',
        monthlyPhases: [
          'SOWING',  // Oct
          'GROWTH',  // Nov
          'GROWTH',  // Déc
          'HARVEST', // Jan
          'HARVEST', // Fév
          'NONE',    // Mar
          'NONE',    // Avr
          'PREP',    // Mai
          'SOWING',  // Juin
          'GROWTH',  // Juil
          'GROWTH',  // Août
          'HARVEST'  // Sep
        ]
      },
      oignons: {
        crop: 'oignons',
        cropName: 'Oignon — Variété SAFARI (30 g)',
        packPrices: '6 000 F & 2 500 F',
        cycleDays: '115 jours',
        soilPrepDates: '05 Oct – 15 Oct',
        optimalSowingDates: '15 Oct – 10 Nov (Pépinière paillée)',
        transplantOrThinningDates: '25 Nov – 20 Déc (Profondeur 2 cm)',
        expectedHarvestDates: '20 Fév – 30 Mar',
        secondWindowSowingDates: '25 Nov – 15 Déc (2e lot échelonné)',
        climaticNote:
          'Un semis de pépinière entre le 15 Oct et le 10 Nov permet une récolte fin février avant les fortes chaleurs de mars-avril, assurant 6 mois de conservation.',
        monthlyPhases: [
          'SOWING',  // Oct
          'SOWING',  // Nov
          'GROWTH',  // Déc
          'GROWTH',  // Jan
          'HARVEST', // Fév
          'HARVEST', // Mar
          'NONE',    // Avr
          'NONE',    // Mai
          'NONE',    // Juin
          'NONE',    // Juil
          'NONE',    // Août
          'PREP'     // Sep
        ]
      }
    }
  },
  Kanel: {
    zone: 'Kanel',
    climateZoneLabel: 'Zone Climatique Diéri & Damga Ventilé (Kanel)',
    thermalProfile: 'Alizé continental sec (20–26 km/h) · Sols sablo-limoneux drainants',
    villagesSummary:
      'Kanel · Orkadiéré · Aouré · Ndendory · Séno Palel · Sinthiou Garba · Odabéré · Thiemping · Padalal',
    schedules: {
      laitue: {
        crop: 'laitue',
        cropName: 'Laitue — Variété EDEN (25 g)',
        packPrices: '5 000 F & 2 000 F',
        cycleDays: '45 à 50 jours',
        soilPrepDates: '12 Oct – 20 Oct',
        optimalSowingDates: '20 Oct – 30 Nov (Semis matinal avant 08h30)',
        transplantOrThinningDates: '10 Nov – 20 Déc (avec brise-vent)',
        expectedHarvestDates: '10 Déc – 30 Jan',
        secondWindowSowingDates: '05 Jan – 05 Fév',
        climaticNote:
          'Sur les sols filtrants de Kanel et Orkadiéré, incorporez 100% du compost FOUT’AGRO au lit de semence de Laitue EDEN (25 g) et installez un brise-vent côté Est.',
        monthlyPhases: [
          'SOWING',  // Oct
          'GROWTH',  // Nov
          'HARVEST', // Déc
          'SOWING',  // Jan
          'HARVEST', // Fév
          'NONE',    // Mar
          'NONE',    // Avr
          'NONE',    // Mai
          'NONE',    // Juin
          'NONE',    // Juil
          'NONE',    // Août
          'PREP'     // Sep
        ]
      },
      bissap: {
        crop: 'bissap',
        cropName: 'Bissap Blanc (variété Vimto / Koor)',
        packPrices: '5 000 F & 2 000 F',
        cycleDays: '95 jours',
        soilPrepDates: '15 Oct – 25 Oct',
        optimalSowingDates: '25 Oct – 20 Nov (Poquets abrités)',
        transplantOrThinningDates: '10 Nov – 05 Déc (Démariage + buttage)',
        expectedHarvestDates: '01 Fév – 05 Mar',
        secondWindowSowingDates: '25 Juin – 25 Juil (Cycle pluvial Diéri)',
        climaticNote:
          'Réalisez un léger buttage au pied des plants à J+30 à Kanel et Aouré pour renforcer l’ancrage racinaire face aux vents secs de décembre.',
        monthlyPhases: [
          'SOWING',  // Oct
          'SOWING',  // Nov
          'GROWTH',  // Déc
          'GROWTH',  // Jan
          'HARVEST', // Fév
          'HARVEST', // Mar
          'NONE',    // Avr
          'PREP',    // Mai
          'SOWING',  // Juin
          'GROWTH',  // Juil
          'GROWTH',  // Août
          'HARVEST'  // Sep
        ]
      },
      oignons: {
        crop: 'oignons',
        cropName: 'Oignon — Variété SAFARI (30 g)',
        packPrices: '6 000 F & 2 500 F',
        cycleDays: '115 jours',
        soilPrepDates: '05 Oct – 15 Oct',
        optimalSowingDates: '15 Oct – 05 Nov (Sillons tassés)',
        transplantOrThinningDates: '25 Nov – 15 Déc (Planches creuses)',
        expectedHarvestDates: '20 Fév – 25 Mar',
        secondWindowSowingDates: '20 Nov – 10 Déc',
        climaticNote:
          'En zone Diéri (Kanel, Séno Palel), confectionnez des planches légèrement en cuvette pour retenir l’eau d’irrigation autour des bulbes SAFARI.',
        monthlyPhases: [
          'SOWING',  // Oct
          'SOWING',  // Nov
          'GROWTH',  // Déc
          'GROWTH',  // Jan
          'HARVEST', // Fév
          'HARVEST', // Mar
          'NONE',    // Avr
          'NONE',    // Mai
          'NONE',    // Juin
          'NONE',    // Juil
          'NONE',    // Août
          'PREP'     // Sep
        ]
      }
    }
  },
  Bakel: {
    zone: 'Bakel',
    climateZoneLabel: 'Zone Climatique Haute Vallée & Sud-Soudanienne (Bakel)',
    thermalProfile: 'Hygrométrie élevée (55–65%) · Hivernage précoce & terres fertiles de Falémé',
    villagesSummary:
      'Bakel · Waoundé · Semmé · Balel · Gassambéry · Appé Diaobé',
    schedules: {
      laitue: {
        crop: 'laitue',
        cropName: 'Laitue — Variété EDEN (25 g)',
        packPrices: '5 000 F & 2 000 F',
        cycleDays: '42 à 45 jours',
        soilPrepDates: '01 Oct – 08 Oct',
        optimalSowingDates: '08 Oct – 20 Nov (Planches surélevées)',
        transplantOrThinningDates: '29 Oct – 10 Déc (Maillage 25 × 25 cm)',
        expectedHarvestDates: '22 Nov – 15 Jan',
        secondWindowSowingDates: '05 Jan – 15 Fév',
        climaticNote:
          'Grâce à la douceur humide de Bakel, Waoundé et Semmé, les semis de Laitue Variété EDEN (25 g) démarrent dès le 8 octobre sur planches drainantes.',
        monthlyPhases: [
          'SOWING',  // Oct
          'GROWTH',  // Nov
          'HARVEST', // Déc
          'SOWING',  // Jan
          'HARVEST', // Fév
          'NONE',    // Mar
          'NONE',    // Avr
          'NONE',    // Mai
          'NONE',    // Juin
          'NONE',    // Juil
          'NONE',    // Août
          'PREP'     // Sep
        ]
      },
      bissap: {
        crop: 'bissap',
        cropName: 'Bissap Blanc (variété Vimto / Koor)',
        packPrices: '5 000 F & 2 000 F',
        cycleDays: '90 jours',
        soilPrepDates: '01 Oct – 10 Oct',
        optimalSowingDates: '10 Oct – 05 Nov (Décrue) & 05 Juin – 10 Juil (Pluvial)',
        transplantOrThinningDates: '25 Oct – 20 Nov (Démariage précoce)',
        expectedHarvestDates: '10 Jan – 15 Fév (et Oct en pluvial)',
        secondWindowSowingDates: '05 Juin – 10 Juil (Hivernage précoce Bakel)',
        climaticNote:
          'Bakel bénéficie des premières pluies dès début juin et d’une forte humidité en octobre : double campagne annuelle à très haut rendement en calices.',
        monthlyPhases: [
          'SOWING',  // Oct
          'GROWTH',  // Nov
          'GROWTH',  // Déc
          'HARVEST', // Jan
          'HARVEST', // Fév
          'NONE',    // Mar
          'NONE',    // Avr
          'PREP',    // Mai
          'SOWING',  // Juin
          'GROWTH',  // Juil
          'GROWTH',  // Août
          'HARVEST'  // Sep
        ]
      },
      oignons: {
        crop: 'oignons',
        cropName: 'Oignon — Variété SAFARI (30 g)',
        packPrices: '6 000 F & 2 500 F',
        cycleDays: '110 jours',
        soilPrepDates: '01 Oct – 08 Oct',
        optimalSowingDates: '08 Oct – 30 Oct (Pépinière précoce)',
        transplantOrThinningDates: '18 Nov – 10 Déc (Planches billonnées)',
        expectedHarvestDates: '05 Fév – 15 Mar',
        secondWindowSowingDates: '15 Nov – 05 Déc',
        climaticNote:
          'À Bakel et Semmé, semez l’Oignon Variété SAFARI (30 g) dès le 8 octobre afin de récolter début février sous air sec, garantissant une tunique ferme.',
        monthlyPhases: [
          'SOWING',  // Oct
          'SOWING',  // Nov
          'GROWTH',  // Déc
          'GROWTH',  // Jan
          'HARVEST', // Fév
          'HARVEST', // Mar
          'NONE',    // Avr
          'NONE',    // Mai
          'NONE',    // Juin
          'NONE',    // Juil
          'NONE',    // Août
          'PREP'     // Sep
        ]
      }
    }
  }
};

// Crop Icon Helper
const CalendarCropIcon: React.FC<{ crop: CalendarCropKey; className?: string }> = ({
  crop,
  className = 'w-4 h-4'
}) => {
  if (crop === 'laitue') {
    return <Leaf className={`${className} text-emerald-700 shrink-0`} aria-hidden="true" />;
  }
  if (crop === 'bissap') {
    return <Sprout className={`${className} text-emerald-800 shrink-0`} aria-hidden="true" />;
  }
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

interface SowingCalendarDashboardProps {
  onSendCalendarSms?: (zone: InterventionZone, messageText: string) => void;
}

export const SowingCalendarDashboard: React.FC<SowingCalendarDashboardProps> = ({
  onSendCalendarSms
}) => {
  const [selectedZone, setSelectedZone] = useState<InterventionZone>('Matam');
  const [selectedCrops, setSelectedCrops] = useState<CalendarCropKey[]>([
    'laitue',
    'bissap',
    'oignons'
  ]);
  const [sentSmsConfirm, setSentSmsConfirm] = useState(false);

  const activeZoneCalendar = CLIMATIC_CALENDAR_DATA[selectedZone];

  const handleToggleCrop = (crop: CalendarCropKey) => {
    setSelectedCrops((prev) => {
      if (prev.includes(crop)) {
        if (prev.length === 1) return prev; // Keep at least 1 crop selected
        return prev.filter((c) => c !== crop);
      }
      return [...prev, crop];
    });
  };

  const handleSelectAllCrops = () => {
    setSelectedCrops(['laitue', 'bissap', 'oignons']);
  };

  const visibleSchedules = (['laitue', 'bissap', 'oignons'] as CalendarCropKey[])
    .filter((key) => selectedCrops.includes(key))
    .map((key) => activeZoneCalendar.schedules[key]);

  const renderPhaseCell = (phase: MonthPhase) => {
    switch (phase) {
      case 'PREP':
        return (
          <div className="h-7 rounded bg-stone-200/80 text-stone-700 text-[10px] font-mono-tabular font-semibold flex items-center justify-center">
            Sol
          </div>
        );
      case 'SOWING':
        return (
          <div className="h-7 rounded bg-emerald-800 text-white text-[10px] font-mono-tabular font-bold flex items-center justify-center">
            Semis
          </div>
        );
      case 'GROWTH':
        return (
          <div className="h-7 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10px] font-mono-tabular font-semibold flex items-center justify-center">
            Suivi
          </div>
        );
      case 'HARVEST':
        return (
          <div className="h-7 rounded bg-amber-500/90 text-stone-950 text-[10px] font-mono-tabular font-bold flex items-center justify-center">
            Récolte
          </div>
        );
      default:
        return (
          <div className="h-7 rounded bg-[#F7F7F5] text-stone-400 text-[10px] font-mono-tabular flex items-center justify-center">
            ·
          </div>
        );
    }
  };

  const handleDispatchSms = () => {
    if (onSendCalendarSms) {
      const summary = visibleSchedules
        .map((s) => `${s.cropName}: Semis ${s.optimalSowingDates} -> Récolte ${s.expectedHarvestDates}`)
        .join(' | ');
      onSendCalendarSms(
        selectedZone,
        `CALENDRIER SEMIS FOUT'AGRO [${selectedZone.toUpperCase()}] : ${summary}`
      );
    }
    setSentSmsConfirm(true);
    setTimeout(() => setSentSmsConfirm(false), 2500);
  };

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header & Climatic Zone Selector */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-emerald-800">
              Planification Culturale FOUT’AGRO · Campagne 2026–2027
            </span>
            <span aria-hidden="true">·</span>
            <span>Laitue, Bissap Blanc & Oignons selon la Zone Climatique</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Calendrier des Semis & Fenêtres Optimales par Zone Climatique
          </h2>
        </div>

        {/* Climatic Zone Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-lg">
          {(['Matam', 'Hamady Ounaré', 'Kanel', 'Bakel'] as InterventionZone[]).map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => setSelectedZone(z)}
              className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 ${
                selectedZone === z
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Zone {z}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Selection Bar + Active Climatic Zone Profile — Hairline Separated */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="space-y-1">
          <p className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>{activeZoneCalendar.climateZoneLabel}</span>
          </p>
          <p className="text-xs text-stone-500">
            {activeZoneCalendar.thermalProfile} · Villages : {activeZoneCalendar.villagesSummary}
          </p>
        </div>

        {/* Multi-Select Crop Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-600 mr-1">
            Cultures affichées :
          </span>
          {(
            [
              { key: 'laitue', label: 'Laitue (5 000 F / 2 000 F)' },
              { key: 'bissap', label: 'Bissap Blanc (5 000 F / 2 000 F)' },
              { key: 'oignons', label: 'Oignons (6 000 F / 2 500 F)' }
            ] as Array<{ key: CalendarCropKey; label: string }>
          ).map((item) => {
            const isSelected = selectedCrops.includes(item.key);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleToggleCrop(item.key)}
                aria-pressed={isSelected}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-emerald-950 text-white border-emerald-950'
                    : 'bg-[#F7F7F5] text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                <CalendarCropIcon
                  crop={item.key}
                  className={`w-3.5 h-3.5 ${isSelected ? '!text-emerald-300' : ''}`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}

          {selectedCrops.length < 3 && (
            <button
              type="button"
              onClick={handleSelectAllCrops}
              className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:underline whitespace-nowrap shrink-0"
            >
              Afficher les 3 cultures
            </button>
          )}
        </div>
      </div>

      {/* Optimal Dates Table by Selected Crop — Clean Hairline Rows (Zero Nested Cards) */}
      <div className="divide-y divide-stone-200 border-b border-stone-200">
        {visibleSchedules.map((sched) => (
          <div key={sched.crop} className="py-5 first:pt-1 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <CalendarCropIcon crop={sched.crop} className="w-4 h-4" />
                <h3 className="text-base font-bold text-stone-900">
                  {sched.cropName}
                </h3>
                <span aria-hidden="true" className="text-stone-400">·</span>
                <span className="text-xs font-mono-tabular font-semibold text-emerald-800">
                  Paquets {sched.packPrices}
                </span>
              </div>
              <span className="text-xs font-mono-tabular text-stone-500">
                Durée du cycle : <strong className="text-stone-900">{sched.cycleDays}</strong>
              </span>
            </div>

            {/* 4 Key Milestone Dates Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              <div>
                <p className="text-xs text-stone-500">01. Préparation & Compost</p>
                <p className="text-sm font-bold font-mono-tabular text-stone-900 mt-0.5">
                  {sched.soilPrepDates}
                </p>
              </div>
              <div>
                <p className="text-xs text-emerald-800 font-semibold">
                  02. Dates Optimales de Semis
                </p>
                <p className="text-sm font-bold font-mono-tabular text-emerald-900 mt-0.5">
                  {sched.optimalSowingDates}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">03. Repiquage / Démariage</p>
                <p className="text-sm font-bold font-mono-tabular text-stone-900 mt-0.5">
                  {sched.transplantOrThinningDates}
                </p>
              </div>
              <div>
                <p className="text-xs text-amber-800 font-semibold">
                  04. Période de Récolte Prévue
                </p>
                <p className="text-sm font-bold font-mono-tabular text-stone-900 mt-0.5">
                  {sched.expectedHarvestDates}
                </p>
              </div>
            </div>

            {/* 12-Month Visual Agronomic Gantt Bar (Oct -> Sep) */}
            <div className="pt-2">
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {CAMPAIGN_MONTHS.map((mLabel, mIdx) => (
                  <div key={mLabel} className="space-y-1 text-center">
                    <span className="block text-[10px] font-mono-tabular text-stone-500">
                      {mLabel}
                    </span>
                    {renderPhaseCell(sched.monthlyPhases[mIdx])}
                  </div>
                ))}
              </div>
            </div>

            {/* Climatic Justification & Second Window */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600 pt-1">
              <p className="leading-relaxed max-w-[78ch]">
                <strong className="text-stone-900">Spécificité climatique ({selectedZone}) :</strong>{' '}
                {sched.climaticNote}
              </p>
              <span className="font-mono-tabular text-stone-500 whitespace-nowrap shrink-0">
                2e fenêtre : <strong className="text-stone-800">{sched.secondWindowSowingDates}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend & SMS Reminder Dispatch Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
          <span className="font-semibold text-stone-800">Légende :</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-stone-200 inline-block" />
            <span>Sol (Préparation)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-800 inline-block" />
            <span>Semis optimal</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-300 inline-block" />
            <span>Suivi & Repiquage</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
            <span>Récolte</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleDispatchSms}
          className="min-h-[40px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          {sentSmsConfirm ? (
            <>
              <Check className="w-4 h-4" />
              <span>Calendrier {selectedZone} envoyé par SMS</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Recevoir le calendrier de semis ({selectedZone}) par SMS</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};

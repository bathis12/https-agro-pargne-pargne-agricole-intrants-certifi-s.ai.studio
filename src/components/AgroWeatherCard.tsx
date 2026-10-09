import React, { useState } from 'react';
import { InterventionZone } from '../data/agroData';
import {
  Sun,
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  Send,
  Check
} from 'lucide-react';

export interface DailySowingForecast {
  dayLabel: string;
  dateShort: string;
  tempMaxC: number;
  tempMinC: number;
  humidityPct: number;
  windKmh: number;
  conditionLabel: string;
  sowingAction: string;
  isOptimalDay: boolean;
}

export interface ZoneAgroWeather {
  zone: InterventionZone;
  stationName: string;
  keyVillagesLabel: string;
  tempMaxC: number;
  tempMinC: number;
  soilTempC: number;
  humidityPct: number;
  windKmh: number;
  evapotranspirationMm: number;
  alertLevel: 'OPTIMAL' | 'VIGILANCE_CHALEUR' | 'VIGILANCE_VENT';
  alertBadgeText: string;
  contextualAlertTitle: string;
  contextualAlertDetail: string;
  sowingCalendarWindow: string;
  cropRecommendations: {
    laitue: string;
    oignons: string;
    bissap: string;
    poules: string;
  };
  fiveDayForecast: DailySowingForecast[];
}

const ZONE_WEATHER_DATA: Record<InterventionZone, ZoneAgroWeather> = {
  Matam: {
    zone: 'Matam',
    stationName: 'Station Agro-Météo Matam · Vallée du Fleuve',
    keyVillagesLabel: 'Ganguel Soulé · Goumal · Ngano · Orndoldé · Thially · Ogo',
    tempMaxC: 35,
    tempMinC: 22,
    soilTempC: 24,
    humidityPct: 48,
    windKmh: 14,
    evapotranspirationMm: 4.8,
    alertLevel: 'OPTIMAL',
    alertBadgeText: 'Fenêtre de semis favorable',
    contextualAlertTitle:
      'Baisse thermique nocturne (22°C) : fenêtre idéale pour les pépinières d’Oignon SAFARI et Laitue EDEN à Matam',
    contextualAlertDetail:
      'L’humidité résiduelle des berges du Walo (48%) et le sol rafraîchi à 24°C en fin de nuit favorisent une germination rapide en 4 jours. Semez vos sachets de Laitue Variété EDEN (25 g) et d’Oignon Variété SAFARI (30 g) entre 17h00 et 18h30.',
    sowingCalendarWindow: 'Semis conseillé : 10 – 14 Oct · Repiquage dès 17h00',
    cropRecommendations: {
      laitue:
        'Laitue EDEN (25 g) : Semis pépinière optimal sous ombrière légère (50 cm). Arrosage fractionné matin (07h) et soir (17h30).',
      oignons:
        'Oignon SAFARI (30 g) : Température du sol idéale (24°C) pour la levée homogène de la variété SAFARI sur terreau composté.',
      bissap:
        'Semis direct en poquets (40 × 40 cm) recommandé après pré-irrigation de la parcelle.',
      poules:
        'Bonne ventilation naturelle (14 km/h). Maintenir l’abreuvoir siphoïde à l’ombre.'
    },
    fiveDayForecast: [
      {
        dayLabel: 'Ven',
        dateShort: '09 Oct',
        tempMaxC: 35,
        tempMinC: 22,
        humidityPct: 48,
        windKmh: 14,
        conditionLabel: 'Ensoleillé doux',
        sowingAction: 'Semis Oignons & Laitue',
        isOptimalDay: true
      },
      {
        dayLabel: 'Sam',
        dateShort: '10 Oct',
        tempMaxC: 34,
        tempMinC: 21,
        humidityPct: 52,
        windKmh: 12,
        conditionLabel: 'Voile nuageux',
        sowingAction: 'Repiquage optimal (17h)',
        isOptimalDay: true
      },
      {
        dayLabel: 'Dim',
        dateShort: '11 Oct',
        tempMaxC: 36,
        tempMinC: 23,
        humidityPct: 44,
        windKmh: 16,
        conditionLabel: 'Clair & sec',
        sowingAction: 'Paillage 3 cm requis',
        isOptimalDay: false
      },
      {
        dayLabel: 'Lun',
        dateShort: '12 Oct',
        tempMaxC: 34,
        tempMinC: 21,
        humidityPct: 50,
        windKmh: 13,
        conditionLabel: 'Doux matinal',
        sowingAction: 'Semis Bissap Blanc',
        isOptimalDay: true
      },
      {
        dayLabel: 'Mar',
        dateShort: '13 Oct',
        tempMaxC: 33,
        tempMinC: 20,
        humidityPct: 54,
        windKmh: 11,
        conditionLabel: 'Nuages épars',
        sowingAction: 'Repiquage Laitue',
        isOptimalDay: true
      }
    ]
  },
  'Hamady Ounaré': {
    zone: 'Hamady Ounaré',
    stationName: 'Station Agro-Météo Hamady Ounaré · Bassin Maraîcher',
    keyVillagesLabel: 'Sinthiane Dioudé · Dioudé · Barkatou · Sinthiou Bamambé · Doundé',
    tempMaxC: 38,
    tempMinC: 24,
    soilTempC: 27,
    humidityPct: 36,
    windKmh: 19,
    evapotranspirationMm: 5.9,
    alertLevel: 'VIGILANCE_CHALEUR',
    alertBadgeText: 'Vigilance chaleur diurne (38°C)',
    contextualAlertTitle:
      'Pic thermique entre 12h et 16h (38°C) : ombrière et paillage obligatoires avant tout semis à Hamady Ounaré',
    contextualAlertDetail:
      'L’évapotranspiration atteint 5,9 mm/j à Sinthiane Dioudé et Hamady Ounaré. Différez les repiquages de Laitue après 17h30 et doublez l’épaisseur du paillis (3 à 4 cm) sur les planches d’Oignons pour éviter le stress hydrique des plantules.',
    sowingCalendarWindow: 'Éviter 11h–16h30 · Semis dès Dimanche 11 Oct (baisse à 34°C)',
    cropRecommendations: {
      laitue:
        'Impératif : poser l’ombrière en paille dès le semis et reporter le repiquage à dimanche soir (34°C).',
      oignons:
        'Biner légèrement la croûte du sol et arroser en fin d’après-midi pour abaisser la température du lit de semence.',
      bissap:
        'Le Bissap Blanc tolère bien les 38°C : semis en poquets possible avec paillage au pied.',
      poules:
        'Alerte chaleur avicole : renouveler l’eau fraîche des abreuvoirs à 13h00 et 16h00.'
    },
    fiveDayForecast: [
      {
        dayLabel: 'Ven',
        dateShort: '09 Oct',
        tempMaxC: 38,
        tempMinC: 24,
        humidityPct: 36,
        windKmh: 19,
        conditionLabel: 'Forte chaleur',
        sowingAction: 'Ombrière obligatoire',
        isOptimalDay: false
      },
      {
        dayLabel: 'Sam',
        dateShort: '10 Oct',
        tempMaxC: 37,
        tempMinC: 23,
        humidityPct: 39,
        windKmh: 17,
        conditionLabel: 'Chaud & sec',
        sowingAction: 'Préparation planches',
        isOptimalDay: false
      },
      {
        dayLabel: 'Dim',
        dateShort: '11 Oct',
        tempMaxC: 34,
        tempMinC: 21,
        humidityPct: 49,
        windKmh: 13,
        conditionLabel: 'Accalmie fraîche',
        sowingAction: 'Semis Laitue & Oignons',
        isOptimalDay: true
      },
      {
        dayLabel: 'Lun',
        dateShort: '12 Oct',
        tempMaxC: 34,
        tempMinC: 21,
        humidityPct: 51,
        windKmh: 12,
        conditionLabel: 'Ensoleillé modéré',
        sowingAction: 'Repiquage conseillé',
        isOptimalDay: true
      },
      {
        dayLabel: 'Mar',
        dateShort: '13 Oct',
        tempMaxC: 35,
        tempMinC: 22,
        humidityPct: 47,
        windKmh: 14,
        conditionLabel: 'Clair',
        sowingAction: 'Apport NPK J+15',
        isOptimalDay: true
      }
    ]
  },
  Kanel: {
    zone: 'Kanel',
    stationName: 'Station Agro-Météo Kanel · Diéri & Damga',
    keyVillagesLabel: 'Orkadiéré · Aouré · Ndendory · Séno Palel · Sinthiou Garba · Odabéré',
    tempMaxC: 36,
    tempMinC: 23,
    soilTempC: 25,
    humidityPct: 38,
    windKmh: 26,
    evapotranspirationMm: 5.5,
    alertLevel: 'VIGILANCE_VENT',
    alertBadgeText: 'Vigilance vent sec (26 km/h)',
    contextualAlertTitle:
      'Souffle d’Est asséchant (26 km/h) sur Kanel et Orkadiéré : protégez les semis fins contre l’enfouissement éolien',
    contextualAlertDetail:
      'Les rafales modérées assèchent la couche superficielle (0–3 cm) où germent les graines de Laitue et d’Oignon. Arrosez en pluie fine juste après le semis et installez un brise-vent végétal en tiges de mil sur le côté Est des planches.',
    sowingCalendarWindow: 'Semis matinal (06h30–09h00) au calme du vent',
    cropRecommendations: {
      laitue:
        'Laitue EDEN (25 g) : Semer tôt le matin (avant 08h30) lorsque le vent est faible (10 km/h) et recouvrir d’un voile de paille.',
      oignons:
        'Oignon SAFARI (30 g) : Tasser légèrement le sillon après semis de la variété SAFARI pour assurer le contact terre-graine.',
      bissap:
        'Pincer la tige principale à 35 jours pour renforcer la tenue au vent et ramifier les calices.',
      poules:
        'Abriter les poussins des courants d’air poussiéreux en fin d’après-midi.'
    },
    fiveDayForecast: [
      {
        dayLabel: 'Ven',
        dateShort: '09 Oct',
        tempMaxC: 36,
        tempMinC: 23,
        humidityPct: 38,
        windKmh: 26,
        conditionLabel: 'Vent d’Est sec',
        sowingAction: 'Brise-vent + paillis',
        isOptimalDay: false
      },
      {
        dayLabel: 'Sam',
        dateShort: '10 Oct',
        tempMaxC: 35,
        tempMinC: 22,
        humidityPct: 45,
        windKmh: 15,
        conditionLabel: 'Vent faible',
        sowingAction: 'Semis matinal optimal',
        isOptimalDay: true
      },
      {
        dayLabel: 'Dim',
        dateShort: '11 Oct',
        tempMaxC: 34,
        tempMinC: 21,
        humidityPct: 48,
        windKmh: 12,
        conditionLabel: 'Calme & doux',
        sowingAction: 'Repiquage Oignons',
        isOptimalDay: true
      },
      {
        dayLabel: 'Lun',
        dateShort: '12 Oct',
        tempMaxC: 35,
        tempMinC: 22,
        humidityPct: 44,
        windKmh: 16,
        conditionLabel: 'Ensoleillé',
        sowingAction: 'Semis Bissap Blanc',
        isOptimalDay: true
      },
      {
        dayLabel: 'Mar',
        dateShort: '13 Oct',
        tempMaxC: 36,
        tempMinC: 23,
        humidityPct: 41,
        windKmh: 20,
        conditionLabel: 'Brise sèche',
        sowingAction: 'Binage & arrosage soir',
        isOptimalDay: false
      }
    ]
  },
  Bakel: {
    zone: 'Bakel',
    stationName: 'Station Agro-Météo Bakel · Haute Vallée & Falémé',
    keyVillagesLabel: 'Waoundé · Semmé · Ballou / Balel · Gassambéry · Appé Diaobé',
    tempMaxC: 33,
    tempMinC: 21,
    soilTempC: 23,
    humidityPct: 58,
    windKmh: 11,
    evapotranspirationMm: 4.1,
    alertLevel: 'OPTIMAL',
    alertBadgeText: 'Humidité idéale (58%) · Semis optimal',
    contextualAlertTitle:
      'Hygrométrie élevée (58%) à Bakel, Waoundé et Semmé : conditions optimales de semis direct et repiquage',
    contextualAlertDetail:
      'Le microclimat plus humide de la zone de Bakel offre la meilleure réserve hydrique du Fouta cette semaine. C’est le moment idéal pour lancer simultanément les semis de Bissap Blanc, les pépinières de Laitue Variété EDEN (25 g) et le repiquage des Oignons Variété SAFARI (30 g).',
    sowingCalendarWindow: 'Fenêtre optimale continue sur les 5 prochains jours',
    cropRecommendations: {
      laitue:
        'Laitue EDEN (25 g) : Levée rapide en 72h. Éclaircir les rangs dès la 2e semaine pour aérer le feuillage.',
      oignons:
        'Oignon SAFARI (30 g) : Repiquage idéal en planches surélevées de 15 cm pour drainer l’humidité et favoriser le calibre.',
      bissap:
        'Croissance végétative maximale : incorporer les 15 kg de fumure organique du paquet avant le semis.',
      poules:
        'Confort thermique optimal (21–33°C) pour le démarrage du lot avicole vacciné.'
    },
    fiveDayForecast: [
      {
        dayLabel: 'Ven',
        dateShort: '09 Oct',
        tempMaxC: 33,
        tempMinC: 21,
        humidityPct: 58,
        windKmh: 11,
        conditionLabel: 'Humide & doux',
        sowingAction: 'Semis toutes cultures',
        isOptimalDay: true
      },
      {
        dayLabel: 'Sam',
        dateShort: '10 Oct',
        tempMaxC: 32,
        tempMinC: 21,
        humidityPct: 62,
        windKmh: 10,
        conditionLabel: 'Passages nuageux',
        sowingAction: 'Repiquage Laitue/Oignons',
        isOptimalDay: true
      },
      {
        dayLabel: 'Dim',
        dateShort: '11 Oct',
        tempMaxC: 33,
        tempMinC: 22,
        humidityPct: 56,
        windKmh: 12,
        conditionLabel: 'Ensoleillé doux',
        sowingAction: 'Semis Bissap Blanc',
        isOptimalDay: true
      },
      {
        dayLabel: 'Lun',
        dateShort: '12 Oct',
        tempMaxC: 34,
        tempMinC: 22,
        humidityPct: 53,
        windKmh: 13,
        conditionLabel: 'Clair',
        sowingAction: 'Épandage compost',
        isOptimalDay: true
      },
      {
        dayLabel: 'Mar',
        dateShort: '13 Oct',
        tempMaxC: 34,
        tempMinC: 21,
        humidityPct: 55,
        windKmh: 11,
        conditionLabel: 'Doux',
        sowingAction: 'Repiquage optimal',
        isOptimalDay: true
      }
    ]
  }
};

interface AgroWeatherCardProps {
  onSendWeatherSmsAlert?: (zone: InterventionZone, summaryText: string) => void;
}

export const AgroWeatherCard: React.FC<AgroWeatherCardProps> = ({
  onSendWeatherSmsAlert
}) => {
  const [selectedZone, setSelectedZone] = useState<InterventionZone>('Hamady Ounaré');
  const [sentAlertZone, setSentAlertZone] = useState<InterventionZone | null>(null);

  const activeWeather = ZONE_WEATHER_DATA[selectedZone];

  const renderConditionIcon = (level: ZoneAgroWeather['alertLevel'], className = 'w-5 h-5') => {
    if (level === 'OPTIMAL') {
      return <CloudSun className={`${className} text-emerald-800 shrink-0`} />;
    }
    if (level === 'VIGILANCE_VENT') {
      return <Wind className={`${className} text-amber-700 shrink-0`} />;
    }
    return <Sun className={`${className} text-amber-700 shrink-0`} />;
  };

  const handleDispatchWeatherSms = () => {
    if (onSendWeatherSmsAlert) {
      onSendWeatherSmsAlert(
        activeWeather.zone,
        `MÉTÉO FOUT'AGRO [${activeWeather.zone.toUpperCase()}] : ${activeWeather.tempMaxC}°C/${activeWeather.tempMinC}°C, Humidité ${activeWeather.humidityPct}%. ${activeWeather.sowingCalendarWindow}. Laitue : ${activeWeather.cropRecommendations.laitue}`
      );
    }
    setSentAlertZone(activeWeather.zone);
    setTimeout(() => setSentAlertZone(null), 2500);
  };

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header & 4-Zone Selector */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-emerald-800">
              Bulletin Agro-Météorologique du Fouta · Planification des Semis & Repiquages
            </span>
            <span aria-hidden="true">·</span>
            <span>Campagne Maraîchère 2027</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Prévisions Météo Agricoles & Alertes de Semis par Zone
          </h2>
        </div>

        {/* Interactive Zone Tabs (Matam, Hamady Ounaré, Kanel, Bakel) */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-lg">
          {(['Matam', 'Hamady Ounaré', 'Kanel', 'Bakel'] as InterventionZone[]).map((z) => {
            const zData = ZONE_WEATHER_DATA[z];
            const isSelected = selectedZone === z;
            return (
              <button
                key={z}
                type="button"
                onClick={() => setSelectedZone(z)}
                className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>{z}</span>
                <span className="font-mono-tabular text-[11px] text-stone-500">
                  {zData.tempMaxC}°C
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-Zone Quick Comparison Strip — Hairline Divided (No Nested Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200 border-b border-stone-200 pb-5">
        {(['Matam', 'Hamady Ounaré', 'Kanel', 'Bakel'] as InterventionZone[]).map((z, idx) => {
          const item = ZONE_WEATHER_DATA[z];
          const isCurrent = selectedZone === z;
          return (
            <button
              key={z}
              type="button"
              onClick={() => setSelectedZone(z)}
              className={`text-left py-2.5 sm:py-1 transition-colors duration-150 ${
                idx === 0
                  ? 'sm:pr-5'
                  : idx === 3
                  ? 'sm:pl-5'
                  : 'sm:px-5'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs font-bold ${
                    isCurrent ? 'text-emerald-900 underline underline-offset-4 decoration-2 decoration-emerald-800' : 'text-stone-900'
                  }`}
                >
                  Zone {z}
                </span>
                <span className="font-mono-tabular text-xs font-bold text-stone-900">
                  {item.tempMaxC}° / {item.tempMinC}°C
                </span>
              </div>
              <p
                className={`text-xs mt-1 font-medium ${
                  item.alertLevel === 'OPTIMAL' ? 'text-emerald-800' : 'text-amber-800'
                }`}
              >
                {item.alertBadgeText}
              </p>
              <p className="text-[11px] text-stone-500 font-mono-tabular mt-0.5">
                Humidité {item.humidityPct}% · Vent {item.windKmh} km/h
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Zone Contextual Sowing Alert & Telemetry — 2-Column Hairline Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:divide-x lg:divide-stone-200 items-start">
        {/* Left Column: Contextual Alert & Crop-by-Crop Sowing Instructions */}
        <div className="lg:col-span-7 lg:pr-8 space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
              {renderConditionIcon(activeWeather.alertLevel, 'w-4 h-4')}
              <span
                className={`font-bold ${
                  activeWeather.alertLevel === 'OPTIMAL'
                    ? 'text-emerald-800'
                    : 'text-amber-800'
                }`}
              >
                {activeWeather.alertBadgeText}
              </span>
              <span aria-hidden="true">·</span>
              <span>{activeWeather.stationName}</span>
            </div>

            <h3 className="text-lg font-bold text-stone-900 leading-snug">
              {activeWeather.contextualAlertTitle}
            </h3>

            <p className="text-sm text-stone-600 leading-relaxed">
              {activeWeather.contextualAlertDetail}
            </p>

            <p className="text-xs text-stone-500 pt-1">
              <strong>Villages concernés :</strong> {activeWeather.keyVillagesLabel}
            </p>
          </div>

          {/* Crop-Specific Sowing Recommendations for the Selected Zone */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-stone-900">
                Consignes de semis par paquet FOUT’AGRO ({activeWeather.zone}) :
              </p>
              <span className="text-xs font-mono-tabular font-semibold text-emerald-800">
                {activeWeather.sowingCalendarWindow}
              </span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              <div className="py-2 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-bold text-emerald-900 w-36 shrink-0">
                  Laitue (5 000 F / 2 000 F)
                </span>
                <span className="text-stone-700 leading-relaxed">
                  {activeWeather.cropRecommendations.laitue}
                </span>
              </div>
              <div className="py-2 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-bold text-amber-900 w-36 shrink-0">
                  Oignons (6 000 F / 2 500 F)
                </span>
                <span className="text-stone-700 leading-relaxed">
                  {activeWeather.cropRecommendations.oignons}
                </span>
              </div>
              <div className="py-2 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-bold text-stone-900 w-36 shrink-0">
                  Bissap Blanc (5 000 F / 2 000 F)
                </span>
                <span className="text-stone-700 leading-relaxed">
                  {activeWeather.cropRecommendations.bissap}
                </span>
              </div>
              <div className="py-2 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-bold text-stone-900 w-36 shrink-0">
                  Poules (8 000 F)
                </span>
                <span className="text-stone-700 leading-relaxed">
                  {activeWeather.cropRecommendations.poules}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Soil/Air Telemetry & 5-Day Sowing Planner */}
        <div className="lg:col-span-5 lg:pl-8 space-y-5">
          {/* 4 Key Agrometeorological Metrics */}
          <div className="grid grid-cols-2 gap-4 border-b border-stone-200 pb-4">
            <div>
              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-stone-400" />
                <span>Temp. Air / Sol (Lit de semence)</span>
              </p>
              <p className="text-lg font-bold font-mono-tabular text-stone-900 mt-1">
                {activeWeather.tempMaxC}°C · Sol {activeWeather.soilTempC}°C
              </p>
            </div>

            <div>
              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-stone-400" />
                <span>Humidité & Évapo. (ET0)</span>
              </p>
              <p className="text-lg font-bold font-mono-tabular text-stone-900 mt-1">
                {activeWeather.humidityPct}% · {activeWeather.evapotranspirationMm} mm/j
              </p>
            </div>
          </div>

          {/* 5-Day Sowing Calendar Table */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-stone-900">
              Calendrier de semis à 5 jours — Zone {activeWeather.zone}
            </p>

            <div className="divide-y divide-stone-200 border-y border-stone-200">
              {activeWeather.fiveDayForecast.map((day) => (
                <div
                  key={day.dateShort}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="w-24 shrink-0 font-mono-tabular">
                    <span className="font-bold text-stone-900">{day.dayLabel}</span>{' '}
                    <span className="text-stone-500">{day.dateShort}</span>
                  </div>

                  <div className="font-mono-tabular text-stone-700 whitespace-nowrap shrink-0">
                    <strong>{day.tempMaxC}°</strong>/{day.tempMinC}°C · {day.humidityPct}%
                  </div>

                  <div className="text-right truncate">
                    <span
                      className={`font-semibold ${
                        day.isOptimalDay ? 'text-emerald-800' : 'text-amber-800'
                      }`}
                    >
                      {day.sowingAction}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatch Contextual Weather Alert via SMS */}
          <button
            type="button"
            onClick={handleDispatchWeatherSms}
            className="w-full min-h-[40px] py-2.5 px-4 bg-stone-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors duration-150 flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
          >
            {sentAlertZone === activeWeather.zone ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Bulletin météo {activeWeather.zone} envoyé par SMS</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Recevoir le bulletin de semis {activeWeather.zone} par SMS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

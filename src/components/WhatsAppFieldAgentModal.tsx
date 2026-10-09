import React, { useState, useRef, useEffect } from 'react';
import {
  InterventionZone,
  SubscribedPlan,
  AgriPackage,
  formatFcfa
} from '../data/agroData';
import {
  MessageCircle,
  Send,
  X,
  CheckCheck,
  Phone,
  ArrowUpRight
} from 'lucide-react';

interface WhatsAppFieldAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SubscribedPlan[];
  packages: AgriPackage[];
  onNavigateToDeposit: (planId?: string) => void;
  onNavigateToCatalog: () => void;
}

interface FieldAgentProfile {
  zone: InterventionZone;
  name: string;
  role: string;
  phone: string;
  hub: string;
  villagesCovered: string;
}

interface ChatMessage {
  id: string;
  sender: 'agent' | 'producer';
  agentName?: string;
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    type: 'deposit' | 'catalog';
    planId?: string;
  };
}

const FIELD_AGENTS: Record<InterventionZone, FieldAgentProfile> = {
  'Hamady Ounaré': {
    zone: 'Hamady Ounaré',
    name: 'Amadou Ba',
    role: 'Agent de Terrain & Entrepreneur Villageois',
    phone: '+221 77 514 82 10',
    hub: 'Magasin Coopératif Hamady Ounaré',
    villagesCovered: 'Sinthiane Dioudé · Dioudé · Ounaré · Sinthiou Bamambé · Barkatou'
  },
  Matam: {
    zone: 'Matam',
    name: 'Mamadou Sylla',
    role: 'Conseiller Maraîcher Zone Walo',
    phone: '+221 77 608 33 45',
    hub: 'Magasin Central Matam & Ogo',
    villagesCovered: 'Ganguel Soulé · Ogo · Ngano · Orndoldé · Sinthiou Garba · Dialloubé'
  },
  Kanel: {
    zone: 'Kanel',
    name: 'Ousmane Dia',
    role: 'Technicien Semences & Intrants',
    phone: '+221 78 391 20 67',
    hub: 'Point Relais Orkadiéré & Kanel',
    villagesCovered: 'Kanel · Orkadiéré · Semmé · Waoundé · Aouré · Séno Palel · Odabéré'
  },
  Bakel: {
    zone: 'Bakel',
    name: 'Fatoumata Konté',
    role: 'Animatrice Agronomique Haute Vallée',
    phone: '+221 76 419 55 82',
    hub: 'Magasin Coopératif Bakel',
    villagesCovered: 'Bakel · Balel · Garly · Gassambéry · Appé Diaobé'
  }
};

const QUICK_PROMPTS = [
  {
    id: 'q-oignon',
    shortLabel: 'Oignon SAFARI 30g (6 000 F / 2 500 F)',
    question: 'Quels sont les détails et le rendement du paquet Oignon Variété SAFARI 30g ?'
  },
  {
    id: 'q-laitue',
    shortLabel: 'Laitue EDEN 25g (5 000 F / 2 000 F)',
    question: 'Comment réussir la Laitue Variété EDEN 25g avec les paquets 5 000 F et 2 000 F ?'
  },
  {
    id: 'q-bissap',
    shortLabel: 'Bissap Blanc (5 000 F / 2 000 F)',
    question: 'Que contiennent les paquets Bissap Blanc à 5 000 F et 2 000 F ?'
  },
  {
    id: 'q-poules',
    shortLabel: 'Poules Villageoises (8 000 F)',
    question: 'Comment fonctionne le paquet Poules à 8 000 F et le suivi vaccinal ?'
  },
  {
    id: 'q-suivi',
    shortLabel: 'État de mon épargne & Livraison',
    question: 'Quel est le solde actuel de mes paquets FOUT’AGRO et ma date de livraison ?'
  }
];

function getCurrentTimeLabel(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export const WhatsAppFieldAgentModal: React.FC<WhatsAppFieldAgentModalProps> = ({
  isOpen,
  onClose,
  plans,
  onNavigateToDeposit,
  onNavigateToCatalog
}) => {
  const [selectedZone, setSelectedZone] = useState<InterventionZone>('Hamady Ounaré');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeAgent = FIELD_AGENTS[selectedZone];

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome-1',
      sender: 'agent',
      agentName: FIELD_AGENTS['Hamady Ounaré'].name,
      timestamp: '14:20',
      text: `Salam Aïssata Tall ! Je suis Amadou Ba, votre agent de terrain FOUT’AGRO pour la zone Hamady Ounaré (Sinthiane Dioudé). Posez-moi vos questions sur nos paquets (Oignon Variété SAFARI 30g, Laitue Variété EDEN 25g, Bissap Blanc, Poules 8 000 F) ou sur vos versements.`
    }
  ]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const generateAgentReply = (userQuestion: string, agent: FieldAgentProfile): ChatMessage => {
    const q = userQuestion.toLowerCase();
    const totalSaved = plans.reduce((acc, p) => acc + p.savedFcfa, 0);
    const totalTarget = plans.reduce((acc, p) => acc + p.targetFcfa, 0);
    const remainingTotal = Math.max(0, totalTarget - totalSaved);

    // 1. Oignon Variété SAFARI 30g
    if (q.includes('oignon') || q.includes('safari') || q.includes('6000') || q.includes('6 000') || q.includes('2500') || q.includes('2 500')) {
      const onionPlan = plans.find((p) => p.packageName.toLowerCase().includes('oignon'));
      const savedInfo = onionPlan
        ? `Sur votre « ${onionPlan.packageName} », vous avez déjà épargné ${formatFcfa(onionPlan.savedFcfa)} sur ${formatFcfa(onionPlan.targetFcfa)} (reste ${formatFcfa(Math.max(0, onionPlan.targetFcfa - onionPlan.savedFcfa))}).`
        : '';

      return {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        agentName: agent.name,
        timestamp: getCurrentTimeLabel(),
        text: `Pour la filière Oignons, FOUT’AGRO fournit exclusivement l’Oignon Variété SAFARI (sachet certifié de 30 g) :\n• Grand Format à 6 000 FCFA (12 planches / 120 m²) : Sachet 30 g Variété SAFARI + 5 kg d’engrais bulbes NPK 10-20-20 + 8 kg de fumure organique. Rendement visé : 320 à 380 kg.\n• Format Découverte à 2 500 FCFA (5 planches / 50 m²) : Sachet 30 g Variété SAFARI + 2 kg NPK + 3 kg compost. ${savedInfo}`,
        suggestedAction: onionPlan
          ? {
              label: `Compléter mon Pack Oignons (${formatFcfa(Math.max(0, onionPlan.targetFcfa - onionPlan.savedFcfa))} restants)`,
              type: 'deposit',
              planId: onionPlan.id
            }
          : {
              label: 'Voir les paquets Oignon SAFARI 30g',
              type: 'catalog'
            }
      };
    }

    // 2. Laitue Variété EDEN 25g
    if (q.includes('laitue') || q.includes('eden') || q.includes('salade')) {
      return {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        agentName: agent.name,
        timestamp: getCurrentTimeLabel(),
        text: `Nos paquets Laitue utilisent la Variété EDEN (sachet certifié de 25 g), sélectionnée pour résister à la chaleur de ${agent.zone} sans montée en graines précoce :\n• Pack 5 000 FCFA (10 planches / 100 m²) : Sachet 25 g Laitue EDEN + 10 kg compost pépinière + 1 kg NPK + plantoir calibré (180 kg de récolte en 45 jours).\n• Pack 2 000 FCFA (4 planches / 40 m²) : Sachet 25 g Laitue EDEN + 4 kg compost + 400 g engrais feuillage (75 kg de récolte).\nConseil terrain : installez une ombrière à 50 cm du sol pendant les 21 jours de pépinière.`,
        suggestedAction: {
          label: 'Découvrir les paquets Laitue EDEN 25g',
          type: 'catalog'
        }
      };
    }

    // 3. Bissap Blanc
    if (q.includes('bissap')) {
      const bissapPlan = plans.find((p) => p.packageName.toLowerCase().includes('bissap'));
      return {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        agentName: agent.name,
        timestamp: getCurrentTimeLabel(),
        text: `Le Bissap Blanc du Fouta est disponible en 2 formats :\n• Grand Format à 5 000 FCFA (500 m²) : 500 g de semences triées + 10 kg de bio-fertilisant + poudre de neem naturelle (140 kg de calices secs).\n• Format Découverte à 2 000 FCFA (200 m²) : 200 g de semences + 4 kg de bio-fertilisant + doseur au poquet (60 kg de calices).\nAstuce : pincez la tige principale au 35e jour pour doubler les ramifications !`,
        suggestedAction: bissapPlan
          ? {
              label: 'Verser sur mon Pack Bissap Blanc',
              type: 'deposit',
              planId: bissapPlan.id
            }
          : {
              label: 'Voir les paquets Bissap Blanc',
              type: 'catalog'
            }
      };
    }

    // 4. Poules Villageoises 8 000 F
    if (q.includes('poule') || q.includes('volaille') || q.includes('8000') || q.includes('8 000') || q.includes('vaccin')) {
      const poulePlan = plans.find((p) => p.packageName.toLowerCase().includes('poule'));
      return {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        agentName: agent.name,
        timestamp: getCurrentTimeLabel(),
        text: `Le Pack Poules Villageoises à 8 000 FCFA comprend :\n• Sujets rustiques déjà vaccinés contre la maladie de Newcastle (souche thermostable I-2)\n• 5 kg d’aliment démarrage riche en protéines et calcium\n• 1 abreuvoir siphoïde hygiénique + 1 bloc minéral vitaminé\n• Passage mensuel de l’auxiliaire vétérinaire FOUT’AGRO dans votre village (${agent.villagesCovered}).`,
        suggestedAction: poulePlan
          ? {
              label: `Verser sur mon Pack Poules (${formatFcfa(Math.max(0, poulePlan.targetFcfa - poulePlan.savedFcfa))} restants)`,
              type: 'deposit',
              planId: poulePlan.id
            }
          : {
              label: 'Voir le Pack Poules 8 000 F',
              type: 'catalog'
            }
      };
    }

    // 5. Suivi d'épargne / Livraison / J-7 / Paiement Espèces
    if (
      q.includes('solde') ||
      q.includes('épargne') ||
      q.includes('epargne') ||
      q.includes('livraison') ||
      q.includes('état') ||
      q.includes('etat') ||
      q.includes('espèce') ||
      q.includes('espece') ||
      q.includes('reçu') ||
      q.includes('ussd')
    ) {
      const completed = plans.filter((p) => p.savedFcfa >= p.targetFcfa);
      return {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        agentName: agent.name,
        timestamp: getCurrentTimeLabel(),
        text: `Voici le point en direct sur votre dossier producteur (FT-OUN-48291) :\n• Épargne cumulée : ${formatFcfa(totalSaved)} sur ${formatFcfa(totalTarget)} (${plans.length} paquets actifs, reste ${formatFcfa(remainingTotal)}).\n• Paquets 100% financés : ${completed.length} paquet(s) prêt(s) pour livraison au ${agent.hub}.\n• Rappel SMS automatique : vous recevez une alerte à 50%, 90% et un SMS de préparation à J-7 avant la livraison prévue.`,
        suggestedAction: {
          label: 'Effectuer un versement (Espèces ou Mobile Money)',
          type: 'deposit'
        }
      };
    }

    // Default helpful field-agent response
    return {
      id: `msg-agent-${Date.now()}`,
      sender: 'agent',
      agentName: agent.name,
      timestamp: getCurrentTimeLabel(),
      text: `Merci pour votre message ! Au ${agent.hub} (Zone ${agent.zone}), tous nos paquets officiels sont disponibles à l’épargne progressive dès 250 F : Laitue Variété EDEN 25g (5 000 F / 2 000 F), Bissap Blanc (5 000 F / 2 000 F), Oignon Variété SAFARI 30g (6 000 F / 2 500 F) et Poules (8 000 F). Souhaitez-vous créditer un paquet ou consulter le catalogue ?`,
      suggestedAction: {
        label: 'Ouvrir le catalogue des paquets',
        type: 'catalog'
      }
    };
  };

  const handleSendQuestion = (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed) return;

    const producerMsg: ChatMessage = {
      id: `msg-prod-${Date.now()}`,
      sender: 'producer',
      text: trimmed,
      timestamp: getCurrentTimeLabel()
    };

    setMessages((prev) => [...prev, producerMsg]);
    setInputText('');
    setIsTyping(true);

    const currentAgent = FIELD_AGENTS[selectedZone];
    setTimeout(() => {
      const reply = generateAgentReply(trimmed, currentAgent);
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 420);
  };

  const handleZoneChange = (newZone: InterventionZone) => {
    setSelectedZone(newZone);
    const agent = FIELD_AGENTS[newZone];
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-switch-${Date.now()}`,
        sender: 'agent',
        agentName: agent.name,
        timestamp: getCurrentTimeLabel(),
        text: `Vous êtes maintenant en ligne avec ${agent.name} (${agent.role} — Zone ${agent.zone}, ${agent.hub}). Comment puis-je vous aider sur vos paquets Laitue EDEN 25g, Oignon SAFARI 30g, Bissap Blanc ou Poules ?`
      }
    ]);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
    >
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Top WhatsApp Field Agent Header */}
        <div className="bg-emerald-900 text-white px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-emerald-200" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2
                  id="whatsapp-modal-title"
                  className="text-base font-bold text-white truncate"
                >
                  {activeAgent.name} · Agent FOUT’AGRO ({activeAgent.zone})
                </h2>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              </div>
              <p className="text-xs text-emerald-100 truncate font-mono-tabular">
                {activeAgent.hub} · WhatsApp {activeAgent.phone}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la discussion WhatsApp"
            className="w-10 h-10 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors duration-150 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zone Field Agent Selector Bar */}
        <div className="bg-[#F7F7F5] border-b border-stone-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-stone-700 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-800" />
            <span>Choisir l’agent de terrain par zone :</span>
          </span>
          <div className="flex flex-wrap items-center gap-1">
            {(['Hamady Ounaré', 'Matam', 'Kanel', 'Bakel'] as InterventionZone[]).map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => handleZoneChange(z)}
                className={`min-h-[32px] px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  selectedZone === z
                    ? 'bg-emerald-800 text-white font-semibold'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        {/* Simulated WhatsApp Conversation Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F2EFE9]">
          {/* Encryption / Official Channel Banner */}
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-md bg-white/90 border border-stone-200/80 text-[11px] text-stone-600">
              Canal d’assistance WhatsApp FOUT’AGRO · Semences certifiées Oignon SAFARI (30g) & Laitue EDEN (25g)
            </span>
          </div>

          {messages.map((msg) => {
            const isProducer = msg.sender === 'producer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isProducer ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm space-y-2 ${
                    isProducer
                      ? 'bg-emerald-800 text-white rounded-br-xs'
                      : 'bg-white text-stone-900 border border-stone-200/90 rounded-bl-xs'
                  }`}
                >
                  {!isProducer && msg.agentName && (
                    <p className="text-[11px] font-bold text-emerald-800">
                      {msg.agentName} · Conseiller Terrain ({selectedZone})
                    </p>
                  )}

                  <p className=" whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {msg.suggestedAction && (
                    <div className="pt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (msg.suggestedAction?.type === 'deposit') {
                            onNavigateToDeposit(msg.suggestedAction.planId);
                          } else {
                            onNavigateToCatalog();
                          }
                          onClose();
                        }}
                        className="min-h-[36px] px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors duration-150"
                      >
                        <span>{msg.suggestedAction.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div
                    className={`flex items-center justify-end gap-1 text-[10px] font-mono-tabular ${
                      isProducer ? 'text-emerald-200' : 'text-stone-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    <CheckCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-start">
              <div className="bg-white border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-500 italic">
                {activeAgent.name} écrit une réponse…
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions Bar */}
        <div className="bg-[#F7F7F5] border-t border-stone-200 px-5 py-3 space-y-2">
          <p className="text-[11px] font-semibold text-stone-600">
            Questions rapides aux agents de terrain sur les paquets :
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => handleSendQuestion(q.question)}
                className="min-h-[36px] px-3 py-1.5 bg-white hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 border border-stone-300 rounded-lg text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                {q.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion(inputText);
          }}
          className="bg-white border-t border-stone-200 px-5 py-3.5 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Écrire à ${activeAgent.name} (ex: Oignon SAFARI 30g, Laitue EDEN 25g, livraison)...`}
            className="flex-1 min-h-[42px] px-3.5 py-2 bg-[#F7F7F5] border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-800"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="min-h-[42px] px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white rounded-lg text-xs font-semibold transition-colors duration-150 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Envoyer</span>
          </button>
        </form>
      </div>
    </div>
  );
};

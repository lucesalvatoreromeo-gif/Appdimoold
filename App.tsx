import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Wifi, 
  Phone, 
  MessageCircle, 
  Save, 
  Sparkles,
  Check,
  Info,
  Navigation,
  Key,
  ClipboardList,
  Utensils,
  Camera,
  Bus,
  ExternalLink,
  ChevronDown,
  Lock,
  Umbrella,
  CircleArrowDown,
  CircleArrowUp,
  Pill,
  Siren,
  Plane,
  TrainFront,
  Copy,
  Car,
  Star,
  CalendarDays,
  Heart
} from 'lucide-react';
import { GuideData, Language, TRANSLATIONS } from './types';
import { INITIAL_GUIDE_DATA } from './constants';
import { polishText } from './services/geminiService';

const FLAGS: Record<Language, string> = {
  [Language.IT]: "https://flagcdn.com/w80/it.png",
  [Language.EN]: "https://flagcdn.com/w80/gb.png",
  [Language.DE]: "https://flagcdn.com/w80/de.png",
  [Language.FR]: "https://flagcdn.com/w80/fr.png",
  [Language.ES]: "https://flagcdn.com/w80/es.png"
};

const getIcon = (name: string) => {
  switch (name) {
    case 'key': return <Key className="w-5 h-5" />;
    case 'clipboard-list': return <ClipboardList className="w-5 h-5" />;
    case 'utensils': return <Utensils className="w-5 h-5" />;
    case 'camera': return <Camera className="w-5 h-5" />;
    case 'bus': return <Bus className="w-5 h-5" />;
    case 'taxi': return <Car className="w-5 h-5" />;
    case 'beach': return <Umbrella className="w-5 h-5" />;
    case 'pharmacy': return <Pill className="w-5 h-5" />;
    case 'siren': return <Siren className="w-5 h-5" />;
    case 'wifi': return <Wifi className="w-5 h-5" />;
    default: return <Info className="w-5 h-5" />;
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.IT);
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState<GuideData>(() => {
    const saved = localStorage.getItem('dimora_sorriso_data');
    return saved ? JSON.parse(saved) : INITIAL_GUIDE_DATA;
  });
  const [polishingId, setPolishingId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [wifiCopied, setWifiCopied] = useState<{name: boolean, pass: boolean}>({ name: false, pass: false });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    localStorage.setItem('dimora_sorriso_data', JSON.stringify(data));
  }, [data]);

  const toggleSection = (id: string) => {
    if (isAdmin) return;
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = (text: string, field: 'name' | 'pass') => {
    navigator.clipboard.writeText(text);
    setWifiCopied(prev => ({ ...prev, [field]: true }));
    setTimeout(() => setWifiCopied(prev => ({ ...prev, [field]: false })), 2000);
  };

  const updateSection = (id: string, field: 'title' | 'description', value: string) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === id ? { ...s, [field]: { ...s[field], [lang]: value } } : s
      )
    }));
  };

  const handleMagicPolish = async (id: string) => {
    const section = data.sections.find(s => s.id === id);
    if (!section) return;
    setPolishingId(id);
    const polished = await polishText(section.description[lang], lang);
    updateSection(id, 'description', polished);
    setPolishingId(null);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '20072007') {
      setIsAdmin(true);
      setShowPasswordModal(false);
    } else {
      setPasswordError(true);
    }
  };

  const t = TRANSLATIONS[lang];
  const cleanPhone = (phone: string) => phone.replace(/\D/g, '');

  const renderDescription = (text: string) => {
    const regex = /((?:https?:\/\/[^\s]+)|(?:\+39(?:[0-9 ]){8,}))/g;
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (!part) return null;
      if (part.match(/^https?:\/\//)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 underline underline-offset-4 decoration-amber-500/30 font-bold inline-flex items-center gap-1">
            {part} <ExternalLink className="w-3 h-3" />
          </a>
        );
      }
      if (part.trim().match(/^\+39/)) {
         return (
          <a key={i} href={`tel:${part.replace(/\s+/g, '')}`} className="text-amber-700 hover:text-amber-800 font-bold inline-flex items-center gap-1">
            {part}
          </a>
         );
      }
      return part;
    });
  };

  const renderSectionContent = (section: any) => {
    if (section.id === 'checkin' && !isAdmin) {
      const [checkinText, checkoutText] = section.description[lang].split('|||').map((s: string) => s.trim());
      return (
        <div className="px-6 pb-8 pt-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-950/5 border border-emerald-900/10 p-5 rounded-[1.5rem] flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50"></div>
               <div className="flex items-center gap-1 mb-2">
                 <CircleArrowDown className="w-3 h-3 text-emerald-700" />
                 <span className="text-emerald-800 text-[10px] font-black uppercase tracking-[0.2em]">{t.arrival}</span>
               </div>
               <div className="text-3xl font-black text-emerald-600 tracking-tight">15:00</div>
            </div>
            <div className="bg-rose-950/5 border border-rose-900/10 p-5 rounded-[1.5rem] flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-rose-500/50"></div>
               <div className="flex items-center gap-1 mb-2">
                 <CircleArrowUp className="w-3 h-3 text-rose-700" />
                 <span className="text-rose-800 text-[10px] font-black uppercase tracking-[0.2em]">{t.departure}</span>
               </div>
               <div className="text-3xl font-black text-rose-600 tracking-tight">10:00</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-6 bg-emerald-50/50 border border-emerald-100/50 rounded-[1.5rem]">
              <h4 className="flex items-center gap-2 text-emerald-800 font-bold mb-3">
                 <CircleArrowDown className="w-4 h-4" />
                 <span className="text-xs uppercase tracking-widest">{t.checkinInstructions}</span>
              </h4>
              <p className="text-stone-600 text-sm leading-relaxed font-medium">{checkinText || section.description[lang]}</p>
            </div>
            {checkoutText && (
              <div className="p-6 bg-rose-50/50 border border-rose-100/50 rounded-[1.5rem]">
                <h4 className="flex items-center gap-2 text-rose-800 font-bold mb-3">
                   <CircleArrowUp className="w-4 h-4" />
                   <span className="text-xs uppercase tracking-widest">{t.checkoutInstructions}</span>
                </h4>
                <p className="text-stone-600 text-sm leading-relaxed font-medium">{checkoutText}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    if (section.id === 'wifi' && !isAdmin) {
      return (
        <div className="px-6 pb-8 pt-2">
           <div className="bg-white rounded-[1.8rem] p-6 border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-xl font-bold mb-1 text-stone-900">{section.title[lang]}</h4>
                  <p className="text-stone-500 text-xs font-medium">Tocca per copiare</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                   <Wifi className="w-6 h-6 text-amber-700" />
                </div>
              </div>
              <div className="space-y-3">
                 <button className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-4 flex items-center justify-between hover:bg-amber-50/50 transition-all" onClick={() => handleCopy(data.wifi.name, 'name')}>
                    <div>
                       <div className="text-[10px] text-stone-400 font-black uppercase tracking-wider mb-1">Nome Rete</div>
                       <div className="font-mono text-base font-bold text-stone-800">{data.wifi.name}</div>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${wifiCopied.name ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-stone-400'}`}>
                       {wifiCopied.name ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </div>
                 </button>
                 <button className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-4 flex items-center justify-between hover:bg-amber-50/50 transition-all" onClick={() => handleCopy(data.wifi.password, 'pass')}>
                    <div>
                       <div className="text-[10px] text-stone-400 font-black uppercase tracking-wider mb-1">Password</div>
                       <div className="font-mono text-base font-bold text-stone-800">{data.wifi.password}</div>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${wifiCopied.pass ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-stone-400'}`}>
                       {wifiCopied.pass ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </div>
                 </button>
              </div>
           </div>
        </div>
      );
    }
    if (section.id === 'rules' && !isAdmin) {
      const rulesList = section.description[lang].split('\n').filter((r: string) => r.trim());
      return (
        <div className="px-6 pb-8 pt-4 space-y-5">
          {rulesList.map((rule: string, index: number) => {
            const cleanRule = rule.replace(/^\d+\.\s*/, '');
            const titleIndex = cleanRule.indexOf(':');
            const title = titleIndex > -1 ? cleanRule.substring(0, titleIndex) : null;
            const content = titleIndex > -1 ? cleanRule.substring(titleIndex + 1).trim() : cleanRule;
            return (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-stone-900 font-black text-lg">{index + 1}</span>
                </div>
                <div className="flex-1 bg-stone-50/50 p-4 rounded-2xl border border-stone-100/50">
                    {title && <h5 className="font-black text-stone-800 text-xs uppercase tracking-widest mb-1">{title}</h5>}
                    <p className="text-stone-600 text-sm leading-relaxed font-medium">{content}</p>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    if (section.id === 'bus' && !isAdmin) {
      const parts = section.description[lang].split('|||');
      return (
        <div className="px-6 pb-8 pt-2 space-y-4">
          {parts.map((part: string, idx: number) => {
            const isAirport = idx === 0;
            const lines = part.split('\n');
            const urlMatch = part.match(/https?:\/\/[^\s]+/);
            const url = urlMatch ? urlMatch[0] : '';
            const title = lines[0] || '';
            const description = lines.slice(1).filter(l => !l.includes('http')).join('\n');
            return (
              <div key={idx} className="bg-stone-50 border border-stone-200 rounded-[1.8rem] overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${isAirport ? 'bg-sky-100 text-sky-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {isAirport ? <Plane className="w-6 h-6" /> : <TrainFront className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900">{title}</h4>
                      <p className="text-stone-500 text-xs mt-1 font-medium whitespace-pre-line">{description}</p>
                    </div>
                  </div>
                  {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${isAirport ? 'bg-sky-50 text-sky-700' : 'bg-indigo-50 text-indigo-700'}`}>
                      <MapPin className="w-4 h-4" /> Scendi qui / Get off here
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    if (section.id === 'taxi' && !isAdmin) {
      const taxiNumber = "+390805343333";
      const taxiStandLink = "https://maps.app.goo.gl/2rpWZWiQTBzvcnxv7?g_st=ac";
      return (
        <div className="px-6 pb-8 pt-2 space-y-5">
           <div className="bg-stone-50 border border-stone-200 p-6 rounded-[1.8rem]">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">La tua posizione / Your Location</p>
              <p className="text-xl font-black text-stone-800 leading-tight mb-4">{data.address}</p>
           </div>
           <a href={`tel:${taxiNumber}`} className="flex items-center justify-between p-6 rounded-[1.8rem] bg-yellow-400 text-yellow-950 border-2 border-yellow-300">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm"><Phone className="w-6 h-6" /></div>
                 <div>
                    <div className="font-black text-lg">Taxi Bari</div>
                    <div className="text-xs font-bold opacity-80 uppercase tracking-widest">Chiama ora</div>
                 </div>
              </div>
              <div className="text-xl font-black tracking-tight">{taxiNumber}</div>
           </a>
           <a href={taxiStandLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 rounded-[1.8rem] bg-white border border-stone-200">
              <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600"><Navigation className="w-5 h-5" /></div>
              <div className="flex-1">
                 <div className="font-bold text-stone-900 text-sm">Stazionamento / Taxi Stand</div>
                 <div className="text-xs font-medium text-stone-500">Piazza Giuseppe Garibaldi</div>
              </div>
              <ExternalLink className="w-4 h-4 text-stone-400" />
           </a>
        </div>
      );
    }
    if (section.id === 'emergency' && !isAdmin) {
      const emergencyNumbers = [
        { number: "112", label: "Carabinieri / NUE" },
        { number: "113", label: "Polizia di Stato" },
        { number: "118", label: "Ambulanza" },
        { number: "115", label: "Vigili del Fuoco" }
      ];
      return (
        <div className="px-6 pb-8 pt-2">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {emergencyNumbers.map((item) => (
               <a key={item.number} href={`tel:${item.number}`} className="flex flex-col items-center justify-center p-6 rounded-[1.8rem] bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-all text-center">
                 <div className="text-4xl font-black text-rose-600 mb-2">{item.number}</div>
                 <div className="text-[11px] font-bold text-rose-900 uppercase tracking-widest">{item.label}</div>
               </a>
             ))}
           </div>
        </div>
      );
    }
    return (
      <div className="px-8 pb-10 pt-2">
        {isAdmin ? (
          <textarea
            value={section.description[lang]}
            onChange={(e) => updateSection(section.id, 'description', e.target.value)}
            rows={6}
            className="w-full text-stone-700 bg-stone-50 border border-stone-200 rounded-[2rem] p-6 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-amber-500"
          />
        ) : (
          <div className="p-7 bg-stone-50/50 rounded-[2rem] border border-stone-100/80">
            <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line font-medium italic">
              {renderDescription(section.description[lang])}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-10 max-w-2xl mx-auto bg-stone-50 text-stone-800 selection:bg-amber-100 font-sans">
      
      {/* LANDING HERO SECTION */}
      <div className="relative h-[40rem] sm:h-[45rem] overflow-hidden border-b border-stone-200 shadow-xl">
        <img 
          src="https://lh3.googleusercontent.com/d/1LvN-m2oAX_NDTLB9qjFCStlfskm4KWG0" 
          alt="Dimora Sorriso Bedroom" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
        
        {/* Language Switcher Floating */}
        <div className="absolute top-6 right-6 flex gap-2 z-20">
          {Object.values(Language).map(l => (
            <button key={l} onClick={() => setLang(l)} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${lang === l ? 'border-white ring-2 ring-amber-500/50 scale-110 shadow-lg' : 'border-white/40 opacity-70'}`}>
              <img src={FLAGS[l]} alt={l} className="w-full h-full object-cover rounded-full" />
            </button>
          ))}
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Top Rated 2024</span>
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-4 leading-none">
              Vivi Bari in <br/>
              <span className="text-amber-400">Dimora Sorriso</span>
            </h1>
            <p className="text-stone-200 text-lg sm:text-xl font-medium mb-8 leading-relaxed">
              Un rifugio accogliente nel cuore di Bari, perfetto per esplorare la Puglia con comfort e stile.
            </p>
            
            {/* CTA Buttons Hero */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`https://wa.me/${cleanPhone(data.contacts.whatsapp)}`} className="flex-1 bg-white hover:bg-stone-50 text-stone-900 h-16 rounded-[1.8rem] flex items-center justify-center gap-3 font-black text-lg transition-all shadow-xl active:scale-95">
                <CalendarDays className="w-5 h-5 text-amber-600" />
                Prenota Ora
              </a>
              <button onClick={() => window.scrollTo({ top: document.getElementById('guide')?.offsetTop, behavior: 'smooth' })} className="flex-1 bg-stone-100/10 hover:bg-stone-100/20 text-white backdrop-blur-md h-16 rounded-[1.8rem] flex items-center justify-center gap-3 font-black text-lg transition-all border border-white/20 active:scale-95">
                <Info className="w-5 h-5" />
                Dettagli Alloggio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS / FEATURES */}
      <div className="px-6 py-12">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-6 bg-white rounded-[2rem] border border-stone-200 shadow-sm">
            <div className="flex justify-center mb-2"><Wifi className="w-6 h-6 text-amber-600" /></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Ultra Fast</span>
            <div className="font-bold text-stone-900">WiFi Gratis</div>
          </div>
          <div className="p-6 bg-white rounded-[2rem] border border-stone-200 shadow-sm">
            <div className="flex justify-center mb-2"><MapPin className="w-6 h-6 text-emerald-600" /></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Central</span>
            <div className="font-bold text-stone-900">Bari Centro</div>
          </div>
          <div className="p-6 bg-white rounded-[2rem] border border-stone-200 shadow-sm">
            <div className="flex justify-center mb-2"><Heart className="w-6 h-6 text-rose-500" /></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Comfort</span>
            <div className="font-bold text-stone-900">Best Stay</div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="px-6 mb-12">
        <h2 className="text-2xl font-black tracking-tighter text-stone-900 mb-6 px-2 flex items-center gap-3">
          Cosa dicono di noi 
          <span className="flex gap-1 text-amber-400"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></span>
        </h2>
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-[2rem] border border-stone-200 shadow-sm italic text-stone-600 font-medium">
            "Appartamento meraviglioso, pulitissimo e in una posizione perfetta. Salvatore è un host eccezionale, ci ha aiutato in tutto!" 
            <div className="mt-4 flex items-center gap-3 not-italic">
               <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700">M</div>
               <div>
                  <div className="text-stone-900 font-bold text-sm">Marco Rossi</div>
                  <div className="text-stone-400 text-[10px] uppercase font-black tracking-widest">Ospite Verificato</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* THE DIGITAL GUIDE (ACCORDION) */}
      <div id="guide" className="px-6 space-y-8 mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Digital Concierge 24/7
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tighter mb-4">Tutto a tua disposizione</h2>
          <p className="text-stone-500 font-medium max-w-md mx-auto">Abbiamo creato questa guida per rendere il tuo soggiorno semplice e indimenticabile. Esplora le sezioni qui sotto.</p>
        </div>

        <div className="space-y-4">
          {data.sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            return (
              <div key={section.id} className={`bg-white rounded-[2.5rem] border overflow-hidden transition-all duration-300 ${isExpanded ? 'border-amber-300 shadow-xl ring-1 ring-amber-50' : 'border-stone-200 hover:border-stone-300 shadow-sm'}`}>
                <button onClick={() => toggleSection(section.id)} disabled={isAdmin} className="w-full text-left p-6 flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl border transition-all ${isExpanded ? 'bg-amber-800 border-amber-800 text-white shadow-lg' : 'bg-stone-50 border-stone-100 text-stone-500 group-hover:border-amber-200 group-hover:text-amber-800'}`}>
                      {getIcon(section.icon)}
                    </div>
                    <div>
                      {isAdmin ? (
                        <input value={section.title[lang]} onClick={(e) => e.stopPropagation()} onChange={(e) => updateSection(section.id, 'title', e.target.value)} className="text-lg font-black bg-stone-50 border-stone-200 rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-amber-500 text-stone-900" />
                      ) : (
                        <h3 className={`text-xl font-bold tracking-tight transition-colors ${isExpanded ? 'text-amber-900' : 'text-stone-800'}`}>{section.title[lang]}</h3>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {isAdmin && (
                      <button onClick={(e) => { e.stopPropagation(); handleMagicPolish(section.id); }} disabled={polishingId === section.id} className="px-3 py-1.5 text-amber-700 hover:bg-amber-100 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black tracking-widest uppercase disabled:opacity-50">
                        {polishingId === section.id ? <div className="animate-spin h-3 w-3 border-2 border-amber-700 border-t-transparent rounded-full" /> : <Sparkles className="w-3.5 h-3.5" />} AI
                      </button>
                    )}
                    {!isAdmin && (
                      <div className={`p-2 rounded-full transition-all ${isExpanded ? 'bg-amber-50 rotate-180' : ''}`}><ChevronDown className={`w-5 h-5 ${isExpanded ? 'text-amber-800' : 'text-stone-400'}`} /></div>
                    )}
                  </div>
                </button>
                <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                  <div className="overflow-hidden">{renderSectionContent(section)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONTACT & CTA FOOTER */}
      <div className="px-6 mb-20">
        <div className="bg-stone-900 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 p-8 opacity-[0.05] text-white pointer-events-none"><MessageCircle size={280} /></div>
          
          <div className="relative flex flex-col items-center text-center mb-12">
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-stone-800 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" alt="Host Salvatore" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-7 h-7 rounded-full border-4 border-stone-900 shadow-sm" />
            </div>
            <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{t.yourHost}</p>
            <h4 className="text-4xl font-black text-white tracking-tighter">Salvatore</h4>
            <p className="text-stone-400 text-sm mt-3 font-medium max-w-xs italic">"Bari è una città magica. Sono qui per aiutarti a scoprirne ogni segreto."</p>
          </div>
          
          <div className="flex flex-col gap-4 relative z-10">
            <a href={`https://wa.me/${cleanPhone(data.contacts.whatsapp)}`} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-16 rounded-[1.8rem] flex items-center justify-center gap-3 font-black text-lg transition-all shadow-xl active:scale-95">
              <MessageCircle className="w-5 h-5" /> WhatsApp Diretto
            </a>
            <a href={`tel:${data.contacts.phone}`} className="w-full bg-stone-800 hover:bg-stone-700 text-white h-16 rounded-[1.8rem] flex items-center justify-center gap-3 font-black text-lg transition-all active:scale-95">
              <Phone className="w-5 h-5 text-amber-500" /> Chiama Subito
            </a>
          </div>
        </div>
      </div>

      {/* ADMIN CONTROLS */}
      <div className="flex flex-col items-center justify-center pb-10 opacity-40 hover:opacity-100 transition-opacity">
        <button onClick={() => isAdmin ? setIsAdmin(false) : setShowPasswordModal(true)} className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold text-stone-400 hover:text-stone-600 uppercase tracking-widest transition-colors">
          {isAdmin ? <Save className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          {isAdmin ? 'Esci e Salva' : 'Admin'}
        </button>
      </div>

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-stone-900 mb-2">{t.adminMode}</h3>
            <p className="text-stone-500 text-sm mb-6">Inserisci password per modificare.</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Password" autoFocus className={`w-full bg-stone-50 border ${passwordError ? 'border-red-300' : 'border-stone-200'} rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-amber-200 transition-all`} />
              {passwordError && <p className="text-red-500 text-xs mt-2 font-medium">Password errata</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-50 transition-colors">Annulla</button>
                <button type="submit" className="flex-1 bg-amber-800 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-amber-900/20 hover:bg-amber-900 transition-all">Entra</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
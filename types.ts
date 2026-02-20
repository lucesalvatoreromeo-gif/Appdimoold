
export enum Language {
  IT = 'IT',
  EN = 'EN',
  DE = 'DE',
  FR = 'FR',
  ES = 'ES'
}

export interface SectionItem {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  link?: string;
  category: 'checkin' | 'checkout' | 'rules' | 'wifi' | 'house' | 'local' | 'transport';
}

export interface GuideData {
  propertyName: string;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number };
  contacts: {
    phone: string;
    whatsapp: string;
    email: string;
  };
  wifi: {
    name: string;
    password: string;
  };
  sections: SectionItem[];
}

export interface TranslationSet {
  welcome: string;
  yourHost: string;
  copyWifi: string;
  copied: string;
  getDirections: string;
  contactHost: string;
  adminMode: string;
  guestView: string;
  saveChanges: string;
  magicPolish: string;
  arrival: string;
  departure: string;
  checkinInstructions: string;
  checkoutInstructions: string;
}

export const TRANSLATIONS: Record<Language, TranslationSet> = {
  [Language.IT]: {
    welcome: "Benvenuti a Dimora Sorriso",
    yourHost: "Il tuo Host",
    copyWifi: "Copia Password WiFi",
    copied: "Copiato!",
    getDirections: "Come arrivare",
    contactHost: "Contattaci",
    adminMode: "Modalità Gestore",
    guestView: "Vista Ospite",
    saveChanges: "Salva Modifiche",
    magicPolish: "Perfeziona con AI",
    arrival: "Arrivo",
    departure: "Partenza",
    checkinInstructions: "Istruzioni Check-in",
    checkoutInstructions: "Istruzioni Check-out"
  },
  [Language.EN]: {
    welcome: "Welcome to Dimora Sorriso",
    yourHost: "Your Host",
    copyWifi: "Copy WiFi Password",
    copied: "Copied!",
    getDirections: "Get Directions",
    contactHost: "Contact Us",
    adminMode: "Host Mode",
    guestView: "Guest View",
    saveChanges: "Save Changes",
    magicPolish: "Polish with AI",
    arrival: "Arrival",
    departure: "Departure",
    checkinInstructions: "Check-in Instructions",
    checkoutInstructions: "Check-out Instructions"
  },
  [Language.DE]: {
    welcome: "Willkommen in der Dimora Sorriso",
    yourHost: "Ihr Gastgeber",
    copyWifi: "WLAN-Passwort kopieren",
    copied: "Kopiert!",
    getDirections: "Anfahrt",
    contactHost: "Kontakt",
    adminMode: "Host-Modus",
    guestView: "Gast-Ansicht",
    saveChanges: "Änderungen speichern",
    magicPolish: "Mit KI verfeinern",
    arrival: "Anreise",
    departure: "Abreise",
    checkinInstructions: "Check-in Anweisungen",
    checkoutInstructions: "Check-out Anweisungen"
  },
  [Language.FR]: {
    welcome: "Bienvenue à Dimora Sorriso",
    yourHost: "Votre Hôte",
    copyWifi: "Copier le mot de passe WiFi",
    copied: "Copié !",
    getDirections: "Comment arriver",
    contactHost: "Contactez-nous",
    adminMode: "Mode Hôte",
    guestView: "Vue Invité",
    saveChanges: "Enregistrer les modifications",
    magicPolish: "Peaufiner avec l'IA",
    arrival: "Arrivée",
    departure: "Départ",
    checkinInstructions: "Instructions d'arrivée",
    checkoutInstructions: "Instructions de départ"
  },
  [Language.ES]: {
    welcome: "Bienvenidos a Dimora Sorriso",
    yourHost: "Tu Anfitrión",
    copyWifi: "Copiar contraseña WiFi",
    copied: "¡Copiado!",
    getDirections: "Cómo llegar",
    contactHost: "Contáctanos",
    adminMode: "Modo Anfitrión",
    guestView: "Vista Huésped",
    saveChanges: "Guardar cambios",
    magicPolish: "Perfeccionar con IA",
    arrival: "Llegada",
    departure: "Salida",
    checkinInstructions: "Instrucciones de llegada",
    checkoutInstructions: "Instrucciones de salida"
  }
};
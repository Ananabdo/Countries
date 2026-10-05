// פריט ברשימת המדינות (מה שמגיע מ-/all?fields=name,cca2,region)
export interface CountryListItem {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  region: string;
}

// המבנה הגולמי שמגיע מ-/name/<country> (רק השדות שאנחנו צריכים)
export interface ApiCountry {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  capital?: string[];
  region: string;
  population?: number;
  area?: number;
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
}

// המדינה כפי שהאפליקציה שומרת ומציגה אותה
export interface Country {
  code: string;
  name: string;
  officialName: string;
  capital: string;
  region: string;
  population: number;
  area: number;
  flagUrl: string;
  flagAlt: string;
}

// רשומה בהיסטוריית החיפושים
export interface SearchHistoryItem {
  id: string;
  searchTime: Date;
  country: Country;
}

export type RegionFilter =
  | "All"
  | "Africa"
  | "Americas"
  | "Asia"
  | "Europe"
  | "Oceania";

import type { ApiCountry, Country, CountryListItem } from "../types/Country";

const COUNTRY_DATA_URL = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";
const POPULATION_DATA_URL =
  "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json";
const CAPITAL_DATA_URL =
  "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-capital-city.json";
const FLAG_DATA_URL =
  "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-flag.json";

interface PopulationRow {
  country: string;
  population: number;
}

interface CapitalRow {
  country: string;
  city: string;
}

interface FlagRow {
  country: string;
  flag_base64: string;
}

function normalizeCountryName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

async function fetchCountryDataset(signal?: AbortSignal): Promise<ApiCountry[]> {
  const response = await fetch(COUNTRY_DATA_URL, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as ApiCountry[];
}

async function fetchMetadataMaps(): Promise<{
  populationMap: Map<string, number>;
  capitalMap: Map<string, string>;
  flagMap: Map<string, string>;
}> {
  const [populationResponse, capitalResponse, flagResponse] = await Promise.all([
    fetch(POPULATION_DATA_URL),
    fetch(CAPITAL_DATA_URL),
    fetch(FLAG_DATA_URL),
  ]);

  if (!populationResponse.ok || !capitalResponse.ok || !flagResponse.ok) {
    throw new Error("Failed to load country metadata");
  }

  const populationRows = (await populationResponse.json()) as PopulationRow[];
  const capitalRows = (await capitalResponse.json()) as CapitalRow[];
  const flagRows = (await flagResponse.json()) as FlagRow[];

  return {
    populationMap: new Map(
      populationRows.map((row) => [normalizeCountryName(row.country), row.population])
    ),
    capitalMap: new Map(
      capitalRows.map((row) => [normalizeCountryName(row.country), row.city])
    ),
    flagMap: new Map(
      flagRows.map((row) => [normalizeCountryName(row.country), row.flag_base64])
    ),
  };
}

export async function fetchAllCountries(
  signal?: AbortSignal
): Promise<CountryListItem[]> {
  const data = await fetchCountryDataset(signal);

  return data
    .filter((item) => item.name?.common && item.cca2 && item.region)
    .map((item) => ({
      name: {
        common: item.name.common,
        official: item.name.official,
      },
      cca2: item.cca2,
      region: item.region,
    }))
    .sort((a, b) => a.name.common.localeCompare(b.name.common));
}

function toCountry(
  apiCountry: ApiCountry,
  metadata?: { population?: number; capital?: string; flagUrl?: string }
): Country {
  const flagFromDataset = metadata?.flagUrl ?? apiCountry.flags?.svg ?? apiCountry.flags?.png;

  return {
    code: apiCountry.cca2,
    name: apiCountry.name.common,
    officialName: apiCountry.name.official,
    capital: metadata?.capital ?? apiCountry.capital?.join(", ") ?? "No capital",
    region: apiCountry.region,
    population: metadata?.population ?? apiCountry.population ?? 0,
    area: apiCountry.area ?? 0,
    flagUrl:
      flagFromDataset ?? `https://flagcdn.com/w320/${apiCountry.cca2.toLowerCase()}.png`,
    flagAlt: `Flag of ${apiCountry.name.common}`,
  };
}

export async function fetchCountryByName(
  countryName: string,
  countryCode: string
): Promise<Country> {
  const [data, metadata] = await Promise.all([fetchCountryDataset(), fetchMetadataMaps()]);

  const countryQuery = normalizeCountryName(countryName);
  const match =
    data.find(
      (item) =>
        item.cca2 === countryCode ||
        normalizeCountryName(item.name.common) === countryQuery ||
        normalizeCountryName(item.name.official) === countryQuery
    ) ??
    data.find((item) => normalizeCountryName(item.name.common).includes(countryQuery)) ??
    data[0];

  if (!match) {
    throw new Error("Country not found");
  }

  const normalizedName = normalizeCountryName(match.name.common);

  return toCountry(match, {
    population: metadata.populationMap.get(normalizedName),
    capital: metadata.capitalMap.get(normalizedName),
    flagUrl: metadata.flagMap.get(normalizedName),
  });
}

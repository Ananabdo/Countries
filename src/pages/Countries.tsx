import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import CountryCard from "../components/CountryCard";
import { fetchAllCountries, fetchCountryByName } from "../services/countriesApi";
import type { Country, CountryListItem, RegionFilter } from "../types/Country";

interface CountriesProps {
  onSearch: (country: Country) => void;
  isFavorite: (code: string) => boolean;
  onToggleFavorite: (country: Country) => void;
}

const REGIONS: RegionFilter[] = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

export default function Countries({ onSearch, isFavorite, onToggleFavorite }: CountriesProps) {
  // רשימת המדינות ל-Select
  const [countries, setCountries] = useState<CountryListItem[]>([]);
  const [listLoading, setListLoading] = useState<boolean>(true);
  const [listError, setListError] = useState<string | null>(null);

  // סינון לפי אזור (בונוס 1)
  const [region, setRegion] = useState<RegionFilter>("All");

  // המדינה שנבחרה ופרטיה
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // מונע מצב שבו תשובה ישנה דורסת תשובה חדשה כשמחליפים בחירה מהר
  const latestRequest = useRef<number>(0);

  // טעינת רשימת המדינות פעם אחת כשהקומפוננטה נטענת
  useEffect(() => {
    const controller = new AbortController();

    fetchAllCountries(controller.signal)
      .then((data) => setCountries(data))
      .catch(() => {
        if (!controller.signal.aborted) {
          setListError("Failed to load the list of countries. Refresh the page to try again.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setListLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const visibleCountries =
    region === "All" ? countries : countries.filter((item) => item.region === region);

  function handleRegionChange(event: ChangeEvent<HTMLSelectElement>): void {
    const newRegion = REGIONS.find((r) => r === event.target.value) ?? "All";
    setRegion(newRegion);

    const stillVisible =
      newRegion === "All" ||
      countries.some((item) => item.cca2 === selectedCode && item.region === newRegion);

    if (!stillVisible) {
      setSelectedCode("");
    }
  }

  async function handleCountryChange(event: ChangeEvent<HTMLSelectElement>): Promise<void> {
    const code = event.target.value;
    setSelectedCode(code);

    const selected = countries.find((item) => item.cca2 === code);
    if (!selected) return;

    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);
    setCountry(null);

    try {
      const result = await fetchCountryByName(selected.name.common, selected.cca2);
      if (requestId !== latestRequest.current) return;

      setCountry(result);
      onSearch(result);
    } catch {
      if (requestId !== latestRequest.current) return;
      setError("Failed to load country information");
    } finally {
      if (requestId === latestRequest.current) {
        setLoading(false);
      }
    }
  }

  const selectsDisabled = listLoading || listError !== null;

  return (
    <section>
      <header className="page__header">
        <h1 className="page__title">Countries Explorer</h1>
        <p className="page__subtitle">
          Choose a country to see its capital, region, population, area and flag.
        </p>
      </header>

      <div className="filters">
        <div className="field">
          <label htmlFor="region-select" className="field__label">
            Region
          </label>
          <select
            id="region-select"
            className="select"
            value={region}
            onChange={handleRegionChange}
            disabled={selectsDisabled}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="country-select" className="field__label">
            Country
          </label>
          <select
            id="country-select"
            className="select"
            value={selectedCode}
            onChange={handleCountryChange}
            disabled={selectsDisabled}
          >
            <option value="" disabled>
              {listLoading ? "Loading..." : "Select a country"}
            </option>
            {visibleCountries.map((item) => (
              <option key={item.cca2} value={item.cca2}>
                {item.name.common}
              </option>
            ))}
          </select>
          {!selectsDisabled && (
            <span className="field__hint">
              {visibleCountries.length} countries
              {region !== "All" && ` in ${region}`}
            </span>
          )}
        </div>
      </div>

      <div aria-live="polite">
        {listError && (
          <div className="status status--error" role="alert">
            <p>{listError}</p>
          </div>
        )}

        {(listLoading || loading) && (
          <div className="status">
            <div className="spinner" aria-hidden="true" />
            <p>Loading...</p>
          </div>
        )}

        {error && !loading && (
          <div className="status status--error" role="alert">
            <p>{error}</p>
            <p className="status__hint">Check your connection and pick the country again.</p>
          </div>
        )}

        {country && !loading && (
          <CountryCard
            country={country}
            isFavorite={isFavorite(country.code)}
            onToggleFavorite={onToggleFavorite}
          />
        )}

        {!country && !loading && !error && !listLoading && !listError && (
          <div className="status">
            <p>Pick a country from the list to see its details here.</p>
          </div>
        )}
      </div>
    </section>
  );
}

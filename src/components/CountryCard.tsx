import type { Country } from "../types/Country";
import { formatCompact, formatNumber } from "../utils/format";

interface CountryCardProps {
  country: Country;
  isFavorite: boolean;
  onToggleFavorite: (country: Country) => void;
}

interface DetailProps {
  label: string;
  value: string;
  note?: string;
}

function Detail({ label, value, note }: DetailProps) {
  return (
    <div className="detail">
      <dt>{label}</dt>
      <dd>
        {value}
        {note && <span className="detail__note">{note}</span>}
      </dd>
    </div>
  );
}

export default function CountryCard({
  country,
  isFavorite,
  onToggleFavorite,
}: CountryCardProps) {
  return (
    <article className="country-card">
      <header className="country-card__header">
        <div>
          <h2 className="country-card__name">{country.name}</h2>
          {country.officialName !== country.name && (
            <p className="country-card__official">{country.officialName}</p>
          )}
        </div>

        <button
          type="button"
          className={isFavorite ? "btn btn--active" : "btn"}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(country)}
        >
          {isFavorite ? "★ Saved to favorites" : "☆ Add to Favorites"}
        </button>
      </header>

      <dl className="country-card__details">
        <Detail label="Country" value={country.name} />
        <Detail label="Capital" value={country.capital} />
        <Detail label="Region" value={country.region} />
        <Detail
          label="Population"
          value={formatNumber(country.population)}
          note={`about ${formatCompact(country.population)} people`}
        />
        <Detail label="Area" value={`${formatNumber(country.area)} km²`} />
      </dl>

      <div className="country-card__flag-area">
        <figure className="stamp">
          <img src={country.flagUrl} alt={country.flagAlt} />
        </figure>
      </div>
    </article>
  );
}

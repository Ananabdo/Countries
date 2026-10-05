import { Link } from "react-router-dom";
import type { Country } from "../types/Country";
import { formatCompact, formatNumber } from "../utils/format";

interface FavoritesProps {
  favorites: Country[];
  onRemove: (code: string) => void;
}

export default function Favorites({ favorites, onRemove }: FavoritesProps) {
  return (
    <section>
      <header className="page__header">
        <h1 className="page__title">Favorite Countries</h1>
        <p className="page__subtitle">Countries you saved. They stay here next time you visit.</p>
      </header>

      {favorites.length === 0 ? (
        <div className="status">
          <p>
            Nothing saved yet. Open a country on the <Link to="/">Countries</Link> page and
            press “Add to Favorites”.
          </p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((country) => (
            <article key={country.code} className="fav-card">
              <img className="fav-card__flag" src={country.flagUrl} alt={country.flagAlt} />
              <div className="fav-card__body">
                <h2 className="fav-card__name">{country.name}</h2>
                <dl className="fav-card__facts">
                  <div>
                    <dt>Capital</dt>
                    <dd>{country.capital}</dd>
                  </div>
                  <div>
                    <dt>Region</dt>
                    <dd>{country.region}</dd>
                  </div>
                  <div>
                    <dt>Population</dt>
                    <dd title={formatNumber(country.population)}>
                      {formatCompact(country.population)}
                    </dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="btn btn--quiet btn--small"
                  onClick={() => onRemove(country.code)}
                >
                  Remove from favorites
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

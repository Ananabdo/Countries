import { Link } from "react-router-dom";
import type { SearchHistoryItem } from "../types/Country";
import { formatDateTime } from "../utils/format";

interface HistoryProps {
  history: SearchHistoryItem[];
  onClear: () => void;
}

export default function History({ history, onClear }: HistoryProps) {
  return (
    <section>
      <header className="page__header">
        <h1 className="page__title">Search History</h1>
        <p className="page__subtitle">Every country you looked up during this visit.</p>
      </header>

      {history.length === 0 ? (
        <div className="status">
          <p>
            No searches yet. <Link to="/">Choose a country</Link> and it will show up here.
          </p>
        </div>
      ) : (
        <>
          <div className="toolbar">
            <span className="toolbar__count">
              {history.length} {history.length === 1 ? "search" : "searches"}
            </span>
            <button type="button" className="btn btn--quiet" onClick={onClear}>
              Clear history
            </button>
          </div>

          <div className="table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th scope="col">Search Time</th>
                  <th scope="col">Country</th>
                  <th scope="col">Capital</th>
                  <th scope="col">Region</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="cell-time">
                      <time dateTime={item.searchTime.toISOString()}>
                        {formatDateTime(item.searchTime)}
                      </time>
                    </td>
                    <td>
                      <span className="cell-country">
                        <img src={item.country.flagUrl} alt="" />
                        {item.country.name}
                      </span>
                    </td>
                    <td>{item.country.capital}</td>
                    <td>
                      <span className="region-tag">{item.country.region}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

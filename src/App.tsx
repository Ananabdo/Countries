import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Countries from "./pages/Countries";
import History from "./pages/History";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import type { Country, SearchHistoryItem } from "./types/Country";

const FAVORITES_KEY = "countries-explorer:favorites";

function loadFavorites(): Country[] {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? (JSON.parse(saved) as Country[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  // ההיסטוריה והמועדפים נשמרים ב-App כדי שכל הדפים יוכלו לגשת אליהם
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<Country[]>(loadFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // אם האחסון לא זמין, המועדפים פשוט לא יישמרו בין ביקורים
    }
  }, [favorites]);

  function addToHistory(country: Country): void {
    const entry: SearchHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      searchTime: new Date(),
      country,
    };
    setHistory((prev) => [...prev, entry]);
  }

  function clearHistory(): void {
    setHistory([]);
  }

  function isFavorite(code: string): boolean {
    return favorites.some((fav) => fav.code === code);
  }

  function toggleFavorite(country: Country): void {
    setFavorites((prev) =>
      prev.some((fav) => fav.code === country.code)
        ? prev.filter((fav) => fav.code !== country.code)
        : [...prev, country]
    );
  }

  function removeFavorite(code: string): void {
    setFavorites((prev) => prev.filter((fav) => fav.code !== code));
  }

  return (
    <>
      <Navbar favoritesCount={favorites.length} />
      <main className="page">
        <Routes>
          <Route
            path="/"
            element={
              <Countries
                onSearch={addToHistory}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/history"
            element={<History history={history} onClear={clearHistory} />}
          />
          <Route
            path="/favorites"
            element={<Favorites favorites={favorites} onRemove={removeFavorite} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

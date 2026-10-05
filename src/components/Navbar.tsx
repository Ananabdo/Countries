import { Link, NavLink } from "react-router-dom";

interface NavbarProps {
  favoritesCount: number;
}

interface NavItem {
  to: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Countries" },
  { to: "/history", label: "History" },
  { to: "/favorites", label: "Favorites" },
  { to: "/about", label: "About" },
];

export default function Navbar({ favoritesCount }: NavbarProps) {
  return (
    <header className="navbar">
      <nav className="navbar__inner" aria-label="Main navigation">
        <Link to="/" className="navbar__brand">
          <span aria-hidden="true">🌍</span>
          Countries Explorer
        </Link>

        <ul className="navbar__links">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  isActive ? "navbar__link is-active" : "navbar__link"
                }
              >
                {item.label}
                {item.to === "/favorites" && favoritesCount > 0 && (
                  <span className="navbar__count">{favoritesCount}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

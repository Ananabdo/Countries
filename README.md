# Countries Explorer

אתר להצגת מידע על מדינות בעולם — React + TypeScript + Vite + React Router.

## הרצה

```bash
npm install
npm run dev
```

ואז לפתוח את הכתובת ש-Vite מציג (בדרך כלל http://localhost:5173).

## מבנה

```
src
├── components
│   ├── Navbar.tsx        תפריט ניווט (NavLink)
│   └── CountryCard.tsx   כרטיס מדינה + דגל + כפתור מועדפים
├── pages
│   ├── Countries.tsx     Select אזור + Select מדינה, useEffect, fetch
│   ├── History.tsx       טבלת היסטוריית חיפושים
│   ├── Favorites.tsx     בונוס 2 – מדינות מועדפות
│   └── About.tsx         אודות + פרטי המתכנת/ת
├── services
│   └── countriesApi.ts   כל קריאות ה-fetch ל-REST Countries
├── types
│   └── Country.ts        Types / Interfaces
├── utils
│   └── format.ts         עיצוב מספרים ותאריכים
├── App.tsx               Routes + state משותף (היסטוריה, מועדפים)
├── main.tsx
└── index.css
```

## הערות

- יש להחליף את פרטי המתכנת/ת בקובץ `src/pages/About.tsx`.
- היסטוריית החיפושים נשמרת ב-state ומתאפסת ברענון הדף. המועדפים נשמרים גם ב-localStorage.

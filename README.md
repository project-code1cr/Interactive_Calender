# Interactive Calendar (Frontend Challenge)

A polished React calendar experience inspired by a physical wall calendar. It is fully frontend-only, responsive, and interaction-heavy, with persistent notes, dynamic holiday context, and smooth month transitions.

## Highlights

- Wall-calendar style UI with binding rings, hero area, and month chip
- Month flip transition animation (Prev/Next)
- Drag or click date-range selection
- Monthly notes and date-specific notes
- localStorage persistence by month
- Weekend and Sunday visual markers
- Holiday badges inside date cells
- Hover holiday details with name, religion/category, and description
- Dynamic holiday mapping by year (fixed + movable holidays)
- Sidebar holiday panel with religion/category filter
- Click holiday in panel to jump to that date
- 12-dot month progress indicator (January to current month)

## Tech Stack

- React 18
- Vite 5
- Plain CSS
- Browser localStorage

## Getting Started

```bash
npm install
npm run dev
```

Default dev URL:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
npm run preview
```

## Interaction Guide

1. Select a range by clicking start and end dates.
2. Drag across day cells for faster range selection.
3. Add a monthly note and a day-specific note.
4. Hover holiday-marked dates to view celebration details.
5. Use the holiday sidebar filter and click a holiday to jump to that date.
6. Use month dots at the top to jump directly to a month.

## Dynamic Holiday Support

- Fixed-date holidays are generated per selected year.
- Movable holiday data is included for 2024 to 2028.
- Current movable set includes Good Friday, Holi, Eid al-Fitr, and Diwali.

## Responsive Behavior

- Desktop: split layout for notes and calendar grid
- Mobile: stacked layout for touch-friendly interaction

## Project Structure

```text
.
├── index.html
├── package.json
├── vite.config.js
└── src
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```

## Scope Compliance

- Frontend only
- No backend, no database, no API
- Data handled client-side via localStorage


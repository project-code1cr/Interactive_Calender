import { useMemo, useState, useEffect } from 'react';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const FIXED_HOLIDAYS = [
  {
    monthDay: '01-01',
    name: "New Year's Day",
    religion: 'Secular / Global',
    description: 'Marks the first day of the Gregorian calendar year.'
  },
  {
    monthDay: '01-14',
    name: 'Makar Sankranti',
    religion: 'Hindu',
    description: 'Celebrates the sun\'s transition into Makara and the harvest season.'
  },
  {
    monthDay: '01-26',
    name: 'Republic Day (India)',
    religion: 'National / Secular',
    description: 'Commemorates the adoption of the Constitution of India in 1950.'
  },
  {
    monthDay: '04-14',
    name: 'Ambedkar Jayanti',
    religion: 'National / Social Reform',
    description: 'Honors Dr. B. R. Ambedkar and his contribution to social justice and the Constitution.'
  },
  {
    monthDay: '08-15',
    name: 'Independence Day (India)',
    religion: 'National / Secular',
    description: 'Celebrates India\'s independence from British rule in 1947.'
  },
  {
    monthDay: '10-02',
    name: 'Gandhi Jayanti',
    religion: 'National / Secular',
    description: 'Marks the birth anniversary of Mahatma Gandhi.'
  },
  {
    monthDay: '12-25',
    name: 'Christmas',
    religion: 'Christianity',
    description: 'Celebrates the birth of Jesus Christ.'
  }
];

const MOVABLE_HOLIDAYS_BY_YEAR = {
  2024: [
    {
      iso: '2024-03-29',
      name: 'Good Friday',
      religion: 'Christianity',
      description: 'Commemorates the crucifixion of Jesus Christ before Easter Sunday.'
    },
    {
      iso: '2024-03-25',
      name: 'Holi',
      religion: 'Hindu',
      description: 'Festival of colors celebrating spring, joy, and the victory of good over evil.'
    },
    {
      iso: '2024-04-11',
      name: 'Eid al-Fitr',
      religion: 'Islam',
      description: 'Festival marking the end of Ramadan, celebrated with prayer and charity.'
    },
    {
      iso: '2024-11-01',
      name: 'Diwali',
      religion: 'Hindu',
      description: 'Festival of lights celebrating prosperity and the triumph of light over darkness.'
    }
  ],
  2025: [
    {
      iso: '2025-04-18',
      name: 'Good Friday',
      religion: 'Christianity',
      description: 'Commemorates the crucifixion of Jesus Christ before Easter Sunday.'
    },
    {
      iso: '2025-03-14',
      name: 'Holi',
      religion: 'Hindu',
      description: 'Festival of colors celebrating spring, joy, and the victory of good over evil.'
    },
    {
      iso: '2025-03-31',
      name: 'Eid al-Fitr',
      religion: 'Islam',
      description: 'Festival marking the end of Ramadan, celebrated with prayer and charity.'
    },
    {
      iso: '2025-10-20',
      name: 'Diwali',
      religion: 'Hindu',
      description: 'Festival of lights celebrating prosperity and the triumph of light over darkness.'
    }
  ],
  2026: [
    {
      iso: '2026-04-03',
      name: 'Good Friday',
      religion: 'Christianity',
      description: 'Commemorates the crucifixion of Jesus Christ before Easter Sunday.'
    },
    {
      iso: '2026-03-03',
      name: 'Holi',
      religion: 'Hindu',
      description: 'Festival of colors celebrating spring, joy, and the victory of good over evil.'
    },
    {
      iso: '2026-03-20',
      name: 'Eid al-Fitr',
      religion: 'Islam',
      description: 'Festival marking the end of Ramadan, celebrated with prayer and charity.'
    },
    {
      iso: '2026-11-08',
      name: 'Diwali',
      religion: 'Hindu',
      description: 'Festival of lights celebrating prosperity and the triumph of light over darkness.'
    }
  ],
  2027: [
    {
      iso: '2027-03-26',
      name: 'Good Friday',
      religion: 'Christianity',
      description: 'Commemorates the crucifixion of Jesus Christ before Easter Sunday.'
    },
    {
      iso: '2027-03-22',
      name: 'Holi',
      religion: 'Hindu',
      description: 'Festival of colors celebrating spring, joy, and the victory of good over evil.'
    },
    {
      iso: '2027-03-10',
      name: 'Eid al-Fitr',
      religion: 'Islam',
      description: 'Festival marking the end of Ramadan, celebrated with prayer and charity.'
    },
    {
      iso: '2027-10-29',
      name: 'Diwali',
      religion: 'Hindu',
      description: 'Festival of lights celebrating prosperity and the triumph of light over darkness.'
    }
  ],
  2028: [
    {
      iso: '2028-04-14',
      name: 'Good Friday',
      religion: 'Christianity',
      description: 'Commemorates the crucifixion of Jesus Christ before Easter Sunday.'
    },
    {
      iso: '2028-03-11',
      name: 'Holi',
      religion: 'Hindu',
      description: 'Festival of colors celebrating spring, joy, and the victory of good over evil.'
    },
    {
      iso: '2028-02-28',
      name: 'Eid al-Fitr',
      religion: 'Islam',
      description: 'Festival marking the end of Ramadan, celebrated with prayer and charity.'
    },
    {
      iso: '2028-10-17',
      name: 'Diwali',
      religion: 'Hindu',
      description: 'Festival of lights celebrating prosperity and the triumph of light over darkness.'
    }
  ]
};

function buildHolidayMapForYear(year) {
  const map = {};

  FIXED_HOLIDAYS.forEach((holiday) => {
    map[`${year}-${holiday.monthDay}`] = {
      name: holiday.name,
      religion: holiday.religion,
      description: holiday.description
    };
  });

  const movable = MOVABLE_HOLIDAYS_BY_YEAR[year] || [];
  movable.forEach((holiday) => {
    map[holiday.iso] = {
      name: holiday.name,
      religion: holiday.religion,
      description: holiday.description
    };
  });

  return map;
}

function formatISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseISODate(isoDate) {
  const [yearStr, monthStr, dayStr] = isoDate.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function atMidnight(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push({
      id: `empty-start-${i}`,
      dayNumber: null,
      date: null
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({
      id: formatISO(date),
      dayNumber: day,
      date
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      id: `empty-end-${cells.length}`,
      dayNumber: null,
      date: null
    });
  }

  return cells;
}

function orderedRange(start, end) {
  if (!start || !end) {
    return [start, end];
  }

  return start <= end ? [start, end] : [end, start];
}

function buildRangeKey(start, end) {
  if (!start || !end) {
    return null;
  }

  return `${formatISO(start)}__${formatISO(end)}`;
}

function buildSavedRangeDateKeySet(rangeNotes) {
  const dateKeys = new Set();

  Object.entries(rangeNotes).forEach(([rangeKey, note]) => {
    if (!note || !note.trim()) {
      return;
    }

    const [startIso, endIso] = rangeKey.split('__');
    if (!startIso || !endIso) {
      return;
    }

    const startDate = parseISODate(startIso);
    const endDate = parseISODate(endIso);
    if (!startDate || !endDate) {
      return;
    }

    const start = atMidnight(startDate);
    const end = atMidnight(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return;
    }

    const [from, to] = start <= end ? [start, end] : [end, start];
    const cursor = new Date(from);
    while (cursor <= to) {
      dateKeys.add(formatISO(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  return dateKeys;
}

function parseRangeKey(rangeKey) {
  const [startIso, endIso] = rangeKey.split('__');
  if (!startIso || !endIso) {
    return null;
  }

  const startDate = parseISODate(startIso);
  const endDate = parseISODate(endIso);
  if (!startDate || !endDate) {
    return null;
  }

  const start = atMidnight(startDate);
  const end = atMidnight(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  return start <= end ? { start, end } : { start: end, end: start };
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA <= endB && startB <= endA;
}

export default function App() {
  const today = useMemo(() => atMidnight(new Date()), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeDate, setActiveDate] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAnchor, setDragAnchor] = useState(null);
  const [dragHasMoved, setDragHasMoved] = useState(false);
  const [suppressNextClick, setSuppressNextClick] = useState(false);
  const [monthDirection, setMonthDirection] = useState('next');
  const [gridAnimationKey, setGridAnimationKey] = useState(0);

  const [monthlyNote, setMonthlyNote] = useState('');
  const [specificNotes, setSpecificNotes] = useState({});
  const [rangeNotes, setRangeNotes] = useState({});
  const [holidayReligionFilter, setHolidayReligionFilter] = useState('All');
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);

  const storageKey = `${year}-${month + 1}`;

  useEffect(() => {
    setIsStorageHydrated(false);
    const raw = localStorage.getItem(`calendar-notes-${storageKey}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setMonthlyNote(parsed.monthlyNote || '');
        setSpecificNotes(parsed.specificNotes || {});
        setRangeNotes(parsed.rangeNotes || {});
      } catch {
        setMonthlyNote('');
        setSpecificNotes({});
        setRangeNotes({});
      }
    } else {
      setMonthlyNote('');
      setSpecificNotes({});
      setRangeNotes({});
    }

    setIsStorageHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!isStorageHydrated) {
      return;
    }

    localStorage.setItem(
      `calendar-notes-${storageKey}`,
      JSON.stringify({
        monthlyNote,
        specificNotes,
        rangeNotes
      })
    );
  }, [storageKey, monthlyNote, specificNotes, rangeNotes, isStorageHydrated]);

  useEffect(() => {
    function releaseDrag() {
      setIsDragging(false);
      setDragAnchor(null);
      setDragHasMoved(false);
    }

    window.addEventListener('mouseup', releaseDrag);
    return () => {
      window.removeEventListener('mouseup', releaseDrag);
    };
  }, []);

  const holidayMap = useMemo(() => buildHolidayMapForYear(year), [year]);
  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);
  const monthHolidays = useMemo(() => {
    return grid
      .filter((cell) => cell.date)
      .map((cell) => ({
        date: cell.date,
        dayNumber: cell.dayNumber,
        holiday: holidayMap[formatISO(cell.date)] || null
      }))
      .filter((entry) => entry.holiday);
  }, [grid, holidayMap]);

  const holidayReligions = useMemo(() => {
    const religions = monthHolidays.map((entry) => entry.holiday.religion);
    return ['All', ...Array.from(new Set(religions))];
  }, [monthHolidays]);

  const filteredMonthHolidays = useMemo(() => {
    if (holidayReligionFilter === 'All') {
      return monthHolidays;
    }

    return monthHolidays.filter((entry) => entry.holiday.religion === holidayReligionFilter);
  }, [monthHolidays, holidayReligionFilter]);

  useEffect(() => {
    if (!holidayReligions.includes(holidayReligionFilter)) {
      setHolidayReligionFilter('All');
    }
  }, [holidayReligions, holidayReligionFilter]);
  const [rangeStart, rangeEnd] = orderedRange(startDate, endDate);
  const activeRangeKey = buildRangeKey(rangeStart, rangeEnd);
  const activeRangeNote = activeRangeKey ? rangeNotes[activeRangeKey] || '' : '';
  const hasSavedActiveRange = Boolean(activeRangeKey && rangeNotes[activeRangeKey]?.trim());
  const savedRangeDateKeys = useMemo(() => buildSavedRangeDateKeySet(rangeNotes), [rangeNotes]);
  const hasSavedOverlapInSelection = useMemo(() => {
    if (!rangeStart || !rangeEnd) {
      return false;
    }

    return Object.entries(rangeNotes).some(([rangeKey, note]) => {
      if (!note || !note.trim()) {
        return false;
      }

      const parsed = parseRangeKey(rangeKey);
      if (!parsed) {
        return false;
      }

      return rangesOverlap(parsed.start, parsed.end, rangeStart, rangeEnd);
    });
  }, [rangeNotes, rangeStart, rangeEnd]);

  const activeNoteKey = activeDate ? formatISO(activeDate) : null;
  const activeNote = activeNoteKey ? specificNotes[activeNoteKey] || '' : '';
  const hasSavedActiveDay = Boolean(activeNoteKey && specificNotes[activeNoteKey]?.trim());

  function shiftMonth(direction) {
    const moved = new Date(year, month + direction, 1);
    setMonthDirection(direction < 0 ? 'prev' : 'next');
    setGridAnimationKey((prev) => prev + 1);
    setYear(moved.getFullYear());
    setMonth(moved.getMonth());
    setStartDate(null);
    setEndDate(null);
    setActiveDate(null);
    setIsDragging(false);
    setDragAnchor(null);
    setDragHasMoved(false);
  }

  function jumpToMonth(targetMonth) {
    if (targetMonth === month) {
      return;
    }

    setMonthDirection(targetMonth < month ? 'prev' : 'next');
    setGridAnimationKey((prev) => prev + 1);
    setMonth(targetMonth);
    setStartDate(null);
    setEndDate(null);
    setActiveDate(null);
    setIsDragging(false);
    setDragAnchor(null);
    setDragHasMoved(false);
  }

  function handleDayMouseDown(date) {
    if (!date) {
      return;
    }

    const normalized = atMidnight(date);
    setDragAnchor(normalized);
    setDragHasMoved(false);
    setSuppressNextClick(false);
    setIsDragging(true);
  }

  function handleDayMouseEnter(date) {
    if (!isDragging || !date || !dragAnchor) {
      return;
    }

    const normalized = atMidnight(date);
    setDragHasMoved(true);
    setStartDate(dragAnchor);
    setEndDate(normalized);
    setActiveDate(normalized);
  }

  function handleDayMouseUp(date) {
    if (!isDragging || !date || !dragAnchor) {
      return;
    }

    const normalized = atMidnight(date);
    if (dragHasMoved) {
      setStartDate(dragAnchor);
      setEndDate(normalized);
      setActiveDate(normalized);
    } else {
      handleDayClick(normalized);
    }

    setSuppressNextClick(true);
    setIsDragging(false);
    setDragAnchor(null);
    setDragHasMoved(false);
  }

  function handleDayClick(date) {
    if (!date) {
      return;
    }

    if (suppressNextClick) {
      setSuppressNextClick(false);
      return;
    }

    const normalized = atMidnight(date);
    const clickedSameSingleSelection =
      activeDate &&
      startDate &&
      !endDate &&
      activeDate.getTime() === normalized.getTime() &&
      startDate.getTime() === normalized.getTime();

    if (clickedSameSingleSelection) {
      clearSelection();
      return;
    }

    if (!startDate || (startDate && endDate)) {
      setStartDate(normalized);
      setEndDate(null);
    } else {
      setEndDate(normalized);
    }

    setActiveDate(normalized);
  }

  function isInRange(date) {
    if (!date || !rangeStart || !rangeEnd) {
      return false;
    }

    return date >= rangeStart && date <= rangeEnd;
  }

  function isStart(date) {
    return startDate && date && date.getTime() === startDate.getTime();
  }

  function isEnd(date) {
    return endDate && date && date.getTime() === endDate.getTime();
  }

  function isToday(date) {
    return date && date.getTime() === today.getTime();
  }

  function saveSpecificNote(value) {
    if (!activeNoteKey) {
      return;
    }

    setSpecificNotes((prev) => ({
      ...prev,
      [activeNoteKey]: value
    }));
  }

  function deleteActiveDayMemory() {
    if (!activeNoteKey) {
      return;
    }

    setSpecificNotes((prev) => {
      if (!prev[activeNoteKey]) {
        return prev;
      }

      const next = { ...prev };
      delete next[activeNoteKey];
      return next;
    });
  }

  function saveRangeNote(value) {
    if (!activeRangeKey) {
      return;
    }

    setRangeNotes((prev) => {
      if (!value.trim()) {
        const next = { ...prev };
        delete next[activeRangeKey];
        return next;
      }

      return {
        ...prev,
        [activeRangeKey]: value
      };
    });
  }

  function jumpToDate(date) {
    const normalized = atMidnight(date);
    setActiveDate(normalized);
    setStartDate(normalized);
    setEndDate(null);
  }

  function deleteActiveRangeMemory() {
    if (!rangeStart || !rangeEnd) {
      return;
    }

    setRangeNotes((prev) => {
      let removedAny = false;
      const next = {};

      Object.entries(prev).forEach(([rangeKey, note]) => {
        const parsed = parseRangeKey(rangeKey);
        const shouldRemove =
          parsed && note && note.trim() && rangesOverlap(parsed.start, parsed.end, rangeStart, rangeEnd);

        if (shouldRemove) {
          removedAny = true;
          return;
        }

        next[rangeKey] = note;
      });

      return removedAny ? next : prev;
    });
  }

  function clearSelection() {
    setStartDate(null);
    setEndDate(null);
    setActiveDate(null);
    setIsDragging(false);
    setDragAnchor(null);
    setDragHasMoved(false);
  }

  const rangeLabel =
    rangeStart && rangeEnd
      ? `${formatISO(rangeStart)} to ${formatISO(rangeEnd)}`
      : startDate
      ? `Start: ${formatISO(startDate)} (pick end date)`
      : 'Pick a start date and an end date';

  return (
    <main className="page-shell">
      <section className="calendar-card" aria-label="Interactive wall calendar">
        <header className="calendar-top">
          <div className="binding" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, idx) => (
              <span key={idx} className="ring" />
            ))}
          </div>
          <div className="month-progress" role="group" aria-label="Month progress indicator">
            {MONTH_NAMES.map((monthName, index) => {
              const isPassed = index < month;
              const isCurrent = index === month;

              return (
                <button
                  key={monthName}
                  type="button"
                  className={['month-dot', isPassed ? 'passed' : '', isCurrent ? 'current' : ''].filter(Boolean).join(' ')}
                  onClick={() => jumpToMonth(index)}
                  title={monthName}
                  aria-label={`Jump to ${monthName}`}
                  aria-pressed={isCurrent}
                />
              );
            })}
          </div>
          <div className="hero-area">
            <img
              className="hero-image"
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
              alt="Mountain climber for calendar theme"
            />
            <div className="hero-cut" aria-hidden="true" />
            <div className="month-chip">
              <p>{year}</p>
              <h1>{MONTH_NAMES[month]}</h1>
            </div>
          </div>
        </header>

        <section className="calendar-bottom">
          <div className="notes-column">
            <h2>Monthly Notes</h2>
            <textarea
              value={monthlyNote}
              onChange={(event) => setMonthlyNote(event.target.value)}
              placeholder="Add high-level goals, reminders, or tasks..."
            />

            <div className="holiday-panel">
              <div className="holiday-panel-head">
                <h3>Month Holidays</h3>
                <select value={holidayReligionFilter} onChange={(event) => setHolidayReligionFilter(event.target.value)}>
                  {holidayReligions.map((religion) => (
                    <option key={religion} value={religion}>
                      {religion}
                    </option>
                  ))}
                </select>
              </div>

              {filteredMonthHolidays.length ? (
                <ul className="holiday-list">
                  {filteredMonthHolidays.map((entry) => (
                    <li key={`${formatISO(entry.date)}-${entry.holiday.name}`}>
                      <button type="button" onClick={() => jumpToDate(entry.date)} className="holiday-item-btn">
                        <span className="holiday-item-date">{entry.dayNumber}</span>
                        <span className="holiday-item-copy">
                          <strong>{entry.holiday.name}</strong>
                          <small>{entry.holiday.religion}</small>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="holiday-empty">No holidays for selected filter in this month.</p>
              )}
            </div>

            <h3>Selected Day / Range Note</h3>
            <p className="helper-text">{activeDate ? formatISO(activeDate) : 'Select a date to attach a note'}</p>
            <textarea
              value={activeNote}
              onChange={(event) => saveSpecificNote(event.target.value)}
              placeholder="Attach a note for the selected day..."
              disabled={!activeDate}
            />
            <div className="day-actions">
              <button
                type="button"
                className="delete-day-memory-btn"
                onClick={deleteActiveDayMemory}
                disabled={!hasSavedActiveDay}
              >
                Delete Day Memory
              </button>
            </div>

            <h3>Selected Range Note</h3>
            <p className="helper-text">
              {activeRangeKey
                ? `${formatISO(rangeStart)} to ${formatISO(rangeEnd)}${hasSavedActiveRange ? ' (saved)' : ' (not saved yet)'}`
                : 'Select a full date range to attach a range note'}
            </p>
            <textarea
              value={activeRangeNote}
              onChange={(event) => saveRangeNote(event.target.value)}
              placeholder="Attach a note for the selected range..."
              disabled={!activeRangeKey}
            />
            <div className="range-actions">
              <button
                type="button"
                className="delete-range-memory-btn"
                onClick={deleteActiveRangeMemory}
                disabled={!hasSavedOverlapInSelection}
              >
                Delete Range Memory (Selected Dates)
              </button>
            </div>
          </div>

          <div className="grid-column">
            <div className="toolbar">
              <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">
                Prev
              </button>
              <p>{rangeLabel}</p>
              <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">
                Next
              </button>
            </div>
            <button
              type="button"
              className="clear-range-btn"
              onClick={clearSelection}
              disabled={!startDate && !endDate && !activeDate}
            >
              Clear Selected Range
            </button>

            <div className="day-labels" aria-hidden="true">
              {DAY_LABELS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className={[`date-grid`, monthDirection === 'prev' ? 'flip-prev' : 'flip-next'].join(' ')} key={gridAnimationKey}>
              {grid.map((cell) => {
                if (!cell.date) {
                  return <span className="empty-cell" key={cell.id} />;
                }

                const inRange = isInRange(cell.date);
                const start = isStart(cell.date);
                const end = isEnd(cell.date);
                const selected = activeDate && activeDate.getTime() === cell.date.getTime();
                const todayCell = isToday(cell.date);
                const noteKey = formatISO(cell.date);
                const hasNote = Boolean(specificNotes[noteKey]?.trim());
                const hasSavedRange = savedRangeDateKeys.has(noteKey);
                const dayOfWeek = cell.date.getDay();
                const isSunday = dayOfWeek === 0;
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const holiday = holidayMap[formatISO(cell.date)] || null;
                const hasRangeDot = Boolean(rangeStart && rangeEnd && inRange);
                const hoverInfo = holiday
                  ? `${holiday.name}\nReligion: ${holiday.religion}\n${holiday.description}`
                  : isSunday
                  ? 'Sunday: weekly day of rest and weekend.'
                  : isWeekend
                  ? 'Weekend day.'
                  : '';

                return (
                  <button
                    key={cell.id}
                    type="button"
                    className={[
                      'day-cell',
                      inRange ? 'in-range' : '',
                      start ? 'range-start' : '',
                      end ? 'range-end' : '',
                      selected ? 'active' : '',
                      todayCell ? 'today' : '',
                      hasSavedRange ? 'saved-range' : '',
                      isWeekend ? 'weekend' : '',
                      isSunday ? 'sunday' : '',
                      holiday ? 'holiday' : ''
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleDayClick(cell.date)}
                    onMouseDown={() => handleDayMouseDown(cell.date)}
                    onMouseEnter={() => handleDayMouseEnter(cell.date)}
                    onMouseUp={() => handleDayMouseUp(cell.date)}
                    aria-pressed={selected}
                    title={hoverInfo}
                    aria-label={holiday ? `${cell.dayNumber}. ${hoverInfo}` : `${cell.dayNumber}`}
                  >
                    <span className="day-number">{cell.dayNumber}</span>
                    {holiday ? <span className="holiday-pill">{holiday.name}</span> : null}
                    {!holiday && isSunday ? <span className="sunday-mark">Sun</span> : null}
                    {hasSavedRange ? <span className="range-memory-dot" aria-hidden="true" /> : null}
                    {hasRangeDot ? <span className="range-dot" aria-hidden="true" /> : null}
                    {hasNote ? <span className="note-dot" aria-hidden="true" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

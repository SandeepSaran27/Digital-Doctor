import { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enIN from 'date-fns/locale/en-IN';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-IN': enIN };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const DoctorCalendar = ({ events = [], onSelectSlot, onSelectEvent }) => {
    const [view, setView] = useState('week');
    const [date, setDate] = useState(new Date());

    const handleSelectSlot = useCallback((slot) => {
        if (onSelectSlot) onSelectSlot(slot);
    }, [onSelectSlot]);

    const eventStyleGetter = (event) => ({
        style: {
            backgroundColor: event.status === 'completed' ? '#10b981' :
                event.status === 'cancelled' ? '#ef4444' : '#6366f1',
            borderRadius: '8px',
            border: 'none',
            color: '#fff',
            fontSize: '12px',
            padding: '2px 6px',
        },
    });

    return (
        <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 dark:text-white">🗓️ Doctor Calendar</h3>
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-xl p-0.5">
                    {['month', 'week', 'day'].map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${view === v ? 'bg-white dark:bg-slate-600 text-primary-600 shadow-sm' : 'text-slate-500'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>
            <div className="p-4" style={{ height: 520 }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    view={view}
                    date={date}
                    onView={setView}
                    onNavigate={setDate}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={onSelectEvent}
                    eventPropGetter={eventStyleGetter}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    formats={{
                        timeGutterFormat: 'HH:mm',
                        eventTimeRangeFormat: ({ start, end }) =>
                            `${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`,
                    }}
                />
            </div>
        </div>
    );
};

export default DoctorCalendar;

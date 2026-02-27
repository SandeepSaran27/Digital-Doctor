import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DoctorCalendar from '@/components/DoctorCalendar';
import api from '@/services/api';
import { format } from 'date-fns';

const DoctorCalendarPage = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        api.get('/appointments').then(({ data }) => {
            const evts = (data.data || []).map((a) => ({
                id: a._id,
                title: `#${a.tokenNumber} - ${a.patient?.firstName || 'Patient'}`,
                start: new Date(a.appointmentDate),
                end: new Date(new Date(a.appointmentDate).getTime() + 15 * 60 * 1000),
                status: a.status,
            }));
            setEvents(evts);
        }).catch(() => { });
    }, []);

    return (
        <div className="space-y-5 animate-fade-in">
            <h1 className="page-title">{t('nav.calendar')}</h1>
            <DoctorCalendar events={events} onSelectEvent={(e) => console.log('Selected event:', e)} />
        </div>
    );
};

export default DoctorCalendarPage;

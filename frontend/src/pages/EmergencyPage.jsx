import { useTranslation } from 'react-i18next';
import EmergencyPanel from '@/components/EmergencyPanel';

const EmergencyPage = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-5 animate-fade-in">
            <h1 className="page-title">{t('emergency.title')}</h1>
            <EmergencyPanel />
        </div>
    );
};

export default EmergencyPage;

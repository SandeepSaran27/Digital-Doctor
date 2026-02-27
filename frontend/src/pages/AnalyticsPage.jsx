import { useTranslation } from 'react-i18next';
import AnalyticsCharts from '@/components/AnalyticsCharts';

const AnalyticsPage = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-5 animate-fade-in">
            <h1 className="page-title">{t('nav.analytics')}</h1>
            <AnalyticsCharts />
        </div>
    );
};

export default AnalyticsPage;

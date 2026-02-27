import { useTranslation } from 'react-i18next';
import QueueBoard from '@/components/QueueBoard';

const QueuePage = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-5 animate-fade-in">
            <h1 className="page-title">{t('nav.queue')}</h1>
            <QueueBoard />
        </div>
    );
};

export default QueuePage;

import { useTranslation } from 'react-i18next';
import SymptomSelector from '@/components/SymptomSelector';

const SymptomsPage = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-5 animate-fade-in">
            <h1 className="page-title">{t('symptoms.title')}</h1>
            <SymptomSelector />
        </div>
    );
};

export default SymptomsPage;

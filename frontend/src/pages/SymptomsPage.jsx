/*import { useTranslation } from 'react-i18next';
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
*/
import { useTranslation } from 'react-i18next';
import SymptomSelector from '@/components/SymptomSelector';

const SymptomsPage = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-8 animate-fade-in w-full max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-slate-800 rounded-3xl p-8 lg:p-12 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10"></div>

                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-4 border border-white/20">
                        ✨ AI-Powered Analysis
                    </span>
                    <h1 className="text-3xl lg:text-4xl font-extrabold mb-4">{t('symptoms.title')}</h1>
                    <p className="text-indigo-100 text-lg">
                        Select your symptoms or add new ones. Our advanced AI will analyze your condition and provide an expected diagnosis instantly.
                    </p>
                </div>
            </div>

            {/* Core Component */}
            <SymptomSelector />
        </div>
    );
};

export default SymptomsPage;

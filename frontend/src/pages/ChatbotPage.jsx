import { useTranslation } from 'react-i18next';

const ChatbotPage = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-5 animate-fade-in">
            <h1 className="page-title">{t('chatbot.title')}</h1>
            <div className="card max-w-2xl">
                <div className="text-center py-8 text-slate-400 space-y-3">
                    <div className="text-6xl">🤖</div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">AI Medical Assistant is ready</p>
                    <p className="text-sm">Click the floating 🤖 button in the bottom-right corner to start chatting with Gemini AI.</p>
                    <p className="text-xs text-slate-400">Supports voice input via your microphone and EN/HI languages.</p>
                </div>
            </div>
        </div>
    );
};

export default ChatbotPage;

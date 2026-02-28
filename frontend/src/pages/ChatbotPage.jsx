/*import { useTranslation } from 'react-i18next';

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
*/

import { useTranslation } from 'react-i18next';
import { Bot, Mic, Languages, ShieldCheck, Sparkles } from 'lucide-react';

const ChatbotPage = () => {
    const { t } = useTranslation();

    const features = [
        { 
            icon: <Mic className="w-5 h-5 text-blue-500" />, 
            title: "Voice Commands", 
            desc: "Talk naturally with the AI using your microphone." 
        },
        { 
            icon: <Languages className="w-5 h-5 text-purple-500" />, 
            title: "Multilingual", 
            desc: "Switch seamlessly between English and Hindi (हिन्दी)." 
        },
        { 
            icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, 
            title: "Safe & Private", 
            desc: "Encrypted assistant powered by Google Gemini AI." 
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up py-6">
            {/* Header Section */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-600/10 rounded-2xl">
                    <Bot className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                        {t('chatbot.title')}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Your intelligent healthcare companion</p>
                </div>
            </div>

            {/* Main Interactive Card */}
            <div className="glass rounded-[2rem] p-10 relative overflow-hidden border border-white/20 shadow-xl">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-5xl shadow-2xl relative border-4 border-white dark:border-slate-800">
                            🤖
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-800 rounded-full animate-bounce" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
                            AI is Online <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                            I can help you with medical queries, symptom analysis, and clinic management tasks. How can I assist you today?
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
                        {features.map((f, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/50 dark:border-slate-700 hover:scale-105 transition-transform cursor-default">
                                <div className="bg-white dark:bg-slate-900 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm mx-auto mb-3">
                                    {f.icon}
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white">{f.title}</h3>
                                <p className="text-xs text-slate-500 mt-1">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6">
                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 animate-pulse">
                            👇 Click the floating button below to start
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-slate-100 dark:bg-slate-800/40 rounded-2xl p-5 flex items-start gap-4 border border-slate-200 dark:border-slate-700">
                <div className="text-xl">💡</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    "Try asking: 'What are the common symptoms of Type 2 Diabetes?' or 'How do I add a new patient record?'"
                </p>
            </div>
        </div>
    );
};

export default ChatbotPage;

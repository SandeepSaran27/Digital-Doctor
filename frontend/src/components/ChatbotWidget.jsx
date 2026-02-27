import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    startSession,
    sendMessage,
    endSession,
    clearSession,
    addUserMessage,
} from '@/store/slices/chatbotSlice';

const ChatbotWidget = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { activeSession, messages, sending, loading } = useSelector((s) => s.chatbot);

    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [listening, setListening] = useState(false);
    const bottomRef = useRef(null);
    const recognitionRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, sending]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const text = input.trim();
        setInput('');

        if (!activeSession) {
            const result = await dispatch(startSession({ language: 'en' }));
            if (result.payload?._id) {
                dispatch(addUserMessage(text)); // optimistic — show user msg immediately
                dispatch(sendMessage({ sessionId: result.payload._id, message: text }));
            }
        } else {
            dispatch(addUserMessage(text)); // optimistic — show user msg immediately
            dispatch(sendMessage({ sessionId: activeSession._id, message: text }));
        }
    };

    const handleVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        if (listening) {
            recognitionRef.current?.stop();
            setListening(false);
            return;
        }

        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-IN';
        rec.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false); };
        rec.onerror = () => setListening(false);
        rec.onend = () => setListening(false);
        recognitionRef.current = rec;
        rec.start();
        setListening(true);
    };

    const handleEnd = () => {
        if (activeSession) dispatch(endSession(activeSession._id));
        else dispatch(clearSession());
    };

    return (
        <>
            {/* Floating bubble */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700
                     text-white text-2xl shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                    title={t('chatbot.title')}
                >
                    🤖
                </button>
            )}

            {/* Chat panel */}
            {open && (
                <div
                    className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-3xl shadow-2xl flex flex-col
                     bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-slide-up"
                    style={{ height: '520px' }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700 rounded-t-3xl bg-gradient-to-r from-primary-600 to-primary-700">
                        <span className="text-2xl">🤖</span>
                        <div className="flex-1">
                            <p className="text-white font-semibold text-sm">{t('chatbot.title')}</p>
                            <p className="text-primary-200 text-xs">Powered by Gemini AI</p>
                        </div>
                        <div className="flex gap-1.5">
                            <button onClick={handleEnd} className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs">
                                New
                            </button>
                            <button onClick={() => setOpen(false)} className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs">
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 && (
                            <div className="text-center text-slate-400 text-xs mt-8 space-y-2">
                                <div className="text-3xl">👋</div>
                                <p>Hello! I'm your AI medical assistant.</p>
                                <p>Describe your symptoms or ask a health question.</p>
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-primary-600 text-white rounded-br-sm'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                                        }`}
                                >
                                    {msg.content || msg.text}
                                </div>
                            </div>
                        ))}
                        {sending && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-2xl rounded-bl-sm">
                                    <span className="flex gap-1">
                                        {[0, 1, 2].map((d) => (
                                            <span key={d} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                                                style={{ animationDelay: `${d * 0.15}s` }} />
                                        ))}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleVoice}
                                className={`p-2 rounded-xl transition ${listening ? 'bg-red-100 text-danger-500 animate-pulse' : 'btn-ghost'}`}
                                title={listening ? t('chatbot.listening') : t('chatbot.speak')}
                            >
                                🎤
                            </button>
                            <input
                                className="input flex-1 py-2 text-xs"
                                placeholder={listening ? t('chatbot.listening') : t('chatbot.placeholder')}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                disabled={sending}
                            />
                            <button
                                onClick={handleSend}
                                disabled={sending || !input.trim()}
                                className="btn-primary px-3 py-2 text-xs"
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotWidget;

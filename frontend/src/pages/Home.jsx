import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
    // Add a simple scroll effect for parallax or navbar if needed
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30 overflow-hidden">

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Clinic Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1538108149393-cebb47ac8021?auto=format&fit=crop&q=80&w=2000')`
                    }}
                />
                {/* Dark Gradient Overlay for Contrast */}
                <div className="absolute inset-0 bg-slate-950/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />

                {/* Abstract Glowing Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-cyan-500/20 blur-[100px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_reverse]" />
                <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-purple-600/15 blur-[130px] mix-blend-screen animate-[pulse_12s_ease-in-out_infinite]" />

                {/* Subtle Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #80808012 1px, transparent 1px), linear-gradient(to bottom, #80808012 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Header / Navbar */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                    <div className="flex items-center gap-2 z-10">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white font-bold text-xl">
                            D
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Digital <span className="text-cyan-400">Doctor</span></span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300 z-10">
                        <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
                        <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
                        <a href="#testimonials" className="hover:text-cyan-400 transition-colors">Testimonials</a>
                    </nav>
                    <div className="flex items-center gap-4 z-10">
                        <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">Log in</Link>
                        <Link to="/signup" className="text-sm font-semibold bg-white text-slate-900 px-5 py-2.5 rounded-full hover:bg-cyan-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 pt-32 pb-20 lg:pt-48">
                <div className="container mx-auto px-6 max-w-7xl">

                    {/* Hero Section */}
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-cyan-300 mb-8 mx-auto shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                            </span>
                            Next-Gen Clinic Management System
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.15]">
                            Modernize your clinic with{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
                                intelligent care
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            A completely integrated, digital-first platform designed to streamline appointments, patient records, and daily operations for forward-thinking medical practices.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-105 transition-all duration-300">
                                Start Free Trial
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-lg backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2 group">
                                <svg className="w-5 h-5 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Login
                            </Link>
                        </div>
                    </div>

                    {/* Features section (simplified) */}
                    <div id="features" className="mt-32 border-t border-white/5 pt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.04] transition-colors relative overflow-hidden group text-left">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full group-hover:bg-cyan-500/20 transition-colors" />
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Smart Appointments</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Integrated calendar system to manage doctor schedules, prevent double bookings, and send patient reminders.</p>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.04] transition-colors relative overflow-hidden group text-left">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full group-hover:bg-indigo-500/20 transition-colors" />
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Digital Records</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Centralized, secure electronic health records (EHR) accessible instantly from any connected device.</p>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.04] transition-colors relative overflow-hidden group text-left">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full group-hover:bg-purple-500/20 transition-colors" />
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">e-Prescriptions</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Generate secure, legible digital prescriptions that improve patient safety and pharmacy workflows.</p>
                        </div>
                    </div>

                </div>
            </main>

            {/* Simple Footer */}
            <footer className="relative z-10 border-t border-white/5 py-10 bg-black/20 text-center mt-12">
                <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Digital Doctor. All rights reserved. RMP Clinic Management System.</p>
            </footer>

            {/* Inline styles for custom animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse_reverse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: .7; transform: scale(1.05); }
                }
            `}} />
        </div>
    );
};

export default Home;
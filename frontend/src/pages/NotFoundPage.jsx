import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center space-y-4 animate-fade-in">
            <div className="text-8xl">🏥</div>
            <h1 className="text-5xl font-extrabold text-primary-600">404</h1>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Page Not Found</p>
            <p className="text-slate-400 text-sm">The page you're looking for doesn't exist.</p>
            <Link to="/dashboard" className="btn-primary inline-flex mt-2">← Back to Dashboard</Link>
        </div>
    </div>
);

export default NotFoundPage;

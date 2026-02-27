import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import api from '@/services/api';

const QRScanner = ({ onScan }) => {
    const scannerRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [lastResult, setLastResult] = useState(null);

    useEffect(() => {
        let scanner;
        (async () => {
            const { Html5Qrcode } = await import('html5-qrcode');
            scanner = new Html5Qrcode('qr-reader');
            scannerRef.current = scanner;
        })();
        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(() => { });
            }
        };
    }, []);

    const startScan = async () => {
        if (!scannerRef.current) return;
        try {
            setScanning(true);
            await scannerRef.current.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 220, height: 220 } },
                async (decodedText) => {
                    await scannerRef.current.stop();
                    setScanning(false);
                    setLastResult(decodedText);
                    // Verify via backend
                    try {
                        const hash = decodedText.split('/').pop();
                        const { data } = await api.get(`/prescriptions/verify/${hash}`);
                        toast.success('✓ Valid prescription verified');
                        if (onScan) onScan(data.data);
                    } catch {
                        toast.error('⚠️ Invalid or expired QR code');
                    }
                },
                () => { }
            );
        } catch (e) {
            setScanning(false);
            toast.error('Camera access denied or not available');
        }
    };

    const stopScan = async () => {
        if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop().catch(() => { });
        }
        setScanning(false);
    };

    return (
        <div className="card max-w-sm space-y-4">
            <h3 className="font-semibold text-slate-800 dark:text-white">📷 QR Check-in Scanner</h3>

            {/* Camera viewport */}
            <div
                id="qr-reader"
                className={`w-full rounded-2xl overflow-hidden border-2 transition-all ${scanning ? 'border-primary-400' : 'border-slate-200 dark:border-slate-600'
                    }`}
                style={{ minHeight: scanning ? 280 : 0 }}
            />

            {/* Controls */}
            <div className="flex gap-2">
                {!scanning ? (
                    <button onClick={startScan} className="btn-primary w-full">📷 Start Scanning</button>
                ) : (
                    <button onClick={stopScan} className="btn-danger w-full">⏹ Stop</button>
                )}
            </div>

            {/* Last result */}
            {lastResult && (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 px-3 py-2 text-xs font-mono text-slate-600 dark:text-slate-300 break-all">
                    {lastResult}
                </div>
            )}
        </div>
    );
};

export default QRScanner;

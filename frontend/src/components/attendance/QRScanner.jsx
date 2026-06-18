import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const QRScanner = ({ eventId, onClose }) => {
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Initialize scanner
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanFailure);

    async function onScanSuccess(decodedText) {
      // Pause scanning while processing
      scanner.pause(true);
      setIsProcessing(true);

      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.post('/api/attendance/scan', 
          { qrData: decodedText, eventId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setScanResult({ success: true, message: 'Attendance marked successfully! Certificate generated.', data });
        toast.success('Successfully checked in!');
      } catch (error) {
        setScanResult({ success: false, message: error.response?.data?.message || 'Invalid QR Code' });
        toast.error('Scan failed');
      } finally {
        setIsProcessing(false);
      }
    }

    function onScanFailure(error) {
      // Ignore normal scanning failures (e.g. no QR code in frame)
    }

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, [eventId]);

  const resetScanner = () => {
    setScanResult(null);
    // Hard reload the component by unmounting/remounting or re-initializing scanner
    // For MVP, closing and asking user to reopen is safest to reset camera state
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col glass-overlay">
      <div className="glass-navbar p-4 flex justify-between items-center relative z-10">
        <h2 className="text-xl font-display font-bold text-white">Scan Attendee Pass</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        
        {!scanResult ? (
          <div className="w-full max-w-md relative">
            {isProcessing && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#080416]/80 backdrop-blur-md rounded-3xl border border-white/10">
                <Loader2 className="w-10 h-10 text-violet-400 animate-spin mb-4" />
                <p className="text-white font-medium">Verifying ticket...</p>
              </div>
            )}
            <div className="glass-modal rounded-3xl overflow-hidden p-6 shadow-[0_0_50px_rgba(139,92,246,0.15)] glow-violet border-violet-500/30">
              <div id="reader" className="w-full bg-black rounded-2xl overflow-hidden [&>div]:!border-none [&_video]:!rounded-2xl"></div>
              <p className="text-center text-slate-400 mt-6 text-sm font-medium">Position the QR code within the frame</p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`glass-modal p-8 rounded-3xl w-full max-w-sm text-center border-2 ${scanResult.success ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(52,211,153,0.2)]' : 'border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.2)]'}`}
          >
            {scanResult.success ? (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 glow-green relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-50"></div>
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">Verified!</h3>
                <p className="text-slate-300 mb-8">{scanResult.message}</p>
                <button onClick={resetScanner} className="btn w-full bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_0_20px_rgba(52,211,153,0.4)] border-none">
                  Scan Next Person
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                  <XCircle className="w-10 h-10 text-rose-400" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">Invalid Pass</h3>
                <p className="text-slate-300 mb-8">{scanResult.message}</p>
                <button onClick={resetScanner} className="btn btn-secondary w-full py-3">
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;

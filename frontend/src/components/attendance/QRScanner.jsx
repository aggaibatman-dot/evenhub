import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const QRScanner = ({ onClose }) => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    let scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const onScanSuccess = async (decodedText) => {
      // Prevent multiple scans while processing
      if (!isScanning) return;
      setIsScanning(false);
      
      try {
        scanner.pause();
        const { data } = await axios.post('/api/attendance/scan', {
          qrDataString: decodedText
        });
        setScanResult({ success: true, message: data.message, data: data });
        toast.success(data.message);
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Invalid QR Code';
        setScanResult({ success: false, message: errorMsg });
        toast.error(errorMsg);
        setTimeout(() => {
          setIsScanning(true);
          setScanResult(null);
          scanner.resume();
        }, 3000);
      }
    };

    const onScanFailure = (error) => {
      // handle scan failure, usually better to ignore and keep scanning
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [isScanning]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-xl max-w-md w-full overflow-hidden shadow-2xl relative">
        <div className="p-4 border-b dark:border-dark-border flex justify-between items-center bg-gray-50 dark:bg-slate-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Scan Attendee QR</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center">
          {!scanResult ? (
            <div id="reader" className="w-full h-full max-w-sm rounded-lg overflow-hidden border-2 border-primary-500"></div>
          ) : (
            <div className={`text-center p-6 rounded-lg w-full ${scanResult.success ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
              <h4 className="text-xl font-bold mb-2">
                {scanResult.success ? 'Attendance Verified!' : 'Verification Failed'}
              </h4>
              <p>{scanResult.message}</p>
              {scanResult.success && (
                <button 
                  onClick={() => {
                    setScanResult(null);
                    setIsScanning(true);
                    // scanner resumes via effect cleanup/remount
                  }}
                  className="mt-4 btn btn-primary w-full"
                >
                  Scan Next Person
                </button>
              )}
            </div>
          )}
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
            Position the QR code inside the box to verify attendance and generate the certificate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;

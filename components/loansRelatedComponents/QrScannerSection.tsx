'use client';

import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { approveLoan } from '@/app/lib/loanAdminActions';

export function QRScannerSection({ onSuccess }: { onSuccess: () => void }) {
  const [scannerOpen, setScannerOpen] = useState(false);
  const qrRegionRef = useRef<HTMLDivElement>(null);
  const html5QrcodeRef = useRef<Html5Qrcode>(null);

  

  useEffect(() => {
    if (!scannerOpen) {
        //stop scanner if it is running   
        html5QrcodeRef.current?.stop().catch(() => {});
        return;
    }
    if (!qrRegionRef.current) return;

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    const html5Qr = new Html5Qrcode(qrRegionRef.current.id);
    html5QrcodeRef.current = html5Qr;

    html5Qr
      .start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          // decodedText is the qr itself
          let loanId: string;
          try { loanId = JSON.parse(decodedText).loanId; }
          catch { loanId = decodedText; }

          html5Qr
            .stop()
            .finally(() => {
              setScannerOpen(true);
              approveLoan(loanId)
                .then(() => {
                  toast.success('Préstamo aprobado vía QR');
                  onSuccess(); // Refresh the loans list
                })
                .catch(() => toast.error('Error al aprobar vía QR'));
            });
        },
        () => {
          // Suppress QR parse errors - they're normal when no code is detected
        }
      )
      .catch((err) => {
        toast.error('Error iniciando cámara');
        console.error(err);
      });

    // refresh
    return () => {
      // This is unbound, idk why this is not working properly, but it does work if this is commented 
      // html5Qr.stop().catch(() => {});
    };
  }, [scannerOpen, onSuccess]);

  return (
    <>
      <Button onClick={() => setScannerOpen((o) => !o)} className='bg-[rgb(33,101,114)]'>
        {scannerOpen ? 'Cerrar Escáner' : 'Escanear QR'}
      </Button>

      {scannerOpen && (
        <div
          id="qr-reader"
          ref={qrRegionRef}
          className="mt-4 w-full max-w-md mx-auto border rounded"
        />
      )}
    </>
  );
}

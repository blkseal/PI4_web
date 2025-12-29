import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./Modal.css";

function QRScannerModal({ onClose, onDetected }) {
  const [error, setError] = useState(null);
  const html5QrRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const isStartedRef = useRef(false);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(
        "Câmara não disponível neste dispositivo. Faça isto num tablet ou telemóvel."
      );
      return;
    }

    const container = document.getElementById("qr-reader");
    if (!container) {
      setError("Erro interno: elemento do leitor QR não encontrado.");
      return;
    }

    // Prevent duplicate scanner instances (React StrictMode mounts twice in dev)
    if (window.__html5QrInUse) {
      setError("Scanner já em execução numa outra instância.");
      return;
    }

    // clear previous UI and mark global in-use
    container.innerHTML = "";
    window.__html5QrInUse = true;

    const html5Qr = new Html5Qrcode("qr-reader");
    html5QrRef.current = html5Qr;
    window.__html5QrInstance = html5Qr;

    const startPromise = html5Qr.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        onDetected && onDetected(decodedText);
        if (isStartedRef.current) {
          html5Qr
            .stop()
            .then(() => html5Qr.clear().catch(() => {}))
            .catch(() => {})
            .finally(() => {
              isStartedRef.current = false;
              setScanning(false);
            });
        }
      },
      (errorMessage) => {
        // ignore per-frame errors
      }
    );

    startPromise
      .then(() => {
        isStartedRef.current = true;
        setScanning(true);
      })
      .catch(() => {
        setError(
          "Não foi possível aceder à câmara. Faça isto num tablet ou telemóvel."
        );
        isStartedRef.current = false;
        setScanning(false);
      });

    return () => {
      // clear global in-use flag
      window.__html5QrInUse = false;
      const instance = window.__html5QrInstance || html5QrRef.current;
      if (instance && isStartedRef.current) {
        instance
          .stop()
          .then(() => instance.clear().catch(() => {}))
          .catch(() => {})
          .finally(() => {
            html5QrRef.current = null;
            window.__html5QrInstance = null;
            isStartedRef.current = false;
            setScanning(false);
            if (container) container.innerHTML = "";
          });
      } else {
        html5QrRef.current = null;
        window.__html5QrInstance = null;
        isStartedRef.current = false;
        setScanning(false);
        if (container) container.innerHTML = "";
      }
    };
  }, [onDetected]);

  const handleClose = () => {
    // clear global in-use flag
    window.__html5QrInUse = false;
    const instance = window.__html5QrInstance || html5QrRef.current;
    if (instance && isStartedRef.current) {
      instance
        .stop()
        .then(() => instance.clear().catch(() => {}))
        .catch(() => {})
        .finally(() => {
          html5QrRef.current = null;
          window.__html5QrInstance = null;
          isStartedRef.current = false;
          setScanning(false);
          onClose && onClose();
        });
    } else {
      html5QrRef.current = null;
      window.__html5QrInstance = null;
      isStartedRef.current = false;
      setScanning(false);
      onClose && onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Scan QR</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error ? (
            <div>
              <p>{error}</p>
            </div>
          ) : (
            <div>
              <div id="qr-reader" style={{ width: "100%" }} />
              <div style={{ marginTop: 8 }}>
                <button
                  className="modal-btn modal-btn-cancel"
                  onClick={handleClose}
                >
                  {scanning ? "Parar Scan" : "Fechar"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={handleClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRScannerModal;

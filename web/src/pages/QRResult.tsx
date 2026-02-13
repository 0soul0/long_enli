import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Download, RefreshCw, QrCode as QrIcon, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

const QRResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state?.data;
    const rawData = location.state?.rawData;

    useEffect(() => {
        // If no data is passed, redirect back to generate
        if (!rawData) {
            navigate('/generate');
        }
    }, [rawData, navigate]);

    if (!rawData) return null;

    const downloadQR = () => {
        const svg = document.getElementById('qr-code-svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = 512;
            canvas.height = 512;
            ctx?.drawImage(img, 0, 0, 512, 512);
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `service-qr-${data.date}.png`;
            link.href = url;
            link.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '85vh' }}>
            <div style={{ width: '100%', maxWidth: '700px' }}>
                <button
                    onClick={() => navigate('/generate')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                    <ArrowLeft size={24} /> 返回填寫
                </button>

                <div style={{ textAlign: 'center' }}>
                    <div className="card" style={{ padding: '3rem', display: 'inline-block', background: 'white', margin: '0 auto', boxShadow: '0 15px 40px rgba(0,0,0,0.12)' }}>
                        <QRCodeSVG
                            id="qr-code-svg"
                            value={rawData}
                            size={350}
                            level="M"
                            includeMargin={true}
                        />
                    </div>

                    <div className="card" style={{ textAlign: 'left', marginTop: '1.5rem', width: '100%' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <QrIcon size={20} /> QRcode 資訊預覽
                        </h3>
                        <div style={{ display: 'grid', gap: '0.75rem', fontSize: '1rem' }}>
                            <p><strong>日期:</strong> {data.date}</p>
                            <p><strong>時數:</strong> {data.hours}</p>
                            <p><strong>類型:</strong> {data.type}</p>
                            <p><strong>點數:</strong> {data.amount}</p>
                            {data.description && (
                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>內容描述:</p>
                                    <p style={{ lineHeight: '1.5' }}>{data.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', width: '100%' }}>
                        <button onClick={downloadQR} className="btn" style={{ flex: 1, backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                            <Download size={18} /> 下載圖片
                        </button>
                        <button onClick={() => navigate('/generate')} className="btn" style={{ flex: 1, backgroundColor: '#eee', color: '#666' }}>
                            <RefreshCw size={18} /> 重新填寫
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRResult;

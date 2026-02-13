import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Scan as ScanIcon, Clipboard, Check, Calendar, Clock, FileText, Info, Coins } from 'lucide-react';
import Cookies from 'js-cookie';

const Scan = () => {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            'reader',
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render(
            (result) => {
                setScanResult(result);

                try {
                    const data = JSON.parse(result);
                    if (data.d && data.h && data.t) {
                        setParsedData(data);

                        let list = [];

                        const lastScan = Cookies.get('last_scan_result');
                        if (lastScan) {
                            const parsed = JSON.parse(lastScan);
                            list = parsed;
                        }

                        list.push({
                            title: data.t || "未知名稱",
                            date: data.d || new Date().toLocaleDateString(),
                            amount: parseInt(data.a, 10) || 0
                        });

                        Cookies.set('last_scan_result', JSON.stringify(list), { expires: 7 });
                    } else {
                        setParsedData(null);
                    }
                } catch (e) {
                    setParsedData(null);
                }
                scanner.clear();
            },
            () => { }
        );

        return () => {
            scanner.clear().catch(err => console.error("Failed to clear scanner", err));
        };
    }, []);

    const copyToClipboard = () => {
        if (scanResult) {
            navigator.clipboard.writeText(scanResult);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="container animate-fade-in">
            <div className="grid-layout">
                {/* Scanner Section */}
                <section>
                    {!scanResult && (<><div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            padding: '1rem',
                            borderRadius: '50%',
                            background: 'rgba(0, 137, 123, 0.1)',
                            color: 'var(--primary-teal)',
                            marginBottom: '1rem'
                        }}>
                            <ScanIcon size={32} />
                        </div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>掃描 QR 碼</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>將 QR 碼對準相機即可自動識別</p>
                    </div><div id="reader" className="card" style={{ overflow: 'hidden', padding: 0, minHeight: '450px', border: 'none' }}></div></>
                    )}
                </section>

                {/* Result Section */}
                <section>
                    {scanResult ? (
                        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                            {parsedData ? (
                                <div className="card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-teal)' }}>
                                        <Info size={20} />
                                        <h2 style={{ fontSize: '1.1rem' }}>識別成功：點數已入帳</h2>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <Calendar size={20} color="#666" />
                                            <div>
                                                <p style={{ fontSize: '0.8rem', color: '#999' }}>服務日期</p>
                                                <p style={{ fontWeight: '600' }}>{parsedData.d}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <Clock size={20} color="#666" />
                                            <div>
                                                <p style={{ fontSize: '0.8rem', color: '#999' }}>時數</p>
                                                <p style={{ fontWeight: '600' }}>{parsedData.h}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <Info size={20} color="#666" />
                                            <div>
                                                <p style={{ fontSize: '0.8rem', color: '#999' }}>服務類型</p>
                                                <p style={{ fontWeight: '600' }}>{parsedData.t}</p>
                                            </div>
                                        </div>
                                        {parsedData.a && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <Coins size={20} color="#666" />
                                                <div>
                                                    <p style={{ fontSize: '0.8rem', color: '#999' }}>點數</p>
                                                    <p style={{ fontWeight: '600', color: 'var(--primary-teal)' }}>{parsedData.a}</p>
                                                </div>
                                            </div>
                                        )}
                                        {parsedData.desc && (
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                                <FileText size={20} color="#666" style={{ marginTop: '0.2rem' }} />
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontSize: '0.8rem', color: '#999' }}>內容描述</p>
                                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{parsedData.desc}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                        <button onClick={copyToClipboard} className="btn btn-orange" style={{ flex: 1 }}>
                                            {copied ? <Check size={18} /> : <Clipboard size={18} />}
                                            {copied ? '已複製' : '複製原始內容'}
                                        </button>
                                        <button onClick={() => window.location.reload()} className="btn" style={{ flex: 1, backgroundColor: '#eee' }}>
                                            再次掃描
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="card">
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>原始掃描結果：</h3>
                                    <div style={{
                                        background: '#f8fafc',
                                        padding: '1rem',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '0.5rem',
                                        wordBreak: 'break-all',
                                        fontSize: '0.9rem',
                                        color: '#444'
                                    }}>
                                        {scanResult}
                                    </div>
                                    <button onClick={() => window.location.reload()} className="btn" style={{ width: '100%', marginTop: '1rem', backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                                        再次掃描
                                    </button>
                                </div>
                            )}
                        </div>
                    ) :
                        (<></>)
                        // (
                        //     <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        //         <Info size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                        //         <p>等待掃描結果...</p>
                        //     </div>
                        // )

                    }
                </section>
            </div>

            <style>{`
                #reader { border: none !important; box-shadow: var(--card-shadow); }
                #reader__dashboard_section_csr button {
                    background: var(--primary-teal) !important;
                    color: white !important;
                    border: none !important;
                    padding: 10px 20px !important;
                    border-radius: 8px !important;
                    cursor: pointer !important;
                    font-weight: 600 !important;
                }
                #reader__camera_selection {
                    padding: 10px !important;
                    border-radius: 8px !important;
                    border: 1px solid var(--border-color) !important;
                    margin-bottom: 12px !important;
                    width: 100% !important;
                }
                #reader__scan_region video { border-radius: 16px !important; }
            `}</style>
        </div>
    );
};

export default Scan;

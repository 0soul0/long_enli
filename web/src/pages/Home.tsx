import {
    History,
    QrCode
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Home = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const initialTx = { title: '系統初始贈點', date: '2026/2/13', amount: 150 };
    useEffect(() => {

        const lastScan = Cookies.get('last_scan_result');
        if (lastScan) {
            try {
                const data = JSON.parse(lastScan) as any[];

                const fullList = [initialTx, ...data].reverse();
                setTransactions(fullList);

                // 更新總點數（簡單加總）
                const totalAmount = initialTx.amount + data.reduce((sum, tx) => sum + (tx.amount || 0), 0);
                setTotalPoints(totalAmount);
            } catch (e) {
                console.error("Failed to parse cookie", e);
            }
        }
    }, []);

    return (
        <div className="container animate-fade-in">
            <div className="grid-layout">
                {/* Left Column: User Card */}
                <section>
                    <div className="card teal-card" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Hello, 王大明</p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{totalPoints}</span>
                                <span style={{ fontSize: '1.25rem' }}>點</span>
                            </div>
                        </div>

                        {/* Decorative QR Icon */}
                        <div style={{
                            position: 'absolute',
                            top: '1.25rem',
                            right: '1.25rem',
                            opacity: 0.2,
                            background: 'rgba(255,255,255,0.2)',
                            padding: '0.5rem',
                            borderRadius: '0.5rem'
                        }}>
                            <QrCode size={32} />
                        </div>
                    </div>
                </section>

                {/* Right Column: Transactions */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <History size={20} color="#666" />
                        <h2 style={{ fontSize: '1.1rem', color: '#333' }}>近期異動</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {transactions.map((tx, idx) => (
                            <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', marginBottom: 0 }}>
                                <div>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', fontWeight: 'normal' }}>{tx.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#999' }}>{tx.date}</p>
                                </div>
                                <span style={{ color: 'var(--primary-teal)', fontWeight: '600', fontSize: '1.1rem' }}>+{tx.amount}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;

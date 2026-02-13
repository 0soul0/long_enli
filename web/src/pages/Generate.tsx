import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode as QrIcon } from 'lucide-react';

const Generate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        hours: '1.0 小時',
        type: '環境清潔',
        description: '',
        amount: '100'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const encodedData = JSON.stringify({
            d: formData.date,
            h: formData.hours,
            t: formData.type,
            desc: formData.description,
            a: formData.amount,
            v: '1.0'
        });

        // Navigate to the new result page with data
        navigate('/qr-result', {
            state: {
                data: formData,
                rawData: encodedData
            }
        });
    };

    return (
        <div className="container animate-fade-in">
            <div>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--primary-teal)' }}>
                        <QrIcon size={24} />
                        <h1 style={{ fontSize: '1.25rem' }}>填寫服務內容</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">服務日期</label>
                            <input
                                type="date"
                                className="form-control"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">時數</label>
                            <select
                                className="form-control"
                                value={formData.hours}
                                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                            >
                                <option>1.0 小時</option>
                                <option>1.5 小時</option>
                                <option>2.0 小時</option>
                                <option>2.5 小時</option>
                                <option>3.0 小時</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">服務類型</label>
                            <select
                                className="form-control"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>環境清潔</option>
                                <option>行政協助</option>
                                <option>活動支援</option>
                                <option>其他</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">內容描述</label>
                            <textarea
                                className="form-control"
                                placeholder="請簡述服務內容..."
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={{ resize: 'none' }}
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label className="form-label">點數</label>
                            <input
                                type="number"
                                className="form-control"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="輸入點數..."
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-orange" style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }}>
                            生成QRcode
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Generate;

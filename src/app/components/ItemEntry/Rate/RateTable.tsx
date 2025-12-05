import styles from '../../../page.module.css';

export default function RateTable({ handleSubmit }: { handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
    return (
        <form onSubmit={handleSubmit} className={styles.card} style={{ border: `1px solid #3b82f6` }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '16px', borderBottom: `1px solid #d1d5db`, paddingBottom: '8px' }}>Change Rates</h2>

            <div style={{ marginBottom: '24px' }}>
                {/* Rate change inputs can be added here */}
                <p style={{ color: '#6b7280' }}>Rate change functionality coming soon!</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: `1px solid #d1d5db`, paddingTop: '16px' }}>
                <button
                    type="submit"
                    style={{ 
                        padding: '8px 16px',
                        border: `1px solid #3b82f6`,
                        color: '#3b82f6',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        backgroundColor: 'white'
                    }}
                >
                    Save Rates
                </button>
            </div>
        </form>
    );
}
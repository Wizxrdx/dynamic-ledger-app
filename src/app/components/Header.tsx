import styles from '../page.module.css';

export default function Header({ primaryColor, error, dbError }: { primaryColor: string; error: string | null; dbError: string | null }) {
    return (
        <header className={`${styles.card} ${styles.header}`}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bolder', color: primaryColor, marginBottom: '8px' }}>Dynamic Ledger (Next.js - Public Access)</h1>
            <p style={{ color: '#4b5563' }}>Enter transactions below. Rates are remembered until manually updated.</p>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                Access Mode: <span style={{ fontFamily: 'monospace', backgroundColor: '#d1fae5', padding: '2px 4px', borderRadius: '4px', color: '#065f46' }}>Public/Unauthenticated</span>
            </p>
            {(error || dbError) && <div style={{ padding: '12px', marginTop: '16px', fontSize: '14px', color: '#b91c1c', backgroundColor: '#fee2e2', borderRadius: '8px' }}>{error || dbError}</div>}
        </header>
    );
};
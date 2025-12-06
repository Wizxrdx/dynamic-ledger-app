import styles from '../../../page.module.css';
import { ExpenseCategory, Rates } from "@/lib/utils";

// Helper component for input fields
export default function RateInputBox({ newRates, setNewRates, prevRates, primaryColor, category, label }: { newRates: Rates, setNewRates: React.Dispatch<React.SetStateAction<Rates>>, prevRates: Record<ExpenseCategory, number>, primaryColor: string, category: ExpenseCategory, label: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</label>
            <input
                type="text"
                value={(newRates[category] * 100)}
                onChange={
                    (e) => {
                        const value = parseFloat(e.target.value === '' ? '0' : e.target.value);
                        setNewRates(
                        prev => (
                            (value) <= 100 ?
                            { ...prev, [category]: value / 100 }
                            :
                            { ...prev }
                        )
                    )}
                }
                className={styles.inputField}
                placeholder={label}
            />
            <div style={{ fontSize: '12px', color: primaryColor, height: '16px', fontWeight: '500', marginTop: '4px' }}>
                {prevRates[category] !== undefined ? `Current: ${(prevRates[category]! * 100).toFixed(0)}%` : 'N/A'}
            </div>
        </div>
    );
};
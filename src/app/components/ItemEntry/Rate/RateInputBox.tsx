import styles from '../../../page.module.css';
import { ExpenseCategory, Rates } from "@/lib/utils";

interface RateInputBoxProps {
    newRates: Rates;
    setNewRates: React.Dispatch<React.SetStateAction<Rates>>;
    prevRates: Record<ExpenseCategory, number>;
    primaryColor: string;
    category: ExpenseCategory;
    label: string;
};

// Helper component for input fields
export default function RateInputBox({ newRates, setNewRates, prevRates, primaryColor, category, label }: RateInputBoxProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', paddingRight: '8px', backgroundColor: '#fff' }}>
                <input
                    type="number"
                    value={(newRates[category]).toString()}
                    onChange={
                        (e) => {
                            const value = parseFloat(e.target.value === '' ? '0' : e.target.value);
                            setNewRates(
                            prev => (
                                (value) <= 100 ?
                                { ...prev, [category]: value }
                                :
                                { ...prev }
                            )
                        )}
                    }
                    className={styles.inputField}
                    placeholder={label}
                    style={{
                        border: 'none'
                    }}
                />
                <span style={{ fontWeight: 'bold', color: '#4b5563', pointerEvents: 'none', userSelect: 'none', paddingLeft: '8px' }}>%</span>
            </div>
            <div style={{ fontSize: '12px', color: primaryColor, height: '16px', fontWeight: '500', marginTop: '4px' }}>
                {prevRates[category] !== undefined ? `Current: ${(prevRates[category]!).toFixed(0)}%` : 'N/A'}
            </div>
        </div>
    );
};
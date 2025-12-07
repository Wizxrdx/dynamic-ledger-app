import { ExpenseCategory, INITIAL_RATES, Rates, totalRates } from '@/lib/utils';
import styles from '../../../page.module.css';
import RateInputBox from './RateInputBox';
import React from 'react';

interface RateTableProps {
    prevRates: Record<ExpenseCategory, number>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onClose: () => void;
    primaryColor: string;
    borderColor: string;
}

export default function RateTable
({ prevRates, handleSubmit, onClose, primaryColor, borderColor }: RateTableProps) {
    const [newRates, setNewRates] = React.useState<Rates>(INITIAL_RATES);
    const [canSave, setCanSave] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    React.useEffect(() => {
        // checks if any rate has changed from previous rates
        const ratesChanged = Object.keys(newRates).some(
            (key) => newRates[key as ExpenseCategory] !== prevRates[key as ExpenseCategory]
        );
        // checks if total rates equal 100%
        const totalIsValid = totalRates(newRates) == 100;

        if (!ratesChanged) {
            setErrorMessage('No changes made.');
        } else if (!totalIsValid) {
            setErrorMessage('Total rates must equal to 100%.');
        } else {
            setErrorMessage('');
        };

        setCanSave(ratesChanged && totalIsValid);
    }, [newRates]);

    return (
        <form onSubmit={handleSubmit} className={styles.card} style={{ border: `1px solid #3b82f6` }}>
            <div style={{ display: 'flex', alignItems: 'left', borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}`, marginBottom: '16px' }}>
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => onClose()}
                    style={{
                        margin: '8px',
                        padding: '8px',
                        border: `1px solid ${primaryColor}`, 
                        color: primaryColor, 
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: 'white'
                    }}
                >
                    &times;
                </button>
                <h2 style={{ margin: '4px', fontSize: '20px', fontWeight: 'bold', color: primaryColor, alignContent: 'center' }}>Change Rates</h2>
            </div>

            <div style={{ marginBottom: '24px' }} className={styles.rateRow}>
                <RateInputBox newRates={newRates} setNewRates={setNewRates} prevRates={prevRates} primaryColor={primaryColor} category="cost" label="Cost (%)" />
                <RateInputBox newRates={newRates} setNewRates={setNewRates} prevRates={prevRates} primaryColor={primaryColor} category="utilities" label="Utilities (%)" />
                <RateInputBox newRates={newRates} setNewRates={setNewRates} prevRates={prevRates} primaryColor={primaryColor} category="salary" label="Salary (%)" />
                <RateInputBox newRates={newRates} setNewRates={setNewRates} prevRates={prevRates} primaryColor={primaryColor} category="profit" label="Profit (%)" />
                
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase', marginBottom: '4px' }}>Total (%)</label>
                    <div className={styles.profitBox}>
                        <span className={styles.profitText}>
                            {totalRates(newRates).toFixed(0)}%
                        </span>
                    </div>
                </div>
            </div>

            {errorMessage && (
                <div style={{ 
                    padding: '12px', 
                    marginBottom: '16px',
                    backgroundColor: '#fef2f2', 
                    border: '1px solid #fecaca', 
                    borderRadius: '6px',
                    color: '#dc2626',
                    fontSize: '14px',
                    fontWeight: '500',
                }}>
                    ⚠️ {errorMessage}
                </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: `1px solid #d1d5db`, paddingTop: '16px' }}>

                <button
                    disabled={!canSave}    
                    type="submit"
                    style={{ 
                        padding: '8px 16px',
                        border: `1px solid #3b82f6`,
                        color: canSave ? '#3b82f6' : '#9ca3af',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: canSave ? 'pointer' : 'not-allowed',
                        backgroundColor: 'white',
                        opacity: canSave ? 1 : 0.5
                    }}
                >
                    Save Rates
                </button>
            </div>
        </form>
    );
}
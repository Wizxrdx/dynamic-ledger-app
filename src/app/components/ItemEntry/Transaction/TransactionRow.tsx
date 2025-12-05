import { ExpenseCategory, getDefaultTransaction, NewTransactionEntry } from '@/lib/utils';
import styles from '../../../page.module.css'
import React from 'react';

interface TransactionRowProps {
    currentRates: Record<string, number>;
    nextCalculation: { results: Record<string, { finalValue: number; rate?: number }> }[];
    primaryColor: string;
    entry: NewTransactionEntry;
    index: number;
}

export default function TransactionRow({ currentRates, nextCalculation, entry, index, primaryColor }: TransactionRowProps) {
    const [newTransactionEntries, setNewTransactionEntries] = React.useState<NewTransactionEntry[]>([getDefaultTransaction()]);

    const handleInputChange = (index: number, field: keyof NewTransactionEntry, value: string) => {
        const updatedEntries = newTransactionEntries.map((entry, i) => {
            if (i === index) {
                return { ...entry, [field]: value };
            }
            return entry;
        });
        setNewTransactionEntries(updatedEntries);
    };

    const handleRemoveRow = (index: number) => {
        if (newTransactionEntries.length > 1) {
            setNewTransactionEntries(prev => prev.filter((_, i) => i !== index));
        } else {
            setNewTransactionEntries([getDefaultTransaction()]); 
        }
    };

    // Helper component for input fields
    const ExpenseInput: React.FC<{ entry: NewTransactionEntry, index: number, category: ExpenseCategory, label: string }> = ({ entry, index, category, label }) => {
        const calculatedResult = nextCalculation[index]?.results[category];
        
        const previousResult = index > 0 
            ? nextCalculation[index - 1]?.results[category]
            : undefined;

        const currentRate = previousResult ? previousResult.rate : currentRates[category];
        
        const currentRateDisplay = currentRate ? `${(currentRate * 100).toFixed(0)}%` : 'N/A';
        const placeholderText = `New % or +/- Adj. (Current: ${currentRateDisplay})`;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</label>
                <input
                    type="text"
                    value={entry[category] as string}
                    onChange={(e) => handleInputChange(index, category, e.target.value)}
                    className={styles.inputField}
                    placeholder={placeholderText}
                />
                <div style={{ fontSize: '12px', color: primaryColor, height: '16px', fontWeight: '500', marginTop: '4px' }}>
                    {calculatedResult && `$${calculatedResult.finalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </div>
            </div>
        );
    };

    return (
        <div key={index} className={styles.transactionRow}>
            
            {/* Sales Input (Col 1 of 5) */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase', marginBottom: '4px' }}>Sales ($)</label>
                <input
                    type="number"
                    value={entry.sales}
                    onChange={(e) => handleInputChange(index, 'sales', e.target.value)}
                    className={styles.inputField}
                    placeholder="e.g., 1000"
                    step="0.01"
                    required
                />
                    <div style={{ fontSize: '12px', color: '#9ca3af', height: '16px', marginTop: '4px' }}>Row {index + 1}</div>
            </div>

            {/* Expense Inputs (Cols 2, 3, 4 of 5) */}
            <ExpenseInput entry={entry} index={index} category="cost" label="Cost Input" />
            <ExpenseInput entry={entry} index={index} category="utilities" label="Utilities Input" />
            <ExpenseInput entry={entry} index={index} category="salary" label="Salary Input" />

            {/* Profit Display (Calculated) and Action Button (Col 5 of 5) */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase', marginBottom: '4px' }}>Profit (Calc)</label>
                    <div className={styles.profitBox}>
                        <span className={styles.profitText}>
                            {nextCalculation[index]?.results?.profit && `$${nextCalculation[index].results.profit.finalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </span>
                    </div>
                </div>
                
                <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className={styles.removeButton}
                    title="Remove this entry"
                >
                    Remove Row
                </button>
            </div>
        </div>
    );
}
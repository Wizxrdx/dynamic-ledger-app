import React from 'react';
import styles from '../../../page.module.css';
import TransactionRow from './TransactionRow';
import { ExpenseCategory, getDefaultTransaction, ItemEntryType, NewTransactionEntry } from '@/lib/utils';

interface TransactionTableProps {
    onSelectMode: (mode: ItemEntryType | null) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    nextCalculation: { results: Record<string, { finalValue: number; rate?: number }> }[];
    currentRates: Record<string, number>;
    primaryColor: string;
    borderColor: string;
}

export default function TransactionTable({ onSelectMode, handleSubmit, nextCalculation, currentRates, primaryColor, borderColor }: TransactionTableProps) {
    console.log('onSelectMode:', onSelectMode, typeof onSelectMode); // Add this
    
    const [transactionDate, setTransactionDate] = React.useState<string>('');
    const [newTransactionEntries, setNewTransactionEntries] = React.useState<NewTransactionEntry[]>([getDefaultTransaction()]);
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleAddRow = () => {
        setNewTransactionEntries([...newTransactionEntries, getDefaultTransaction()]);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.card} style={{ border: `1px solid ${primaryColor}` }}>
            <button type="button" className={styles.closeButton} onClick={() => onSelectMode(null)}>&times;</button>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: primaryColor, marginBottom: '16px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '8px' }}>New Entry Batch (All use the same date)</h2>
            
            <div className={styles.inputGroup}>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase', marginBottom: '4px' }}>Common Date for All Rows</label>
                <input
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className={styles.inputField}
                    style={{ maxWidth: '250px' }}
                    required
                />
            </div>

            <div style={{ marginBottom: '24px' }}>
                {newTransactionEntries.map((entry, index) => (
                    <TransactionRow
                        currentRates={currentRates}
                        nextCalculation={nextCalculation}
                        primaryColor={primaryColor}
                        key={index}
                        entry={entry}
                        index={index}
                    />
                ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${borderColor}`, paddingTop: '16px' }}>
                <button
                    type="button"
                    onClick={handleAddRow}
                    style={{ 
                        padding: '8px 16px', 
                        border: `1px solid ${primaryColor}`, 
                        color: primaryColor, 
                        borderRadius: '8px', 
                        fontWeight: 'bold', 
                        cursor: 'pointer',
                        backgroundColor: 'white'
                    }}
                >
                    + Add Another Row
                </button>

                <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={loading}
                >
                    {loading ? 'Saving Batch...' : `Save ${newTransactionEntries.length} Transaction(s)`}
                </button>
            </div>
        </form>
    );
}
"use client";

import { EXPENSE_CATEGORIES, Rates } from '../../../lib/utils';
import styles from '../../page.module.css';

interface HistoryProps {
  transactions: any[];
  currentRates: Rates;
  primaryColor: string;
  borderColor: string;
}

export default function History({ transactions, currentRates, primaryColor, borderColor }: HistoryProps) {
  return (
    <div className={styles.card}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '8px' }}>
        History (Latest Rates Used)
      </h2>

      <div style={{ overflowX: 'auto' }}>
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th className={styles.tableDataAlignLeft}>Date</th>
              <th className={styles.tableDataAlignRight}>Sales</th>
              {EXPENSE_CATEGORIES.map(cat => (
                <th key={cat} className={styles.tableDataAlignRight}>{cat} ($)</th>
              ))}
              <th className={styles.tableDataAlignCenter}>Rate Used</th>
              <th className={styles.tableDataAlignCenter}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '16px 12px', textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>No transactions recorded yet.</td>
              </tr>
            ) : (
              transactions.map((tx: any) => (
                <tr key={tx.id} className={styles.historyRow}>
                  <td className={styles.tableDataAlignLeft} style={{ color: '#4b5563' }}>
                    {tx.date}
                  </td>
                  <td className={styles.tableDataAlignRight} style={{ fontWeight: '600', color: '#1f2937' }}>
                    ${tx.sales.toLocaleString()}
                  </td>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <td key={cat} className={styles.tableDataAlignRight} style={{ fontFamily: 'monospace' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span>
                          ${tx[`${cat}_final`].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        {(tx[`${cat}_input`] && cat !== 'profit') && (
                          <span className={styles.inputDetails}>
                            (Input: {tx[`${cat}_input`]})
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                  <td className={styles.tableDataAlignCenter} style={{ fontFamily: 'monospace' }}>
                    {(tx.cost_rate * 100).toFixed(1)}%
                  </td>
                  <td className={styles.tableDataAlignCenter}>
                    <button className={styles.removeButton} style={{ color: '#ef4444' }} title="Delete is not yet implemented">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
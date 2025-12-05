"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { usePublicDb } from '../lib/firebase';
import { 
    collection, 
    query, 
    orderBy, 
    limit,
    onSnapshot, 
    addDoc, 
    serverTimestamp,
    Firestore
} from 'firebase/firestore';
import { 
    calculateExpense, 
    getDefaultTransaction, 
    EXPENSE_CATEGORIES, 
    INITIAL_RATES,
    Rates,
    NewTransactionEntry,
    CalculatedTransactionEntry,
    ExpenseCategory,
    CalculatedExpenseResult
} from '../lib/utils';

// Import CSS Module
import styles from './page.module.css';
import TrendAnalysis from './components/TrendAnalysis';
import History from './components/History/History';
import Header from './components/Header';
import ItemEntry from './components/ItemEntry/ItemEntry';

export default function LedgerPage() {
    const { db, dbReady, error: dbError } = usePublicDb();
    
    const [transactions, setTransactions] = useState<any[]>([]);
    const [currentRates, setCurrentRates] = useState<Rates>(INITIAL_RATES);
    
    const [transactionDate, setTransactionDate] = useState<string>(new Date().toISOString().substring(0, 10));
    const [newTransactionEntries, setNewTransactionEntries] = useState<NewTransactionEntry[]>([getDefaultTransaction()]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 2. Firestore Real-time Listener (Fetching Data and Updating Rates)
    useEffect(() => {
        if (!dbReady || !db) return;
        
        const APP_ID = 'public-ledger'; 
        const path = `/artifacts/${APP_ID}/public/data/transactions`;
        
        const firestore: Firestore = db.firestore;
        const q = query(collection(firestore, path), orderBy("timestamp", "desc"), limit(50));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedTransactions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Array<{ id: string } & Record<string, any>>;

            setTransactions(fetchedTransactions);
            
            if (fetchedTransactions.length > 0) {
                const latest = fetchedTransactions[0];
                const newRates: Partial<Rates> = {};
                EXPENSE_CATEGORIES.forEach((cat: ExpenseCategory) => {
                    newRates[cat] = (latest as Record<string, any>)[`${cat}_rate`] || INITIAL_RATES[cat];
                });
                setCurrentRates(prev => ({ ...prev, ...newRates as Rates }));
            } else {
                setCurrentRates(INITIAL_RATES);
            }
        }, (err) => {
            console.error("Firestore snapshot error:", err);
            setError("Failed to fetch transactions in real-time.");
        });

        return () => unsubscribe();
    }, [dbReady, db]);

    // Derived state for the entire batch of new transaction entries
    const nextCalculation: CalculatedTransactionEntry[] = useMemo(() => {
        const calculatedBatch: CalculatedTransactionEntry[] = [];
        let chainedRates: Rates = { ...currentRates }; 

        newTransactionEntries.forEach(entry => {
            const sales = parseFloat(entry.sales as string) || 0;
            const results: Partial<Record<ExpenseCategory, any>> = {};
            
            EXPENSE_CATEGORIES.forEach(cat => {
                const input = entry[cat];
                const { finalValue, newRate, adjustment } = calculateExpense(sales, input, chainedRates[cat]);
                
                if (newRate !== chainedRates[cat]) {
                    chainedRates[cat] = newRate;
                }

                results[cat] = {
                    input: input,
                    rate: newRate,
                    finalValue: finalValue,
                    adjustment: adjustment,
                    baseCost: finalValue - adjustment,
                };
            });

            const costResult = results.cost as CalculatedExpenseResult;
            const utilitiesResult = results.utilities as CalculatedExpenseResult;
            const salaryResult = results.salary as CalculatedExpenseResult;

            const expenseSum = costResult.finalValue + utilitiesResult.finalValue + salaryResult.finalValue;
            results.profit = {
                finalValue: sales - expenseSum,
                rate: (sales > 0 ? (sales - expenseSum) / sales : 0),
                adjustment: 0,
                baseCost: sales - expenseSum,
                input: null
            };

            calculatedBatch.push({ ...entry, results: results as Record<ExpenseCategory, CalculatedExpenseResult> });
        });
        
        return calculatedBatch;
    }, [newTransactionEntries, currentRates]);


    // Handle form submission to save all entries in the batch
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading || !db || !dbReady) return;

        const isValid = newTransactionEntries.every(entry => {
            const sales = parseFloat(entry.sales as string);
            return !isNaN(sales) && sales > 0;
        });

        if (!isValid) {
            setError("All Sales entries must be valid numbers greater than zero.");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const APP_ID = 'public-ledger'; 
            const path = `/artifacts/${APP_ID}/public/data/transactions`;
            const firestore: Firestore = db.firestore;

            const savePromises = nextCalculation.map(calcEntry => {
                const sales = parseFloat(calcEntry.sales as string);
                
                const dataToSave: Record<string, any> = {
                    date: transactionDate, 
                    sales: sales,
                    timestamp: serverTimestamp(),
                };

                EXPENSE_CATEGORIES.forEach(cat => {
                    const calc = calcEntry.results[cat];
                    dataToSave[`${cat}_input`] = calcEntry[cat] || null;
                    dataToSave[`${cat}_rate`] = calc.rate;
                    dataToSave[`${cat}_final`] = calc.finalValue;
                });

                dataToSave.profit_final = calcEntry.results.profit.finalValue;
                
                return addDoc(collection(firestore, path), dataToSave);
            });

            await Promise.all(savePromises);
            
            setNewTransactionEntries([getDefaultTransaction()]);
            
        } catch (e) {
            console.error("Error adding document batch:", e);
            setError("Failed to save transaction batch. Check console for details.");
        } finally {
            setLoading(false);
        }
    }, [transactionDate, newTransactionEntries, nextCalculation, loading, db, dbReady]);

    // Define colors used in inline styles (minimal use now)
    const primaryColor = '#4f46e5'; 
    const borderColor = '#e5e7eb'; 


    if (!dbReady) {
        return (
            <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: '20px', color: primaryColor }}>Loading database connection...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header primaryColor={primaryColor} error={error} dbError={dbError} />

            {/* --- Historical Data Table (TOP) --- */}
            <History
                transactions={transactions}
                currentRates={currentRates}
                primaryColor={primaryColor}
                borderColor={borderColor}
            />            

            <ItemEntry
                handleSubmit={handleSubmit}
                nextCalculation={nextCalculation}
                currentRates={currentRates}
                primaryColor={primaryColor}
                borderColor={borderColor}
            />

            <TrendAnalysis
                transactions={transactions}
                currentRates={currentRates}
                borderColor={borderColor}
            />
        </div>
    );
}
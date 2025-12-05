// --- CONSTANTS ---
export type ExpenseCategory = 'cost' | 'utilities' | 'salary' | 'profit';
export type Rates = Record<ExpenseCategory, number>;

export const INITIAL_RATES: Rates = { cost: 0.50, utilities: 0.30, salary: 0.10, profit: 0.10 };

export enum ItemEntryType {
    RATES = 'RATES',
    TRANSACTIONS = 'TRANSACTIONS',
}

// --- INTERFACES ---

export interface NewTransactionEntry {
    sales: string | number;
    cost: string | number;
    utilities: string | number;
    salary: string | number;
    profit: string | number;
}

export interface CalculatedExpenseResult {
    input: string | number | null;
    rate: number;
    finalValue: number;
    adjustment: number;
    baseCost: number;
}

export interface CalculatedTransactionEntry extends NewTransactionEntry {
    results: Record<ExpenseCategory, CalculatedExpenseResult>;
}

export interface FirestoreTransaction {
    id: string;
    date: string;
    sales: number;
    timestamp: any; // Use firebase.firestore.Timestamp in a dedicated environment
    cost_input: string | number | null;
    cost_rate: number;
    cost_final: number;
    utilities_input: string | number | null;
    utilities_rate: number;
    utilities_final: number;
    salary_input: string | number | null;
    salary_rate: number;
    salary_final: number;
    profit_final: number;
}


// --- UTILITY FUNCTIONS ---

/**
 * Parses user input for an expense column (e.g., '60%', '+100', or '50')
 */
export const parseExpenseInput = (input: string | number, currentRate: number): { rate: number, adjustment: number } => {
    let rate = currentRate;
    let adjustment = 0;
    
    if (!input && input !== 0) {
        return { rate, adjustment };
    }

    const cleanInput = String(input).trim();

    // Check for Percentage Input
    const isPercentage = cleanInput.endsWith('%') || (!isNaN(parseFloat(cleanInput)) && parseFloat(cleanInput) <= 1 && parseFloat(cleanInput) >= 0);
    const isWholeNumberRate = !isNaN(parseFloat(cleanInput)) && parseFloat(cleanInput) > 1 && parseFloat(cleanInput) <= 100;
    
    if (isPercentage || isWholeNumberRate) {
        let numericRate = parseFloat(cleanInput.replace('%', ''));
        if (numericRate > 1) {
            numericRate /= 100;
        }
        
        rate = numericRate;
        adjustment = 0;
    } 
    // Check for Adjustment Input
    else if (cleanInput.startsWith('+') || cleanInput.startsWith('-') || (!isNaN(parseFloat(cleanInput)) && parseFloat(cleanInput) !== 0)) {
        adjustment = parseFloat(cleanInput);
    }
    
    return { rate, adjustment };
};

/**
 * Calculates the final value for an expense category.
 */
export const calculateExpense = (sales: number, input: string | number, currentRate: number): { finalValue: number, newRate: number, adjustment: number } => {
    const { rate, adjustment } = parseExpenseInput(input, currentRate);
    
    const baseCost = sales * rate;
    const finalValue = baseCost + adjustment;
    
    return { 
        finalValue: Math.round(finalValue * 100) / 100,
        newRate: rate,
        adjustment: adjustment
    };
};

export const getDefaultTransaction = (sales = '', cost = '', utilities = '', salary = ''): NewTransactionEntry => ({
    sales, cost, utilities, salary, profit: ''
});

export const EXPENSE_CATEGORIES: ExpenseCategory[] = ['cost', 'utilities', 'salary', 'profit'];
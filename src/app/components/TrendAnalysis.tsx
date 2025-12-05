import React, { useCallback } from 'react';
import styles from '../page.module.css'

interface TrendAnalysisProps {
    transactions: any[];
    currentRates: any;
    borderColor: string;
}

export default function TrendAnalysis({ transactions, currentRates, borderColor }: TrendAnalysisProps) {
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [analysisResult, setAnalysisResult] = React.useState<string>('');
    const [analysisError, setAnalysisError] = React.useState<string | null>(null);

        // --- GEMINI API CALL FOR FINANCIAL ANALYSIS ---
    
    const generateAnalysis = useCallback(async () => {
        if (isAnalyzing || transactions.length === 0) return;
        
        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResult('');

        const recentData = transactions.slice(0, 5).map(t => ({
            date: t.date,
            sales: t.sales,
            profit_final: t.profit_final,
            cost_rate: t.cost_rate,
            utilities_rate: t.utilities_rate,
            salary_rate: t.salary_rate
        }));

        const systemPrompt = "You are a professional financial analyst. Provide a concise, single-paragraph summary of the current business trend based ONLY on the provided data. Highlight the current profit margin percentage (Profit/Sales) of the *most recent* transaction. Comment on any significant rate changes (Cost, Utilities, Salary) across the recent history. Keep the tone professional and neutral, writing in markdown format.";
        
        const userQuery = `Analyze the following financial data. Current fixed rates used for calculations are: ${JSON.stringify(currentRates)}. Recent transaction history (top 5, including rates used for that transaction): ${JSON.stringify(recentData)}.`;

        const apiKey = ""; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        let resultText = "Analysis generation failed.";
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) {
                    resultText = text;
                    break; 
                }

            } catch (error) {
                console.error(`Attempt ${attempts + 1} failed:`, error);
                attempts++;
                if (attempts < maxAttempts) {
                    const delay = Math.pow(2, attempts) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        if (resultText === "Analysis generation failed.") {
             setAnalysisError("Failed to generate analysis after multiple attempts.");
        }
        
        setAnalysisResult(resultText);
        setIsAnalyzing(false);
    }, [isAnalyzing, transactions, currentRates]);
    {/* --- LLM Analysis Feature (BOTTOM) --- */}
    return (
        <div className={styles.card}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '8px' }}>Financial Trend Analysis ✨</h2>
            
            <button
                onClick={generateAnalysis}
                className={`${styles.primaryButton} ${styles.analysisButton}`}
                disabled={isAnalyzing || transactions.length === 0}
            >
                {isAnalyzing ? 'Analyzing Data...' : 'Generate Financial Analysis ✨'}
            </button>

            {analysisError && <p style={{ marginTop: '16px', color: '#ef4444', fontStyle: 'italic' }}>{analysisError}</p>}
            
            {analysisResult && (
                <div style={{ marginTop: '16px', padding: '16px', border: `1px solid ${borderColor}`, borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                    <p style={{ fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>Analyst Report:</p>
                    <div style={{ fontSize: '14px', color: '#1f2937', whiteSpace: 'pre-wrap' }}>{analysisResult}</div>
                </div>
            )}
            
            {transactions.length === 0 && (
                <p style={{ marginTop: '16px', color: '#6b7280', fontStyle: 'italic' }}>Save at least one transaction to generate an analysis.</p>
            )}
        </div>
    )
}
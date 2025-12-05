"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';

// --- INTERFACE ---
interface DbContextValue {
    db: { app: FirebaseApp, firestore: Firestore } | null;
    dbReady: boolean;
    error: string | null;
}

// Default context value
const FirebaseContext = createContext<DbContextValue>({
    db: null,
    dbReady: false,
    error: null,
});

// In a real project, replace these placeholders with your actual values from .env.local
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const usePublicDb = () => useContext(FirebaseContext);

interface PublicDbProviderProps {
    children: ReactNode;
}

export function PublicDbProvider({ children }: PublicDbProviderProps) {
    const [db, setDb] = useState<{ app: FirebaseApp, firestore: Firestore } | null>(null);
    const [dbReady, setDbReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
            setError("Firebase API Key is missing. Please update firebaseConfig.");
            setDbReady(true);
            return;
        }

        try {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            setDb({ app, firestore });
            setDbReady(true);
        } catch (e: any) {
            console.error("Firebase Initialization Error:", e);
            setError(`Error initializing Firebase: ${e.message}`);
            setDbReady(true);
        }
    }, []);

    const value: DbContextValue = { db, dbReady, error };
    
    return (
        <FirebaseContext.Provider value={value}>
            {children}
        </FirebaseContext.Provider>
    );
}
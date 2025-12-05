import { ItemEntryType } from '@/lib/utils';
import TransactionTable from './Transaction/TransactionTable';
import RateTable from './Rate/RateTable';
import React from 'react';
import ItemEntrySelection from './ItemEntrySelection';

interface ItemEntryProps {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    nextCalculation: { results: Record<string, { finalValue: number; rate?: number }> }[];
    currentRates: Record<string, number>;
    primaryColor: string;
    borderColor: string;
}

export default function ItemEntry({ handleSubmit, nextCalculation, currentRates, primaryColor, borderColor }: ItemEntryProps) {
    const [entryType, setEntryType] = React.useState<ItemEntryType | null>(null);

    const handleModeChange = (mode: ItemEntryType | null) => {
        setEntryType(mode);
    }

    return (
        <div>
            {entryType === null && <ItemEntrySelection
                onSelectMode={handleModeChange}
                primaryColor={primaryColor}
            />}
            {entryType === ItemEntryType.TRANSACTIONS &&
                <TransactionTable 
                    onSelectMode={handleModeChange}
                    handleSubmit={handleSubmit}
                    nextCalculation={nextCalculation}
                    currentRates={currentRates}
                    primaryColor={primaryColor}
                    borderColor={borderColor}
                />
            }
            {entryType === ItemEntryType.RATES &&
                <RateTable
                    handleSubmit={handleSubmit}
                />
            }
        </div>
    )
}
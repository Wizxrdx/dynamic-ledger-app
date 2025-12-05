import { ItemEntryType } from "@/lib/utils";

interface ItemEntrySelectionProps {
  onSelectMode: (mode: ItemEntryType) => void;
  primaryColor: string;
}

export default function ItemEntrySelection({ onSelectMode, primaryColor }: ItemEntrySelectionProps) {
  const buttonStyle = {
    padding: '20px 40px',
    fontSize: '18px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    color: '#fff',
  };

  return (
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px' }}>
      <button
        onClick={() => onSelectMode(ItemEntryType.TRANSACTIONS)}
        style={{
          ...buttonStyle,
          backgroundColor: primaryColor,
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        + Add Transaction
      </button>
      <button
        onClick={() => onSelectMode(ItemEntryType.RATES)}
        style={{
          ...buttonStyle,
          backgroundColor: '#10b981',
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        ⚙️ Change Rate
      </button>
    </div>
  );
}
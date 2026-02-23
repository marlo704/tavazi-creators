import { useState } from 'react';
import CSVImportSubTab from './CSVImportSubTab';
import ManualEntrySubTab from './ManualEntrySubTab';

type SubTab = 'csv' | 'manual';

export default function ImportCSVTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('csv');

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSubTab('csv')}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
            activeSubTab === 'csv'
              ? 'bg-[#1971C2] text-white'
              : 'border border-tavazi-navy/40 text-cream/50 hover:text-cream/80 hover:border-tavazi-navy/60'
          }`}
        >
          CSV Import
        </button>
        <button
          onClick={() => setActiveSubTab('manual')}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
            activeSubTab === 'manual'
              ? 'bg-[#1971C2] text-white'
              : 'border border-tavazi-navy/40 text-cream/50 hover:text-cream/80 hover:border-tavazi-navy/60'
          }`}
        >
          Manual Entry
        </button>
      </div>

      {activeSubTab === 'csv' ? <CSVImportSubTab /> : <ManualEntrySubTab />}
    </div>
  );
}

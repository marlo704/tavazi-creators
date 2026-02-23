import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DemoProvider } from '../../contexts/DemoContext';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import DemoBanner from './DemoBanner';

export default function DemoDashboardLayout() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  );

  return (
    <DemoProvider>
      <div className="min-h-screen bg-tavazi-dark">
        <Topbar selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        <DemoBanner />
        <Sidebar />
        <main className="pt-[104px] md:ml-[220px] pb-20 md:pb-6 px-4 md:px-6 lg:px-8">
          <div className="py-6">
            <Outlet context={{ selectedMonth }} />
          </div>
        </main>
      </div>
    </DemoProvider>
  );
}

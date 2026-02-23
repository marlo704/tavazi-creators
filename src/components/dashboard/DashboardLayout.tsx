import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  );

  return (
    <div className="min-h-screen bg-tavazi-dark">
      <Topbar selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      <Sidebar />
      <main className="pt-[60px] md:ml-[220px] pb-20 md:pb-6 px-4 md:px-6 lg:px-8">
        <div className="py-6">
          <Outlet context={{ selectedMonth }} />
        </div>
      </main>
    </div>
  );
}

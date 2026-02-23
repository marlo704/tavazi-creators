import { useState, useRef, useEffect } from 'react';
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

  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerH, setBannerH] = useState(44);

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    const measure = () => setBannerH(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const topbarTop = bannerH;
  const sidebarTop = bannerH + 60;
  const mainPt = bannerH + 60;

  return (
    <DemoProvider>
      <div className="min-h-screen bg-tavazi-dark">
        <DemoBanner ref={bannerRef} />
        <Topbar selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} topOffset={topbarTop} />
        <Sidebar topOffset={sidebarTop} />
        <main
          className="md:ml-[220px] pb-20 md:pb-6 px-4 md:px-6 lg:px-8"
          style={{ paddingTop: mainPt }}
        >
          <div className="py-6">
            <Outlet context={{ selectedMonth }} />
          </div>
        </main>
      </div>
    </DemoProvider>
  );
}

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Film, DollarSign, TrendingUp, Shield } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/content', icon: Film, label: 'Content', end: false },
  { to: '/dashboard/revenue', icon: DollarSign, label: 'Revenue', end: false },
  { to: '/dashboard/trend', icon: TrendingUp, label: 'Trend', end: false },
];

const adminItem = { to: '/admin', icon: Shield, label: 'Admin', end: true };

export default function Sidebar() {
  const { isAdmin } = useAuthStore();

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-[60px] bottom-0 w-[220px] bg-tavazi-dark flex-col py-4 border-r border-tavazi-navy/10 z-30">
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-tavazi-navy/10 text-tavazi-navy border-l-[3px] border-tavazi-navy'
                    : 'text-cream/50 hover:text-cream hover:bg-tavazi-slate/30 border-l-[3px] border-transparent'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to={adminItem.to}
              end={adminItem.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 mt-4 ${
                  isActive
                    ? 'bg-tavazi-navy/10 text-tavazi-navy border-l-[3px] border-tavazi-navy'
                    : 'text-cream/50 hover:text-cream hover:bg-tavazi-slate/30 border-l-[3px] border-transparent'
                }`
              }
            >
              <adminItem.icon className="w-5 h-5" />
              {adminItem.label}
            </NavLink>
          )}
        </nav>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-tavazi-charcoal border-t border-tavazi-navy/15 flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-tavazi-navy' : 'text-cream/40'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

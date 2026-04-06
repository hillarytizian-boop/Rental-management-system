import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaTachometerAlt, FaBuilding, FaUsers, FaCreditCard, FaWrench, FaChartLine, FaSignOutAlt } from 'react-icons/fa';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/properties', label: 'Properties', icon: FaBuilding },
  { to: '/tenants', label: 'Tenants', icon: FaUsers },
  { to: '/payments', label: 'Payments', icon: FaCreditCard },
  { to: '/maintenance', label: 'Maintenance', icon: FaWrench },
  { to: '/reports', label: 'Reports', icon: FaChartLine },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass rounded-r-3xl flex flex-col">
      <div className="p-6 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        NexusRent
      </div>
      <nav className="flex-1 mt-8 space-y-2">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-item flex items-center gap-3 px-6 py-3 mx-2 rounded-xl transition-all ${isActive ? 'active' : 'hover:bg-white/5'}`}>
            <item.icon className="text-lg" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
          <div>
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-300">{user?.role}</p>
          </div>
        </div>
        <button onClick={logout} className="neon-btn w-full flex items-center justify-center gap-2"><FaSignOutAlt /> Logout</button>
      </div>
    </aside>
  );
}

import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaTachometerAlt, FaBuilding, FaUsers, FaCreditCard, FaWrench, FaChartLine, FaSignOutAlt, FaUserShield } from 'react-icons/fa';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const role = user?.role;

  const navItems = [];
  if (role === 'admin') {
    navItems.push({ to: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt });
    navItems.push({ to: '/admin', label: 'Admin Panel', icon: FaUserShield });
    navItems.push({ to: '/properties', label: 'Properties', icon: FaBuilding });
    navItems.push({ to: '/tenants', label: 'Tenants', icon: FaUsers });
    navItems.push({ to: '/payments', label: 'Payments', icon: FaCreditCard });
    navItems.push({ to: '/maintenance', label: 'Maintenance', icon: FaWrench });
    navItems.push({ to: '/reports', label: 'Reports', icon: FaChartLine });
  } else if (role === 'landlord') {
    navItems.push({ to: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt });
    navItems.push({ to: '/properties', label: 'Properties', icon: FaBuilding });
    navItems.push({ to: '/tenants', label: 'Tenants', icon: FaUsers });
    navItems.push({ to: '/payments', label: 'Payments', icon: FaCreditCard });
    navItems.push({ to: '/maintenance', label: 'Maintenance', icon: FaWrench });
    navItems.push({ to: '/reports', label: 'Reports', icon: FaChartLine });
  } else if (role === 'tenant') {
    navItems.push({ to: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt });
    navItems.push({ to: '/payments', label: 'Payments', icon: FaCreditCard });
    navItems.push({ to: '/maintenance', label: 'Maintenance', icon: FaWrench });
  }

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

import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaTachometerAlt, FaBuilding, FaUsers, FaCreditCard, FaWrench, FaChartLine, FaSignOutAlt, FaFileInvoice, FaEnvelope, FaBlog, FaMapMarkerAlt } from 'react-icons/fa';

export default function Layout() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { to: '/properties', label: 'Properties', icon: FaBuilding },
    { to: '/tenants', label: 'Tenants', icon: FaUsers },
    { to: '/payments', label: 'Payments', icon: FaCreditCard },
    { to: '/maintenance', label: 'Maintenance', icon: FaWrench },
    { to: '/reports', label: 'Reports', icon: FaChartLine },
    { to: '/invoices', label: 'Invoices', icon: FaFileInvoice },
    { to: '/messages', label: 'Messages', icon: FaEnvelope },
    { to: '/blog', label: 'Blog', icon: FaBlog },
    { to: '/locations', label: 'Locations', icon: FaMapMarkerAlt }
  ];
  return (
    <div className="flex min-h-screen bg-gray-900">
      <aside className="w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 fixed h-full overflow-y-auto">
        <div className="p-5 text-2xl font-bold text-cyan-400 border-b border-gray-700">Nyumbani</div>
        <nav className="mt-6">
          {menuItems.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700/50 transition ${isActive ? 'bg-gray-700 text-cyan-400 border-r-2 border-cyan-400' : ''}`}>
              <item.icon className="text-lg" /><span>{item.label}</span>
            </NavLink>
          ))}
          <button onClick={logout} className="flex items-center gap-3 px-6 py-3 text-red-400 w-full hover:bg-gray-700/50 mt-4"><FaSignOutAlt /> Logout</button>
        </nav>
      </aside>
      <main className="ml-64 flex-1 p-6"><div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold text-white">Welcome, {user.name}</h1><div className="text-gray-300">Role: {user.role}</div></div><Outlet /></main>
    </div>
  );
}

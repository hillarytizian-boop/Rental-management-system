import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaTachometerAlt, FaExchangeAlt, FaFileInvoice, FaCreditCard, FaEnvelope, FaBlog, FaMapMarkerAlt, FaSignOutAlt, FaUsers, FaHome } from 'react-icons/fa';

export default function Layout() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { to: '/transactions', label: 'Transactions', icon: FaExchangeAlt },
    { to: '/invoices', label: 'Invoices', icon: FaFileInvoice },
    { to: '/payments', label: 'Payments', icon: FaCreditCard },
    { to: '/messages', label: 'Messages', icon: FaEnvelope },
    { to: '/blog', label: 'Blog', icon: FaBlog },
    { to: '/locations', label: 'Locations', icon: FaMapMarkerAlt },
    { to: '/properties', label: 'Properties', icon: FaHome },
    { to: '/tenants', label: 'Tenants', icon: FaUsers }
  ];

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 fixed h-full">
        <div className="p-4 text-2xl font-bold text-cyan-400">Nyumbani</div>
        <nav className="mt-6">
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700/50 transition ${isActive ? 'bg-gray-700 text-cyan-400 border-r-2 border-cyan-400' : ''}`
              }
            >
              <item.icon /><span>{item.label}</span>
            </NavLink>
          ))}
          <button onClick={logout} className="flex items-center gap-3 px-6 py-3 text-red-400 w-full hover:bg-gray-700/50">
            <FaSignOutAlt /><span>Log out</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Welcome, {user.name}</h1>
          <div className="text-white">Role: {user.role}</div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

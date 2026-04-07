import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaTachometerAlt, FaBuilding, FaUsers, FaCreditCard, FaWrench, FaChartLine, FaSignOutAlt, FaUserShield } from 'react-icons/fa';

export default function Layout() {
  const { user, logout } = useAuth();
  const role = user?.role;

  const navItems = [];
  if (role === 'admin') {
    navItems.push({ to: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt });
    navItems.push({ to: '/admin', label: 'Admin', icon: FaUserShield });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Top Navigation Bar */}
      <nav className="glass sticky top-0 z-50 px-6 py-3 flex justify-between items-center backdrop-blur-md border-b border-white/10">
        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          NexusRent
        </div>
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${isActive ? 'bg-white/10 text-cyan-400' : 'hover:bg-white/5'}`
              }
            >
              <item.icon className="text-lg" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-300 capitalize">{user?.role}</p>
          </div>
          <button onClick={logout} className="neon-btn text-sm py-2 px-4">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

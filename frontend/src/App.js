import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import { Toaster } from 'react-hot-toast';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import { AuthProvider } from './contexts/AuthContext';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import ErrorBoundary from './components/ErrorBoundary';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import ProtectedRoute from './components/ProtectedRoute';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import Login from './pages/Login';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import Register from './pages/Register';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import Properties from './pages/Properties';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import Tenants from './pages/Tenants';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import Payments from './pages/Payments';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import Maintenance from './pages/Maintenance';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import Reports from './pages/Reports';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import AcceptInvite from './pages/AcceptInvite';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import AdminPanel from './pages/AdminPanel';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';
import Layout from './components/Layout';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import Locations from './pages/Locations';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <HashRouter>
          <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #0af' } }} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/reports" element={<Reports />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/locations" element={<Locations />} />
              </Route>
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

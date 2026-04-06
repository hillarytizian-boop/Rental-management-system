import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationToast from './NotificationToast';

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 overflow-auto">
        <Outlet />
      </main>
      <NotificationToast />
    </div>
  );
}

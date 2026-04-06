import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function NotificationToast() {
  useEffect(() => {
    // Real-time notifications placeholder
    const interval = setInterval(() => {
      // toast('💡 New maintenance request received!', { icon: '🔧' });
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  return null;
}

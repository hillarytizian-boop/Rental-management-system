import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalRent: 0, pending: 0, occupied: 0, vacant: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data));
    api.get('/reports/income').then(res => setChartData(res.data));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Dashboard, {user?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Rent Collected', value: `KES ${stats.totalRent.toLocaleString()}`, icon: '💰', color: 'cyan' },
          { label: 'Pending Payments', value: `KES ${stats.pending.toLocaleString()}`, icon: '⏳', color: 'yellow' },
          { label: 'Occupied Units', value: stats.occupied, icon: '🏠', color: 'green' },
          { label: 'Vacant Units', value: stats.vacant, icon: '🔲', color: 'red' }
        ].map((item, idx) => (
          <div key={idx} className="floating-card p-6 flex justify-between items-center">
            <div><p className="text-gray-300 text-sm">{item.label}</p><p className="text-3xl font-bold">{item.value}</p></div>
            <span className="text-4xl">{item.icon}</span>
          </div>
        ))}
      </div>
      <div className="floating-card p-6">
        <h2 className="text-xl font-semibold mb-4">Income Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs><linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00c6ff" stopOpacity={0.8}/><stop offset="95%" stopColor="#0072ff" stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="month" stroke="#aaa" /><YAxis stroke="#aaa" />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #0af', borderRadius: '12px' }} />
            <Area type="monotone" dataKey="total" stroke="#0af" fill="url(#colorAmount)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

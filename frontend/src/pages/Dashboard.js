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

  // Hero background image (cinematic cityscape)
  const heroStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl" style={heroStyle}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10 py-20 px-6 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Welcome Back, {user?.name}
          </h1>
          <p className="text-xl mt-4 max-w-2xl mx-auto opacity-90">
            Manage your rental empire from a single dashboard.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Rent Collected', value: `KES ${stats.totalRent.toLocaleString()}`, icon: '💰', gradient: 'from-green-400 to-emerald-600' },
          { label: 'Pending Payments', value: `KES ${stats.pending.toLocaleString()}`, icon: '⏳', gradient: 'from-yellow-400 to-orange-600' },
          { label: 'Occupied Units', value: stats.occupied, icon: '🏠', gradient: 'from-blue-400 to-cyan-600' },
          { label: 'Vacant Units', value: stats.vacant, icon: '🔲', gradient: 'from-gray-400 to-gray-600' }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -8 }}
            className={`bg-gradient-to-br ${item.gradient} p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm">{item.label}</p>
                <p className="text-3xl font-bold text-white">{item.value}</p>
              </div>
              <span className="text-5xl">{item.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Income Chart */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-semibold mb-6 text-white">Income Trend</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c6ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0072ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid #0af', borderRadius: '12px' }} />
            <Area type="monotone" dataKey="total" stroke="#0af" fill="url(#colorAmount)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

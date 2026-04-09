import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FaEye, FaPlus } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalRent: 0, pending: 0, occupied: 0, vacant: 0 });
  const [transactions, setTransactions] = useState([]);
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data)).catch(() => {});
    api.get('/payments').then(res => setTransactions(res.data.slice(0, 5))).catch(() => {});
    api.get('/properties').then(res => setHouses(res.data)).catch(() => {});
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Rent', value: `KES ${stats.totalRent}`, color: 'bg-blue-600' },
          { label: 'Pending', value: `KES ${stats.pending}`, color: 'bg-yellow-600' },
          { label: 'Occupied', value: stats.occupied, color: 'bg-green-600' },
          { label: 'Vacant', value: stats.vacant, color: 'bg-red-600' }
        ].map((item, i) => (
          <div key={i} className={`${item.color} p-4 rounded-xl shadow-lg`}>
            <p className="text-white/80">{item.label}</p>
            <p className="text-3xl font-bold text-white">{item.value}</p>
            <div className="flex justify-between mt-2">
              <button className="text-xs text-white/70 hover:text-white">View details</button>
              <button className="text-xs text-white/70 hover:text-white"><FaPlus className="inline" /> Add</button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-gray-300">
            <thead className="border-b border-gray-700">
              <tr><th className="text-left p-2">Actor</th><th className="text-left p-2">Action Description</th><th className="text-left p-2">Time</th></tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="border-b border-gray-700/50">
                  <td className="p-2">System</td>
                  <td className="p-2">Payment of {tx.amount} for unit {tx.unit_number}</td>
                  <td className="p-2">{new Date(tx.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {transactions.length === 0 && <tr><td colSpan="3" className="p-4 text-center">No transactions yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* House Listing Table */}
      <div className="bg-gray-800/50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">House Listings</h2>
          <button className="bg-cyan-600 px-3 py-1 rounded text-sm hover:bg-cyan-700">+ Add House</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-gray-300">
            <thead className="border-b border-gray-700">
              <tr><th className="p-2">House ID</th><th className="p-2">House Name</th><th className="p-2">Rooms</th><th className="p-2">Rent</th><th className="p-2">Location</th><th className="p-2">Status</th></tr>
            </thead>
            <tbody>
              {houses.map(h => (
                <tr key={h.id} className="border-b border-gray-700/50">
                  <td className="p-2">{h.id}</td><td className="p-2">{h.name}</td><td className="p-2">{h.total_units}</td><td className="p-2">KES {h.rent_amount || 'N/A'}</td><td className="p-2">{h.address}</td><td className="p-2">{h.occupied_units ? 'Occupied' : 'Vacant'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

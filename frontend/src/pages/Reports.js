import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const [data, setData] = useState([]);
  useEffect(() => { api.get('/reports/income').then(res => setData(res.data)); }, []);
  return (
    <div className="p-6"><h2 className="text-3xl font-bold mb-6">Income Reports</h2><div className="floating-card p-6"><ResponsiveContainer width="100%" height={400}><BarChart data={data}><XAxis dataKey="month" stroke="#aaa"/><YAxis stroke="#aaa"/><Tooltip contentStyle={{background:'#0f1a2e',border:'1px solid #0af'}}/><Bar dataKey="total" fill="#00c6ff" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></div>
  );
}

import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Maintenance() {
  const [tickets, setTickets] = useState([]);
  const [desc, setDesc] = useState('');
  const [unitId, setUnitId] = useState('');

  useEffect(() => { api.get('/maintenance').then(res => setTickets(res.data)); }, []);

  const submitTicket = async () => {
    if (!desc || !unitId) return toast.error('Fill all fields');
    await api.post('/maintenance', { unit_id: unitId, description: desc });
    toast.success('Ticket submitted');
    setDesc('');
    const res = await api.get('/maintenance');
    setTickets(res.data);
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/maintenance/${id}/status`, { status });
    toast.success('Status updated');
    const res = await api.get('/maintenance');
    setTickets(res.data);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Maintenance Requests</h2>
      <div className="glass p-4 mb-6"><h3>Submit New Request</h3><input placeholder="Unit ID" value={unitId} onChange={e=>setUnitId(e.target.value)} className="bg-white/10 p-2 rounded w-full mb-2" /><textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} className="bg-white/10 p-2 rounded w-full mb-2" /><button onClick={submitTicket} className="neon-btn">Submit</button></div>
      <div className="grid gap-4">{tickets.map(t => (<div key={t.id} className="floating-card p-4"><p><strong>{t.property_name} - Unit {t.unit_number}</strong></p><p>{t.description}</p><p>Status: <span className={`${t.status==='resolved'?'text-green-400':t.status==='in_progress'?'text-yellow-400':'text-red-400'}`}>{t.status}</span></p><div className="mt-2 flex gap-2">{['submitted','in_progress','resolved'].map(s=><button key={s} onClick={()=>updateStatus(t.id,s)} className="text-xs bg-white/10 px-2 py-1 rounded">{s}</button>)}</div></div>))}</div>
    </div>
  );
}

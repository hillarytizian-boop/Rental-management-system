import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', unit_id: '' });

  useEffect(() => { api.get('/tenants').then(res => setTenants(res.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tenants', form);
      toast.success('Tenant added');
      setShowModal(false);
      const res = await api.get('/tenants');
      setTenants(res.data);
    } catch (err) { toast.error(err.response?.data?.error); }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-8"><h2 className="text-3xl font-bold">Tenants</h2><button onClick={()=>setShowModal(true)} className="neon-btn">+ Add Tenant</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map(tenant => (
          <div key={tenant.id} className="floating-card p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-xl font-bold">{tenant.name[0]}</div><div><h3 className="font-semibold">{tenant.name}</h3><p className="text-sm text-gray-300">{tenant.email}</p></div></div>
        ))}
      </div>
      {showModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="glass p-6 w-full max-w-md"><h3>Add Tenant</h3><form onSubmit={handleSubmit} className="space-y-4"><input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-2 rounded bg-white/10" required/><input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full p-2 rounded bg-white/10" required/><input type="password" placeholder="Temp Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full p-2 rounded bg-white/10" required/><input placeholder="Unit ID (optional)" value={form.unit_id} onChange={e=>setForm({...form,unit_id:e.target.value})} className="w-full p-2 rounded bg-white/10"/><div className="flex gap-3"><button type="submit" className="neon-btn">Save</button><button onClick={()=>setShowModal(false)} className="bg-gray-600 px-4 py-2 rounded">Cancel</button></div></form></div></div>)}
    </div>
  );
}

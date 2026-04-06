import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', total_units: 0, image_url: '' });

  useEffect(() => { api.get('/properties').then(res => setProperties(res.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/properties', form);
      setProperties([...properties, res.data]);
      setShowModal(false);
      setForm({ name: '', address: '', total_units: 0, image_url: '' });
      toast.success('Property added');
    } catch (err) { toast.error(err.response?.data?.error); }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8"><h2 className="text-3xl font-bold">Properties</h2><button onClick={() => setShowModal(true)} className="neon-btn">+ Add Property</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(prop => (
          <motion.div whileHover={{ scale: 1.02 }} key={prop.id} className="floating-card overflow-hidden">
            <img src={prop.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'} className="w-full h-48 object-cover" />
            <div className="p-4"><h3 className="text-xl font-semibold">{prop.name}</h3><p className="text-gray-300">{prop.address}</p><div className="flex justify-between mt-4"><span className="text-cyan-400">Units: {prop.total_units}</span></div></div>
          </motion.div>
        ))}
      </div>
      {showModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="glass p-6 w-full max-w-md"><h3 className="text-2xl mb-4">Add Property</h3><form onSubmit={handleSubmit} className="space-y-4"><input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-2 rounded bg-white/10" required/><input placeholder="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="w-full p-2 rounded bg-white/10"/><input type="number" placeholder="Total Units" value={form.total_units} onChange={e=>setForm({...form,total_units:parseInt(e.target.value)})} className="w-full p-2 rounded bg-white/10"/><input placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} className="w-full p-2 rounded bg-white/10"/><div className="flex gap-3"><button type="submit" className="neon-btn">Save</button><button type="button" onClick={()=>setShowModal(false)} className="bg-gray-600 px-4 py-2 rounded">Cancel</button></div></form></div></div>)}
    </div>
  );
}

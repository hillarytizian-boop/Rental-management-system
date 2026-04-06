import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [phone, setPhone] = useState('');

  useEffect(() => { api.get('/payments').then(res => setPayments(res.data)); }, []);

  const initiateMpesa = async (payment) => {
    if (!phone) return toast.error('Enter phone number');
    try {
      await api.post('/payments/mpesa/initiate', { payment_id: payment.id, phoneNumber: phone, amount: payment.amount });
      toast.success('STK Push sent. Check your phone.');
    } catch (err) { toast.error(err.response?.data?.error); }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Payments</h2>
      <div className="grid gap-4">
        {payments.map(p => (
          <div key={p.id} className="floating-card p-4 flex justify-between items-center">
            <div><p className="font-semibold">{p.property_name} - Unit {p.unit_number}</p><p>Amount: KES {p.amount}</p><p>Due: {new Date(p.due_date).toLocaleDateString()}</p><span className={`px-2 py-1 rounded text-xs ${p.status==='paid'?'bg-green-500/20 text-green-300':p.status==='overdue'?'bg-red-500/20 text-red-300':'bg-yellow-500/20 text-yellow-300'}`}>{p.status}</span></div>
            {p.status !== 'paid' && (<div className="flex gap-2"><input type="tel" placeholder="M-Pesa phone" onChange={e=>setPhone(e.target.value)} className="bg-white/10 p-2 rounded" /><button onClick={()=>initiateMpesa(p)} className="neon-btn text-sm">Pay via M-Pesa</button></div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function InviteTenantModal({ propertyId, unitId, onClose }) {
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);

  const generateInvite = async () => {
    if (!email) return toast.error('Enter email');
    setLoading(true);
    try {
      const res = await api.post('/tenants/invite', { email, property_id: propertyId, unit_id: unitId });
      setInviteLink(res.data.inviteLink);
      toast.success('Invite created! Copy the link below.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="glass p-6 w-full max-w-md">
        <h3 className="text-2xl mb-4">Invite Tenant</h3>
        {!inviteLink ? (
          <>
            <input type="email" placeholder="Tenant email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 rounded bg-white/10 mb-4" />
            <button onClick={generateInvite} disabled={loading} className="neon-btn w-full">Generate Invite</button>
          </>
        ) : (
          <>
            <p className="mb-2">Share this link with the tenant:</p>
            <input readOnly value={inviteLink} className="w-full p-2 rounded bg-white/10 text-xs break-all mb-4" />
            <button onClick={() => navigator.clipboard.writeText(inviteLink)} className="neon-btn w-full">Copy Link</button>
          </>
        )}
        <button onClick={onClose} className="mt-4 text-gray-400 hover:text-white">Close</button>
      </div>
    </div>
  );
}

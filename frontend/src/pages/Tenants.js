import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import InviteTenantModal from '../components/InviteTenantModal';

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchTenants();
    fetchProperties();
  }, []);

  const fetchTenants = async () => {
    const res = await api.get('/tenants');
    setTenants(res.data);
  };
  const fetchProperties = async () => {
    const res = await api.get('/properties');
    setProperties(res.data);
  };

  const openInviteModal = () => {
    if (!selectedProperty || !selectedUnit) {
      toast.error('Select a property and unit first');
      return;
    }
    setShowInviteModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Tenants</h2>
        <div className="flex gap-4">
          <select onChange={e => setSelectedProperty(e.target.value)} className="bg-white/10 p-2 rounded">
            <option value="">Select Property</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select onChange={e => setSelectedUnit(e.target.value)} className="bg-white/10 p-2 rounded">
            <option value="">Select Unit</option>
            {selectedProperty && properties.find(p => p.id == selectedProperty)?.units?.map(u => <option key={u.id} value={u.id}>{u.unit_number}</option>)}
          </select>
          <button onClick={openInviteModal} className="neon-btn">+ Invite Tenant</button>
        </div>
      </div>
      <div className="grid gap-4">
        {tenants.map(tenant => (
          <div key={tenant.id} className="floating-card p-4 flex justify-between items-center">
            <div><p className="font-semibold">{tenant.name}</p><p className="text-sm text-gray-300">{tenant.email}</p></div>
            <span className={`px-2 py-1 rounded text-xs ${tenant.invite_accepted ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
              {tenant.invite_accepted ? 'Active' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
      {showInviteModal && (
        <InviteTenantModal
          propertyId={selectedProperty}
          unitId={selectedUnit}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}

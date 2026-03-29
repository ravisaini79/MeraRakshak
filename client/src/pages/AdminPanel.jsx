import React, { useState, useEffect } from 'react';
import { Users, Tablet, AlertCircle, BarChart3, Search, ShieldAlert, CheckCircle, Ban } from 'lucide-react';
import AuthService from '../services/AuthService';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAdminData = async () => {
    try {
      const usersData = await AuthService.getAdminUsers();
      const statsData = await AuthService.getAdminStats();
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleBlock = async (userId) => {
    try {
      await AuthService.toggleBlockUser(userId);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-slate-500 font-bold tracking-widest">VERIFYING SUPERADMIN PRIVILEGES...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStat title="Total Users" value={stats?.totalUsers} icon={<Users size={24} />} color="text-blue-600 bg-blue-50" />
        <AdminStat title="Devices" value={stats?.totalDevices} icon={<Tablet size={24} />} color="text-indigo-600 bg-indigo-50" />
        <AdminStat title="Active Now" value={stats?.activeDevices} icon={<CheckCircle size={24} />} color="text-emerald-600 bg-emerald-50" />
        <AdminStat title="Theft Reported" value={stats?.stolenDevices} icon={<ShieldAlert size={24} />} color="text-red-600 bg-red-50" />
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">User Management</h2>
            <p className="text-slate-500 font-bold text-sm">Review, block, or manage all platform users</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">User Details</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs font-bold text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {user.isBlocked ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase">
                        <Ban size={12} /> Blocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase">
                        <CheckCircle size={12} /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-xs font-black uppercase tracking-wider ${user.role === 'superadmin' ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {user.role !== 'superadmin' && (
                      <button 
                        onClick={() => handleToggleBlock(user._id)}
                        className={`px-4 py-2 font-bold text-xs rounded-xl transition-all border-2 ${
                          user.isBlocked 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                            : 'bg-white border-red-100 text-red-600 hover:border-red-500'
                        }`}
                      >
                        {user.isBlocked ? 'Unblock User' : 'Block User'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminStat = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        {icon}
      </div>
      <BarChart3 className="text-slate-200" size={20} />
    </div>
    <p className="text-sm font-bold text-slate-500 mb-1">{title}</p>
    <p className="text-3xl font-black text-slate-900">{value}</p>
  </div>
);

export default AdminPanel;

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Shield, UserX, Crown } from 'lucide-react';
import AuthService from '../services/AuthService';

const Family = () => {
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking for now as I need to check family API
    setMembers([
      { id: 1, name: 'Ravi Kumar', email: 'ravi@example.com', role: 'Head', status: 'Active' },
      { id: 2, name: 'Anjali Sharma', email: 'anjali@example.com', role: 'Member', status: 'Active' },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 tracking-wide">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Family Group</h1>
          <p className="text-slate-500 font-bold">Manage shared device access and safety alerts</p>
        </div>
        <div className="p-3 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-2">
          <Crown className="text-amber-500" size={20} />
          <span className="text-sm font-black text-slate-800">Saini Family Plan</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users size={20} className="text-indigo-600" /> Current Members
          </h2>
          {members.map(member => (
            <div key={member.id} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{member.name}</h3>
                  <p className="text-xs font-bold text-slate-400">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${member.role === 'Head' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                  {member.role}
                </span>
                <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <UserX size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-xl shadow-indigo-600/30 text-white sticky top-8">
            <UserPlus size={32} className="mb-4 opacity-80" />
            <h3 className="text-xl font-black mb-2">Invite Member</h3>
            <p className="text-indigo-100 text-sm font-bold mb-6">Add a family member to share security logs and device location.</p>
            
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                <input 
                  type="email" 
                  placeholder="Member email..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-indigo-500/50 border border-indigo-400 rounded-xl focus:outline-none placeholder:text-indigo-200 font-bold text-sm"
                />
              </div>
              <button className="w-full py-4 bg-white text-indigo-600 font-black rounded-xl hover:bg-slate-100 transition-all shadow-xl">
                Send Invitation
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-indigo-500/50 flex items-center gap-3">
              <Shield size={18} className="text-indigo-300" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">End-to-end Encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Family;

import React from 'react';
import { User, Shield, Bell, Moon, Globe, HelpCircle, ChevronRight, Lock } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Account Settings</h1>
        <p className="text-slate-500 font-bold">Personalize your TrackShield experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-8">
          <div className="h-24 w-24 bg-indigo-100 rounded-[2rem] flex items-center justify-center text-indigo-600">
            <User size={48} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-slate-900">Account Profile</h2>
            <p className="text-slate-500 font-bold">Manage your password and security keys</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
              <button className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl border border-slate-900 shadow-lg">Edit Profile</button>
              <button className="px-6 py-2.5 bg-white text-slate-900 text-xs font-black rounded-xl border-2 border-slate-100">Change Password</button>
            </div>
          </div>
        </div>

        {/* Setting Sections */}
        <SettingSection title="Security" icon={<Lock className="text-red-500" />}>
          <SettingItem label="Two-Factor Auth" status="Enabled" />
          <SettingItem label="App Fingerprint" status="Disabled" />
          <SettingItem label="Auto-Lock Timer" status="5 Minutes" />
        </SettingSection>

        <SettingSection title="Notifications" icon={<Bell className="text-amber-500" />}>
          <SettingItem label="Alert Sounds" status="System Default" />
          <SettingItem label="Email Reports" status="Weekly" />
          <SettingItem label="Push Notifications" status="Active" isChecked={true} />
        </SettingSection>

        <SettingSection title="Preferences" icon={<Moon className="text-indigo-500" />}>
          <SettingItem label="Dark Mode" status="Auto" />
          <SettingItem label="Language" status="English (US)" />
        </SettingSection>

        <SettingSection title="Support" icon={<HelpCircle className="text-emerald-500" />}>
          <SettingItem label="Help Center" description="Common questions and setup guides" />
          <SettingItem label="Contact Support" description="Reach out to our security experts" />
        </SettingSection>
      </div>
    </div>
  );
};

const SettingSection = ({ title, icon, children }) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
    </div>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

const SettingItem = ({ label, status, description, isChecked }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
    <div>
      <p className="text-sm font-bold text-slate-800">{label}</p>
      {description && <p className="text-[10px] font-bold text-slate-400 mt-1">{description}</p>}
    </div>
    <div className="flex items-center gap-3">
      {status && <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{status}</span>}
      <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
    </div>
  </div>
);

export default Settings;

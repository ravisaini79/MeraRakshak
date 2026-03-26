import React, { useState, useEffect } from 'react';
import { Tablet, Smartphone, Laptop, Plus, MoreVertical, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import AuthService from '../services/AuthService';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await AuthService.getDevices();
        setDevices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  if (loading) return <div className="p-8 font-bold text-slate-400">Loading devices...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Your Devices</h1>
          <p className="text-slate-500 font-bold">Manage and monitor all connected hardware</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
          <Plus size={20} /> Add New Device
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map(device => (
          <div key={device._id} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 group hover:border-indigo-500/50 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${device.status === 'Stolen' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                {device.deviceType === 'Android' || device.deviceType === 'iOS' ? <Smartphone size={32} /> : <Laptop size={32} />}
              </div>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{device.name}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{device.model} • {device.deviceId}</p>
              </div>

              <div className="flex items-center gap-4 py-4 border-y border-slate-50 text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock size={14} className="text-slate-300" />
                  Last seen {new Date(device.lastSeen || Date.now()).toLocaleTimeString()}
                </div>
                <div className={`flex items-center gap-1.5 ${device.status === 'Stolen' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {device.status === 'Stolen' ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                  {device.status}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button className="flex-1 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all">
                  Track Live
                </button>
                <button className={`flex-1 py-3 border-2 text-xs font-bold rounded-xl transition-all ${
                  device.status === 'Stolen' ? 'bg-red-50 border-red-100 text-red-600' : 'border-slate-100 text-slate-900 hover:border-red-500 hover:text-red-600'
                }`}>
                  {device.status === 'Stolen' ? 'Stolen Mode Active' : 'Report Stolen'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {devices.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-slate-400">
            <Tablet size={48} className="mb-4 opacity-20" />
            <p className="font-bold italic">No devices found. Add your first device to start tracking.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Devices;

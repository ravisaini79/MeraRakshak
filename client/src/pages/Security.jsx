import React, { useState, useEffect } from 'react';
import { Shield, Clock, MapPin, Camera, AlertCircle, Trash2 } from 'lucide-react';
import AuthService from '../services/AuthService';

const Security = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await AuthService.getSecurityEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="p-8 font-bold text-slate-400">Loading activity timeline...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Security Timeline</h1>
        <p className="text-slate-500 font-bold">Monitor all critical events and snapshots</p>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {events.map((event, index) => (
          <div key={event._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            {/* Dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow-xl shadow-slate-200/50 absolute left-0 md:left-1/2 md:-ml-5 z-10 transition-all group-hover:scale-110">
              <div className={`w-3 h-3 rounded-full ${event.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-indigo-500'}`}></div>
            </div>

            {/* Content */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 group-hover:border-indigo-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  event.severity === 'CRITICAL' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {event.type}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">{event.message}</h3>

              {event.photoUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-slate-100 group/image relative">
                  <img src={event.photoUrl} alt="Security Snapshot" className="w-full h-48 object-cover transition-transform duration-500 group-hover/image:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover/image:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-bold flex items-center gap-2">
                       <Camera size={14} /> Security Snapshot Captured
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <MapPin size={14} className="text-indigo-500" />
                  View Location
                </div>
                <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-bold italic">
            <Shield size={48} className="mx-auto mb-4 opacity-20" />
            Your security timeline is clear.
          </div>
        )}
      </div>
    </div>
  );
};

export default Security;

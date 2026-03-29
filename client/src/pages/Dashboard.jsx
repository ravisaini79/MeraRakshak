import React, { useState, useEffect } from 'react';
import { Tablet, Shield, MapPin, AlertTriangle, Clock, Battery, Signal } from 'lucide-react';
import AuthService from '../services/AuthService';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    stolen: 0,
    events: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const deviceData = await AuthService.getDevices();
      setDevices(deviceData);
      
      const eventData = await AuthService.getSecurityEvents();
      
      setStats({
        active: deviceData.filter(d => d.status === 'Active').length,
        stolen: deviceData.filter(d => d.status === 'Stolen').length,
        events: eventData.length
      });

      if (deviceData.length > 0 && !selectedDevice) {
        setSelectedDevice(deviceData[0]);
      }
    } catch (err) {
      console.error('Fetch dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-slate-500 font-bold">Loading secure data...</div>;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Devices" value={stats.active} icon={<Tablet className="text-indigo-600" />} color="bg-indigo-50" />
        <StatCard title="Security Alerts" value={stats.stolen} icon={<AlertTriangle className="text-red-600" />} color="bg-red-50" />
        <StatCard title="Recent Events" value={stats.events} icon={<Shield className="text-emerald-600" />} color="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Device List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Your Devices</h2>
          {devices.map(device => (
            <div 
              key={device._id} 
              onClick={() => setSelectedDevice(device)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedDevice?._id === device._id ? 'border-indigo-500 bg-white shadow-lg' : 'border-transparent bg-white hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${device.status === 'Stolen' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                  <Tablet size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{device.name}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{device.model}</p>
                </div>
                <div className={`h-2.5 w-2.5 rounded-full ${device.status === 'Stolen' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
              </div>
              
              {selectedDevice?._id === device._id && (
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Battery size={14} className="text-slate-400" />
                    <span className="text-xs font-bold">{device.lastLocation?.batteryLevel || 85}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Signal size={14} className="text-slate-400" />
                    <span className="text-xs font-bold">Excellent</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live Tracking Map */}
        <div className="lg:col-span-2 rounded-[2rem] overflow-hidden bg-white shadow-xl shadow-slate-200/50 border border-slate-100 relative h-[600px]">
          <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 max-w-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={18} className="text-indigo-600" /> Live Tracking
            </h3>
            {selectedDevice ? (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase">{selectedDevice.name}</p>
                <div className="flex items-center gap-2 text-slate-400 mt-1">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold">Updated: {new Date(selectedDevice.lastLocation?.timestamp || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-1">Select a device to track</p>
            )}
          </div>

          {selectedDevice?.lastLocation ? (
            <MapContainer 
              center={[selectedDevice.lastLocation.latitude, selectedDevice.lastLocation.longitude]} 
              zoom={15} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <ChangeView center={[selectedDevice.lastLocation.latitude, selectedDevice.lastLocation.longitude]} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[selectedDevice.lastLocation.latitude, selectedDevice.lastLocation.longitude]}>
                <Popup>
                  <div className="font-bold">{selectedDevice.name}</div>
                  <div className="text-xs text-slate-500">Last seen here</div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold italic">
              No location data available for this device
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100">
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;

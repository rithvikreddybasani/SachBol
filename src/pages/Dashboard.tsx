import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Filter, Search, FileText, CheckCircle, Clock, BarChart2, PieChart, TrendingUp, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useComplaints } from '../context/ComplaintContext';
import { supabase } from '../lib/supabase';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Fix Leaflet icon issue
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Define COLORS array for PieChart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
      <svg style="width: 20px; height: 20px; color: white;" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
      </svg>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
};

// Helper function to get status color classes
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface LocationData {
  location: string;
  count: number;
  coordinates: [number, number];
  severity: 'low' | 'medium' | 'high';
}

const getLocationCoordinates = async (location: string): Promise<[number, number]> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)},India&format=json&limit=1`
    );
    const data = await response.json();
    if (data && data[0]) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    // Return default coordinates for India if location not found
    return [20.5937, 78.9629];
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return [20.5937, 78.9629];
  }
};

const getSeverityColor = (count: number): string => {
  if (count > 30) return '#FF0000';
  if (count > 15) return '#FFA500';
  return '#FFFF00';
};

const getSeverityRadius = (count: number): number => {
  if (count > 30) return 50000;
  if (count > 15) return 30000;
  return 20000;
};

interface DashboardStats {
  totalComplaints: number;
  resolutionRate: number;
  avgResolutionTime: number;
  corruptionHotspots: number;
  categoryDistribution: { name: string; value: number }[];
  monthlyTrends: { month: string; complaints: number; resolved: number }[];
  departmentPerformance: {
    name: string;
    resolutionRate: number;
    avgDays: number;
    complaints: number;
  }[];
  hotspots: {
    id: number;
    lat: number;
    lng: number;
    name: string;
    count: number;
    severity: string;
  }[];
}

const Dashboard: React.FC = () => {
  const { complaints, loading, error } = useComplaints();
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'regions' | 'trends'>('overview');
  const [timeFilter, setTimeFilter] = useState('all');
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    processLocationData();
    fetchDashboardStats();
  }, [complaints]);

  const processLocationData = async () => {
    const locationCounts: { [key: string]: number } = {};
    
    // Count complaints per location
    complaints.forEach(complaint => {
      const location = complaint.location;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    // Process location data with coordinates
    const processedData: LocationData[] = await Promise.all(
      Object.entries(locationCounts).map(async ([location, count]) => {
        const coordinates = await getLocationCoordinates(location);
        return {
          location,
          count,
          coordinates,
          severity: count > 30 ? 'high' : count > 15 ? 'medium' : 'low'
        };
      })
    );

    setLocationData(processedData);

    // Set map center to location with highest complaints
    if (processedData.length > 0) {
      const maxLocation = processedData.reduce((max, current) => 
        current.count > max.count ? current : max
      );
      setMapCenter(maxLocation.coordinates);
      setMapZoom(5);
    }
  };

  const fetchDashboardStats = async () => {
    if (!complaints.length) return;

    try {
      // Calculate category distribution
      const categoryCount = complaints.reduce((acc: { [key: string]: number }, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
      }, {});

      const categoryDistribution = Object.entries(categoryCount).map(([name, value]) => ({
        name,
        value
      }));

      // Calculate monthly trends
      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = format(date, 'MMM');
        const monthComplaints = complaints.filter(c => 
          format(new Date(c.createdAt), 'MMM') === month
        );
        return {
          month,
          complaints: monthComplaints.length,
          resolved: monthComplaints.filter(c => c.status === 'resolved').length
        };
      }).reverse();

      // Calculate department performance
      const departmentPerformance = Object.entries(
        complaints.reduce((acc: any, curr) => {
          if (!acc[curr.department]) {
            acc[curr.department] = {
              total: 0,
              resolved: 0,
              totalDays: 0
            };
          }
          acc[curr.department].total++;
          if (curr.status === 'resolved') {
            acc[curr.department].resolved++;
            const days = Math.ceil(
              (new Date(curr.updatedAt).getTime() - new Date(curr.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
            );
            acc[curr.department].totalDays += days;
          }
          return acc;
        }, {})
      ).map(([name, data]: [string, any]) => ({
        name,
        resolutionRate: Math.round((data.resolved / data.total) * 100),
        avgDays: data.resolved ? Math.round(data.totalDays / data.resolved) : 0,
        complaints: data.total
      }));

      setDashboardStats({
        totalComplaints: complaints.length,
        resolutionRate: (complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100,
        avgResolutionTime: Math.round(
          complaints.filter(c => c.status === 'resolved')
            .reduce((acc, curr) => acc + Math.ceil(
              (new Date(curr.updatedAt).getTime() - new Date(curr.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
            ), 0) / complaints.filter(c => c.status === 'resolved').length
        ),
        corruptionHotspots: locationData.filter(l => l.severity === 'high').length,
        categoryDistribution,
        monthlyTrends: monthlyData,
        departmentPerformance,
        hotspots: locationData.map((loc, index) => ({
          id: index + 1,
          lat: loc.coordinates[0],
          lng: loc.coordinates[1],
          name: loc.location,
          count: loc.count,
          severity: loc.severity
        }))
      });
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Dashboard Header */}

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto flex items-center gap-2 bg-white p-2 rounded-lg shadow">
          <Filter className="text-gray-500" size={20} />
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full md:w-auto border-none bg-transparent focus:ring-0"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-4 mb-6">
        {['overview', 'departments', 'regions', 'trends'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      {dashboardStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600">Total Complaints</p>
                <h3 className="text-xl md:text-2xl font-bold">{dashboardStats.totalComplaints}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600">Resolution Rate</p>
                <h3 className="text-xl md:text-2xl font-bold">{dashboardStats.resolutionRate.toFixed(1)}%</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600">Avg. Resolution Time</p>
                <h3 className="text-xl md:text-2xl font-bold">{dashboardStats.avgResolutionTime} days</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <MapPin className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600">Corruption Hotspots</p>
                <h3 className="text-xl md:text-2xl font-bold">{dashboardStats.corruptionHotspots}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      <div className="space-y-6">
        {activeTab === 'overview' && dashboardStats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Complaint Categories</h2>
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Pie
                      data={dashboardStats.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius="80%"
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardStats.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Monthly Trends</h2>
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dashboardStats.monthlyTrends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="complaints" stroke="#8884d8" name="Filed" />
                    <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="Resolved" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'departments' && dashboardStats && (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Department Performance</h2>
            <div className="h-[400px] md:h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardStats.departmentPerformance}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="resolutionRate"
                    name="Resolution Rate (%)"
                    fill="#1D4ED8"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'regions' && (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Geographical Distribution</h2>
            <div className="h-[400px] md:h-[600px] rounded-lg overflow-hidden">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {locationData.map((location, index) => (
                  <React.Fragment key={index}>
                    <Circle
                      center={location.coordinates}
                      radius={getSeverityRadius(location.count)}
                      pathOptions={{
                        color: getSeverityColor(location.count),
                        fillColor: getSeverityColor(location.count),
                        fillOpacity: 0.3
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{location.location}</h3>
                          <p>Complaints: {location.count}</p>
                          <p>Severity: {location.severity}</p>
                        </div>
                      </Popup>
                    </Circle>
                    <Marker
                      position={location.coordinates}
                      icon={createCustomIcon(getSeverityColor(location.count))}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{location.location}</h3>
                          <p>Complaints: {location.count}</p>
                          <p>Severity: {location.severity}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {activeTab === 'trends' && dashboardStats && (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Resolution Time Trends</h2>
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardStats.departmentPerformance}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgDays" name="Average Resolution Days" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
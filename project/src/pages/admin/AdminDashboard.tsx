import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  LineChart, 
  BarChart, 
  ArrowUp, 
  ArrowDown,
  PieChart,
  ArrowRight
} from 'lucide-react';
import { adminService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

type DashboardStats = {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  pendingAppointments: number;
  todayAppointments: number;
  totalRevenue: number;
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);
  
  return (
    <div className="fade-in">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Doctors</p>
                  <h3 className="text-2xl font-bold">{stats?.totalDoctors}</h3>
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <ArrowUp size={12} className="mr-1" /> 12% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserCheck size={24} className="text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  to="/admin/doctors" 
                  className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
                >
                  View all doctors <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Patients</p>
                  <h3 className="text-2xl font-bold">{stats?.totalPatients}</h3>
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <ArrowUp size={12} className="mr-1" /> 8% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Users size={24} className="text-secondary" />
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  to="/admin/patients" 
                  className="text-secondary hover:text-secondary-dark text-sm font-medium flex items-center"
                >
                  View all patients <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Appointments</p>
                  <h3 className="text-2xl font-bold">{stats?.totalAppointments}</h3>
                  <p className="text-xs text-yellow-600 mt-2 flex items-center">
                    <ArrowUp size={12} className="mr-1" /> 5% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Calendar size={24} className="text-yellow-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                  <span className="text-gray-600 mr-3">Pending: {stats?.pendingAppointments}</span>
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  <span className="text-gray-600">Today: {stats?.todayAppointments}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                  <h3 className="text-2xl font-bold">₹{stats?.totalRevenue.toLocaleString()}</h3>
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <ArrowUp size={12} className="mr-1" /> 15% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign size={24} className="text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div className="h-1 bg-green-500 rounded-full w-3/4"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  75% of monthly target
                </p>
              </div>
            </div>
          </div>
          
          {/* Charts and tables section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Revenue Overview</h2>
                <select className="text-sm border rounded-md p-1">
                  <option>This Year</option>
                  <option>Last Year</option>
                  <option>Last 6 Months</option>
                </select>
              </div>
              
              <div className="h-64 bg-gray-50 rounded-md p-4 flex items-end space-x-6 justify-around">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                  <div key={month} className="flex flex-col items-center">
                    <div className="bg-primary w-8 rounded-t-md" style={{ height: `${20 + Math.floor(Math.random() * 80)}%` }}></div>
                    <span className="text-xs mt-2">{month}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-xl font-bold">₹{(stats?.totalRevenue || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenue Growth</p>
                  <p className="text-xl font-bold text-green-600">+15%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Average</p>
                  <p className="text-xl font-bold">₹{Math.floor((stats?.totalRevenue || 0) / 12).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            {/* Distribution charts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">User Distribution</h2>
              
              {/* Doctor vs Patient chart */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Doctors vs Patients</p>
                  <p className="text-sm text-gray-500">Total: {(stats?.totalDoctors || 0) + (stats?.totalPatients || 0)}</p>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ 
                      width: `${(stats?.totalDoctors || 0) / ((stats?.totalDoctors || 0) + (stats?.totalPatients || 0)) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mr-1"></span>
                    <span>Doctors: {stats?.totalDoctors || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-gray-200 rounded-full mr-1"></span>
                    <span>Patients: {stats?.totalPatients || 0}</span>
                  </div>
                </div>
              </div>
              
              {/* Appointment status chart */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Appointment Status</p>
                  <p className="text-sm text-gray-500">Total: {stats?.totalAppointments || 0}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-xl font-bold text-green-600">{stats?.totalAppointments && stats.pendingAppointments ? stats.totalAppointments - stats.pendingAppointments : 0}</p>
                    <p className="text-xs text-gray-500">Confirmed</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-xl font-bold text-yellow-600">{stats?.pendingAppointments || 0}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-xl font-bold text-blue-600">{stats?.todayAppointments || 0}</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md text-center">
                    <p className="text-xl font-bold text-purple-600">{Math.floor((stats?.totalAppointments || 0) * 0.1)}</p>
                    <p className="text-xs text-gray-500">Canceled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent activities and quick actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent activities */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-4 pb-4">
                  <p className="text-sm font-medium">Doctor Added</p>
                  <p className="text-sm text-gray-600">Dr. Sarah Johnson (Cardiology) was added to the system.</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
                <div className="border-l-2 border-secondary pl-4 pb-4">
                  <p className="text-sm font-medium">New Appointment</p>
                  <p className="text-sm text-gray-600">Emily Robinson booked an appointment with Dr. Michael Chen.</p>
                  <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                </div>
                <div className="border-l-2 border-yellow-500 pl-4 pb-4">
                  <p className="text-sm font-medium">Payment Received</p>
                  <p className="text-sm text-gray-600">Payment of ₹2,500 received for appointment #APT-10234.</p>
                  <p className="text-xs text-gray-500 mt-1">6 hours ago</p>
                </div>
                <div className="border-l-2 border-green-500 pl-4 pb-4">
                  <p className="text-sm font-medium">Doctor Profile Updated</p>
                  <p className="text-sm text-gray-600">Dr. James Wilson updated his profile information.</p>
                  <p className="text-xs text-gray-500 mt-1">8 hours ago</p>
                </div>
                <div className="border-l-2 border-red-500 pl-4">
                  <p className="text-sm font-medium">Appointment Cancelled</p>
                  <p className="text-sm text-gray-600">Daniel Kim cancelled his appointment with Dr. Rebecca Martinez.</p>
                  <p className="text-xs text-gray-500 mt-1">10 hours ago</p>
                </div>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/admin/doctors" 
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <UserCheck size={24} className="text-primary mb-2" />
                  <span className="text-sm font-medium">Manage Doctors</span>
                </Link>
                <Link 
                  to="/admin/patients" 
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Users size={24} className="text-primary mb-2" />
                  <span className="text-sm font-medium">Manage Patients</span>
                </Link>
                <button
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <BarChart size={24} className="text-primary mb-2" />
                  <span className="text-sm font-medium">Reports</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <PieChart size={24} className="text-primary mb-2" />
                  <span className="text-sm font-medium">Analytics</span>
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">System Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-600">System Uptime</p>
                    <p className="text-xs font-medium">99.98%</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-600">Server Load</p>
                    <p className="text-xs font-medium">24%</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-600">Database Size</p>
                    <p className="text-xs font-medium">2.4 GB</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-600">API Requests (24h)</p>
                    <p className="text-xs font-medium">56,482</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
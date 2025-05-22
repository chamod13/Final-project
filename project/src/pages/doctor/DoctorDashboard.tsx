import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  UserPlus, 
  LineChart, 
  CheckCircle, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { appointmentService, doctorService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { AppointmentType } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [earnings, setEarnings] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch appointments
        const appointmentsResponse = await appointmentService.getDoctorAppointments();
        setAppointments(appointmentsResponse.data);
        
        // Fetch earnings
        const earningsResponse = await doctorService.getDoctorEarnings();
        setEarnings(earningsResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    appointment => appointment.date === today
  ).sort((a, b) => {
    // Sort by time
    return a.timeSlot.startTime.localeCompare(b.timeSlot.startTime);
  });
  
  // Get appointment stats
  const appointmentStats = {
    total: appointments.length,
    completed: appointments.filter(a => a.status === 'completed').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-blue-600" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="fade-in">
      <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome card */}
            <div className="bg-gradient-to-r from-secondary to-secondary-dark rounded-lg text-white p-6">
              <h2 className="text-xl font-semibold mb-2">Welcome, Dr. {user?.name.split(' ')[1]}!</h2>
              <p className="mb-4">
                Manage your appointments, check your schedule, and track your earnings in one place.
              </p>
              <div className="flex space-x-3">
                <Link 
                  to="/doctor/appointments" 
                  className="inline-flex items-center bg-white text-secondary hover:bg-gray-100 transition-colors px-4 py-2 rounded-md font-medium text-sm"
                >
                  View Appointments <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link 
                  to="/doctor/earnings" 
                  className="inline-flex items-center bg-secondary-dark/20 text-white border border-white/30 hover:bg-secondary-dark/40 transition-colors px-4 py-2 rounded-md font-medium text-sm"
                >
                  Earnings Report
                </Link>
              </div>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Users size={20} className="text-blue-600" />
                </div>
                <p className="text-sm text-gray-500">Total Patients</p>
                <h3 className="text-2xl font-bold">{appointments.reduce((unique, curr) => 
                  unique.includes(curr.patientId) ? unique : [...unique, curr.patientId], [] as string[]
                ).length}</h3>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Calendar size={20} className="text-green-600" />
                </div>
                <p className="text-sm text-gray-500">Appointments</p>
                <h3 className="text-2xl font-bold">{appointmentStats.total}</h3>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                  <Clock size={20} className="text-yellow-600" />
                </div>
                <p className="text-sm text-gray-500">Today's Appointments</p>
                <h3 className="text-2xl font-bold">{todayAppointments.length}</h3>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <DollarSign size={20} className="text-purple-600" />
                </div>
                <p className="text-sm text-gray-500">This Month</p>
                <h3 className="text-2xl font-bold">₹{earnings.thisMonth.toLocaleString()}</h3>
              </div>
            </div>
            
            {/* Today's appointments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Today's Schedule</h2>
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No appointments scheduled for today.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:border-secondary/30 transition-colors"
                    >
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                            {appointment.patient?.image ? (
                              <img 
                                src={appointment.patient.image} 
                                alt={appointment.patient.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Users size={40} className="w-full h-full text-gray-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{appointment.patient?.name}</p>
                            <p className="text-sm text-gray-500">Patient ID: {appointment.patientId.substring(0, 8)}</p>
                          </div>
                        </div>
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-y-2 mt-3 text-sm">
                        <div className="flex items-center w-full md:w-1/3">
                          <Clock size={16} className="text-gray-500 mr-2" />
                          <span>
                            {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                          </span>
                        </div>
                        
                        {appointment.symptom && (
                          <div className="w-full mt-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Symptoms:</span> {appointment.symptom}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 flex justify-end space-x-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              className="btn bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-3"
                            >
                              Confirm
                            </button>
                            <button
                              className="btn bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-3"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        
                        {appointment.status === 'confirmed' && (
                          <button
                            className="btn bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3"
                          >
                            Complete
                          </button>
                        )}
                        
                        <Link
                          to={`/doctor/appointments`}
                          className="btn btn-outline text-xs py-1 px-3"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Appointment stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Appointment Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-3 rounded-md text-center">
                  <p className="text-green-700 font-bold text-xl">{appointmentStats.completed}</p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-md text-center">
                  <p className="text-blue-700 font-bold text-xl">{appointmentStats.confirmed}</p>
                  <p className="text-sm text-blue-600">Confirmed</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-md text-center">
                  <p className="text-yellow-700 font-bold text-xl">{appointmentStats.pending}</p>
                  <p className="text-sm text-yellow-600">Pending</p>
                </div>
                <div className="bg-red-50 p-3 rounded-md text-center">
                  <p className="text-red-700 font-bold text-xl">{appointmentStats.cancelled}</p>
                  <p className="text-sm text-red-600">Cancelled</p>
                </div>
              </div>
              
              {/* Simple chart */}
              <div className="h-48 bg-gray-50 rounded-md p-4 flex items-end space-x-6 justify-around">
                <div className="flex flex-col items-center">
                  <div className="bg-green-500 w-12 rounded-t-md" style={{ height: `${(appointmentStats.completed / appointmentStats.total) * 100}%` }}></div>
                  <span className="text-xs mt-2">Completed</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 w-12 rounded-t-md" style={{ height: `${(appointmentStats.confirmed / appointmentStats.total) * 100}%` }}></div>
                  <span className="text-xs mt-2">Confirmed</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-yellow-500 w-12 rounded-t-md" style={{ height: `${(appointmentStats.pending / appointmentStats.total) * 100}%` }}></div>
                  <span className="text-xs mt-2">Pending</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-red-500 w-12 rounded-t-md" style={{ height: `${(appointmentStats.cancelled / appointmentStats.total) * 100}%` }}></div>
                  <span className="text-xs mt-2">Cancelled</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            {/* Earnings card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <DollarSign size={20} className="text-blue-600" />
                    </div>
                    <span className="font-medium">Today</span>
                  </div>
                  <span className="text-lg font-bold">₹{earnings.today.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <DollarSign size={20} className="text-green-600" />
                    </div>
                    <span className="font-medium">This Week</span>
                  </div>
                  <span className="text-lg font-bold">₹{earnings.thisWeek.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <DollarSign size={20} className="text-purple-600" />
                    </div>
                    <span className="font-medium">This Month</span>
                  </div>
                  <span className="text-lg font-bold">₹{earnings.thisMonth.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                      <DollarSign size={20} className="text-yellow-600" />
                    </div>
                    <span className="font-medium">Total</span>
                  </div>
                  <span className="text-lg font-bold">₹{earnings.total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Link 
                  to="/doctor/earnings" 
                  className="text-secondary hover:text-secondary-dark inline-flex items-center font-medium"
                >
                  View detailed report <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/doctor/appointments" 
                  className="flex flex-col items-center justify-center p-4 bg-secondary/5 hover:bg-secondary/10 rounded-lg transition-colors"
                >
                  <Calendar size={24} className="text-secondary mb-2" />
                  <span className="text-sm font-medium">All Appointments</span>
                </Link>
                <Link 
                  to="/doctor/profile" 
                  className="flex flex-col items-center justify-center p-4 bg-secondary/5 hover:bg-secondary/10 rounded-lg transition-colors"
                >
                  <Users size={24} className="text-secondary mb-2" />
                  <span className="text-sm font-medium">Update Profile</span>
                </Link>
                <Link 
                  to="/doctor/earnings" 
                  className="flex flex-col items-center justify-center p-4 bg-secondary/5 hover:bg-secondary/10 rounded-lg transition-colors"
                >
                  <LineChart size={24} className="text-secondary mb-2" />
                  <span className="text-sm font-medium">Earnings</span>
                </Link>
                <Link 
                  to="#" 
                  className="flex flex-col items-center justify-center p-4 bg-secondary/5 hover:bg-secondary/10 rounded-lg transition-colors"
                >
                  <UserPlus size={24} className="text-secondary mb-2" />
                  <span className="text-sm font-medium">Patient Records</span>
                </Link>
              </div>
            </div>
            
            {/* Latest patients */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Latest Patients</h2>
              <div className="space-y-3">
                {appointments
                  .filter((a, i, arr) => 
                    arr.findIndex(b => b.patientId === a.patientId) === i
                  )
                  .slice(0, 5)
                  .map((appointment) => (
                    <div 
                      key={appointment.patientId} 
                      className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                        {appointment.patient?.image ? (
                          <img 
                            src={appointment.patient.image} 
                            alt={appointment.patient.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users size={40} className="w-full h-full text-gray-500" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{appointment.patient?.name}</p>
                        <p className="text-sm text-gray-500">Last visit: {
                          new Date(
                            appointments
                              .filter(a => a.patientId === appointment.patientId)
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
                          ).toLocaleDateString()
                        }</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
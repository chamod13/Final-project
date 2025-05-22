import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  MapPin, 
  ArrowRight 
} from 'lucide-react';
import { appointmentService } from '../../services/api';
import { AppointmentType, DoctorType } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PatientDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentService.getPatientAppointments();
        setAppointments(response.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load your appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);
  
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
  
  // Get today's and upcoming appointments
  const todayAppointments = appointments.filter(
    appointment => {
      const today = new Date().toISOString().split('T')[0];
      return appointment.date === today;
    }
  );
  
  const upcomingAppointments = appointments.filter(
    appointment => {
      const today = new Date().toISOString().split('T')[0];
      return appointment.date > today && appointment.status !== 'cancelled';
    }
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <div className="fade-in">
      <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>
      
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
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white p-6">
              <h2 className="text-xl font-semibold mb-2">Welcome to MedBook!</h2>
              <p className="mb-4">
                Your one-stop platform for managing all your healthcare appointments.
              </p>
              <Link 
                to="/patient/book-appointment" 
                className="inline-flex items-center bg-white text-primary hover:bg-gray-100 transition-colors px-4 py-2 rounded-md font-medium text-sm"
              >
                Book an Appointment <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
            
            {/* Today's appointments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Today's Appointments</h2>
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
                  <Link 
                    to="/patient/book-appointment" 
                    className="inline-flex items-center text-primary hover:text-primary-dark mt-2"
                  >
                    Book an appointment <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                        <User size={20} className="text-primary" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            Dr. {appointment.doctor?.name}
                          </p>
                          <div className={`flex items-center px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1 capitalize">{appointment.status}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock size={14} className="mr-1" />
                          <span>
                            {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Upcoming appointments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                <Link 
                  to="/patient/appointments" 
                  className="text-primary hover:text-primary-dark text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No upcoming appointments scheduled.</p>
                  <Link 
                    to="/patient/book-appointment" 
                    className="inline-flex items-center text-primary hover:text-primary-dark mt-2"
                  >
                    Book an appointment <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                            {appointment.doctor?.image ? (
                              <img 
                                src={appointment.doctor.image} 
                                alt={appointment.doctor.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={40} className="w-full h-full text-gray-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{appointment.doctor?.name}</p>
                            <p className="text-sm text-gray-500">{appointment.doctor?.specialization}</p>
                          </div>
                        </div>
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-y-2 mt-3 text-sm">
                        <div className="flex items-center w-full md:w-1/2">
                          <Calendar size={16} className="text-gray-500 mr-2" />
                          <span>
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center w-full md:w-1/2">
                          <Clock size={16} className="text-gray-500 mr-2" />
                          <span>
                            {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                          </span>
                        </div>
                      </div>
                      
                      {appointment.paymentStatus === 'pending' && (
                        <div className="mt-3 flex justify-end">
                          <Link
                            to={`/patient/payment/${appointment.id}`}
                            className="btn btn-primary text-xs py-1 px-3"
                          >
                            Pay Now
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            {/* Quick actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/patient/book-appointment" 
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Calendar size={24} className="text-primary mb-2" />
                  <span className="text-sm font-medium">Book Appointment</span>
                </Link>
                <Link 
                  to="/patient/appointments" 
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Clock size={24} className="text-primary mb-2" />
                  <span className="text-sm font-medium">My Appointments</span>
                </Link>
                <Link 
                  to="/patient/profile" 
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <User size={24} className="text-primary mb-2" />
                  <span className="text-sm font-medium">My Profile</span>
                </Link>
                <a 
                  href="#" 
                  className="flex flex-col items-center justify-center p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <MapPin size={24} className="text-primary mb-2" />
                  <span className="text-sm font-medium">Find Clinics</span>
                </a>
              </div>
            </div>
            
            {/* Top doctors */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Top Doctors</h2>
              <div className="space-y-4">
                {[
                  {
                    id: 'doc1',
                    name: 'Dr. Sarah Johnson',
                    specialization: 'Cardiology',
                    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                    rating: 4.8
                  },
                  {
                    id: 'doc2',
                    name: 'Dr. Michael Chen',
                    specialization: 'Neurology',
                    image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                    rating: 4.9
                  },
                  {
                    id: 'doc3',
                    name: 'Dr. Rebecca Martinez',
                    specialization: 'Pediatrics',
                    image: 'https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                    rating: 4.7
                  }
                ].map((doctor) => (
                  <div key={doctor.id} className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className="font-medium">{doctor.name}</p>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm ml-1">{doctor.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{doctor.specialization}</p>
                    </div>
                  </div>
                ))}
                
                <Link 
                  to="/patient/book-appointment" 
                  className="block text-center text-primary hover:text-primary-dark text-sm font-medium"
                >
                  View all doctors
                </Link>
              </div>
            </div>
            
            {/* Health tips */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Health Tips</h2>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-md">
                  <p className="text-sm text-green-800">
                    Stay hydrated! Remember to drink at least 8 glasses of water daily.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    Regular exercise can help reduce stress and improve your mood.
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-md">
                  <p className="text-sm text-purple-800">
                    Aim for 7-8 hours of sleep each night for optimal health.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { appointments } from '../../services/mockData';
import { AppointmentType } from '../../types';
import { Calendar, Clock } from 'lucide-react';

const PatientAppointments = () => {
  const { user } = useAuth();
  const [userAppointments, setUserAppointments] = useState<AppointmentType[]>([]);

  useEffect(() => {
    // Filter appointments for the current patient
    const patientAppointments = appointments.filter(
      (appointment) => appointment.patientId === user?.id
    );
    setUserAppointments(patientAppointments);
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Appointments</h1>
      
      {userAppointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No appointments found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{appointment.date}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}</span>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900">Symptoms</h3>
                  <p className="text-gray-600">{appointment.symptom}</p>
                </div>
                
                {appointment.notes && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900">Doctor's Notes</h3>
                    <p className="text-gray-600">{appointment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
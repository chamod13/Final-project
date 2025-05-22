import { DoctorType, PatientType, AppointmentType, TimeSlotType } from '../types';

// Mock doctors data
export const doctors: DoctorType[] = [
  {
    id: 'doc1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1234567890',
    role: 'doctor',
    specialization: 'Cardiology',
    qualification: 'MD, FACC',
    experience: 8,
    bio: 'Specialist in heart diseases with 8 years of experience.',
    consultationFee: 2500,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-05-20T14:45:00Z'
  },
  {
    id: 'doc2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1987654321',
    role: 'doctor',
    specialization: 'Neurology',
    qualification: 'MD, PhD',
    experience: 12,
    bio: 'Experienced neurologist specializing in brain disorders.',
    consultationFee: 3000,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2022-11-05T09:20:00Z',
    updatedAt: '2023-06-12T11:30:00Z'
  },
  {
    id: 'doc3',
    name: 'Dr. Rebecca Martinez',
    email: 'rebecca.martinez@example.com',
    phone: '+1122334455',
    role: 'doctor',
    specialization: 'Pediatrics',
    qualification: 'MD, FAAP',
    experience: 6,
    bio: 'Caring pediatrician dedicated to children\'s health and wellbeing.',
    consultationFee: 2000,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-02-28T13:40:00Z',
    updatedAt: '2023-04-18T10:15:00Z'
  },
  {
    id: 'doc4',
    name: 'Dr. James Wilson',
    email: 'james.wilson@example.com',
    phone: '+1555666777',
    role: 'doctor',
    specialization: 'Orthopedics',
    qualification: 'MD, FAAOS',
    experience: 15,
    bio: 'Specialized in joint replacements and sports injuries.',
    consultationFee: 3500,
    rating: 4.6,
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2022-08-10T08:50:00Z',
    updatedAt: '2023-07-05T16:20:00Z'
  }
];

// Mock patients data
export const patients: PatientType[] = [
  {
    id: 'pat1',
    name: 'Emily Robinson',
    email: 'emily.robinson@example.com',
    phone: '+1222333444',
    role: 'patient',
    dateOfBirth: '1990-05-15',
    gender: 'female',
    address: '123 Main St, Boston, MA',
    createdAt: '2023-01-20T11:30:00Z',
    updatedAt: '2023-03-15T14:20:00Z'
  },
  {
    id: 'pat2',
    name: 'Daniel Kim',
    email: 'daniel.kim@example.com',
    phone: '+1333444555',
    role: 'patient',
    dateOfBirth: '1985-09-22',
    gender: 'male',
    address: '456 Oak Ave, San Francisco, CA',
    createdAt: '2022-12-10T09:45:00Z',
    updatedAt: '2023-02-28T13:10:00Z'
  },
  {
    id: 'pat3',
    name: 'Sophia Garcia',
    email: 'sophia.garcia@example.com',
    phone: '+1444555666',
    role: 'patient',
    dateOfBirth: '1998-03-30',
    gender: 'female',
    address: '789 Pine Rd, Miami, FL',
    createdAt: '2023-03-05T10:20:00Z',
    updatedAt: '2023-04-12T15:40:00Z'
  }
];

// Mock appointments data
export const appointments: AppointmentType[] = [
  {
    id: 'appt1',
    patientId: 'pat1',
    doctorId: 'doc1',
    date: '2023-10-15',
    timeSlot: { id: 'ts1', startTime: '09:00', endTime: '09:30', isAvailable: false },
    status: 'completed',
    symptom: 'Chest pain and shortness of breath',
    notes: 'Prescribed medication and follow-up in 2 weeks',
    paymentStatus: 'paid',
    paymentId: 'pay1',
    createdAt: '2023-10-01T10:30:00Z',
    updatedAt: '2023-10-15T10:00:00Z'
  },
  {
    id: 'appt2',
    patientId: 'pat2',
    doctorId: 'doc3',
    date: '2023-10-18',
    timeSlot: { id: 'ts2', startTime: '14:00', endTime: '14:30', isAvailable: false },
    status: 'confirmed',
    symptom: 'Recurring fever and cough',
    paymentStatus: 'paid',
    paymentId: 'pay2',
    createdAt: '2023-10-10T15:45:00Z',
    updatedAt: '2023-10-12T09:20:00Z'
  },
  {
    id: 'appt3',
    patientId: 'pat3',
    doctorId: 'doc2',
    date: '2023-10-20',
    timeSlot: { id: 'ts3', startTime: '11:30', endTime: '12:00', isAvailable: false },
    status: 'pending',
    symptom: 'Severe headaches and dizziness',
    paymentStatus: 'pending',
    createdAt: '2023-10-12T13:10:00Z',
    updatedAt: '2023-10-12T13:10:00Z'
  }
];

// Generate mock time slots for a doctor on a specific date
export const generateTimeSlots = (doctorId: string, date?: string): TimeSlotType[] => {
  const slots: TimeSlotType[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  
  // Check existing appointments for this doctor on this date to mark slots as unavailable
  const doctorAppointments = appointments.filter(a => 
    a.doctorId === doctorId && (!date || a.date === date)
  );
  
  const bookedTimes = doctorAppointments.map(a => a.timeSlot.startTime);
  
  // Generate slots every 30 minutes
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const endHourValue = minute === 30 ? hour + 1 : hour;
      const endMinuteValue = minute === 30 ? 0 : 30;
      const endTime = `${endHourValue.toString().padStart(2, '0')}:${endMinuteValue.toString().padStart(2, '0')}`;
      
      slots.push({
        id: `slot-${doctorId}-${startTime}`,
        startTime,
        endTime,
        isAvailable: !bookedTimes.includes(startTime)
      });
    }
  }
  
  return slots;
};

// Generate a mock JWT token
export const generateMockToken = (user: any): string => {
  // In a real app, this would be a JWT with proper encryption
  // For demo, we'll just create a simple string
  return `${user.id}.${Date.now()}.mockedToken`;
};
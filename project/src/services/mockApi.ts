import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { api } from './api';
import { 
  doctors, 
  patients,
  appointments,
  generateTimeSlots,
  generateMockToken
} from './mockData';

export const setupMockApi = () => {
  const mock = new MockAdapter(api, { delayResponse: 1000 });
  
  // Auth endpoints
  mock.onPost('/auth/login').reply((config) => {
    const { email, password, role } = JSON.parse(config.data);
    
    let user;
    if (role === 'patient') {
      user = patients.find(p => p.email === email);
    } else if (role === 'doctor') {
      user = doctors.find(d => d.email === email);
    } else if (role === 'admin') {
      user = { id: 'admin1', name: 'Admin User', email: 'admin@example.com', role: 'admin' };
    }
    
    if (user) {
      // In a real app, you would validate the password here
      const token = generateMockToken(user);
      return [200, { token, user }];
    }
    
    return [401, { message: 'Invalid credentials' }];
  });
  
  mock.onPost('/auth/register').reply((config) => {
    const userData = JSON.parse(config.data);
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (userData.role === 'patient') {
      patients.push(newUser);
    } else if (userData.role === 'doctor') {
      doctors.push(newUser);
    }
    
    const token = generateMockToken(newUser);
    return [201, { token, user: newUser }];
  });
  
  mock.onGet('/user/profile').reply((config) => {
    const token = config.headers?.Authorization?.split(' ')[1];
    
    if (!token) {
      return [401, { message: 'Unauthorized' }];
    }
    
    // In a real app, you would decode the token and validate it
    // Here, we'll just return a mock user
    const userId = token.split('.')[0]; // Simplified token handling
    
    let user = patients.find(p => p.id === userId);
    if (!user) {
      user = doctors.find(d => d.id === userId);
    }
    
    if (user) {
      return [200, user];
    }
    
    return [404, { message: 'User not found' }];
  });
  
  // Doctor endpoints
  mock.onGet('/doctors').reply(200, doctors);
  
  mock.onGet(/\/doctors\/(\w+)/).reply((config) => {
    const doctorId = config.url?.split('/').pop();
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (doctor) {
      return [200, doctor];
    }
    
    return [404, { message: 'Doctor not found' }];
  });
  
  mock.onGet(/\/doctors\/(\w+)\/slots/).reply((config) => {
    const doctorId = config.url?.split('/')[2];
    const slots = generateTimeSlots(doctorId);
    return [200, slots];
  });
  
  // Appointment endpoints
  mock.onGet('/appointments/available-slots').reply((config) => {
    const params = new URLSearchParams(config.url?.split('?')[1]);
    const doctorId = params.get('doctorId');
    const date = params.get('date');
    
    if (!doctorId || !date) {
      return [400, { message: 'Doctor ID and date are required' }];
    }
    
    const slots = generateTimeSlots(doctorId, date);
    return [200, slots];
  });
  
  mock.onPost('/appointments').reply((config) => {
    const appointmentData = JSON.parse(config.data);
    const newAppointment = {
      id: `appt-${Date.now()}`,
      ...appointmentData,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    return [201, newAppointment];
  });
  
  mock.onGet('/appointments/patient').reply((config) => {
    const token = config.headers?.Authorization?.split(' ')[1];
    
    if (!token) {
      return [401, { message: 'Unauthorized' }];
    }
    
    const userId = token.split('.')[0]; // Simplified token handling
    const patientAppointments = appointments.filter(a => a.patientId === userId);
    
    return [200, patientAppointments.map(appt => ({
      ...appt,
      doctor: doctors.find(d => d.id === appt.doctorId)
    }))];
  });
  
  mock.onGet('/appointments/doctor').reply((config) => {
    const token = config.headers?.Authorization?.split(' ')[1];
    
    if (!token) {
      return [401, { message: 'Unauthorized' }];
    }
    
    const userId = token.split('.')[0]; // Simplified token handling
    const doctorAppointments = appointments.filter(a => a.doctorId === userId);
    
    return [200, doctorAppointments.map(appt => ({
      ...appt,
      patient: patients.find(p => p.id === appt.patientId)
    }))];
  });
  
  // Payment endpoints
  mock.onPost('/payments/create-payment-intent').reply((config) => {
    const { appointmentId } = JSON.parse(config.data);
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
      return [404, { message: 'Appointment not found' }];
    }
    
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    const amount = doctor?.consultationFee || 2000; // Default to 2000 if not found
    
    return [200, {
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2, 10)}`,
      amount
    }];
  });
  
  mock.onPost('/payments/confirm').reply((config) => {
    const { paymentIntentId, appointmentId } = JSON.parse(config.data);
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
      return [404, { message: 'Appointment not found' }];
    }
    
    // Update appointment payment status
    appointment.paymentStatus = 'paid';
    appointment.paymentId = `pay_${Date.now()}`;
    
    return [200, { success: true, appointment }];
  });
  
  // Admin endpoints
  mock.onGet('/admin/doctors').reply(200, doctors);
  
  mock.onGet('/admin/patients').reply(200, patients);
  
  mock.onGet('/admin/dashboard-stats').reply(200, {
    totalDoctors: doctors.length,
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    todayAppointments: appointments.filter(a => {
      const today = new Date().toISOString().split('T')[0];
      return a.date === today;
    }).length,
    totalRevenue: appointments
      .filter(a => a.paymentStatus === 'paid')
      .reduce((sum, a) => {
        const doctor = doctors.find(d => d.id === a.doctorId);
        return sum + (doctor?.consultationFee || 0);
      }, 0)
  });
  
  // Doctor earnings
  mock.onGet('/doctors/earnings').reply((config) => {
    const token = config.headers?.Authorization?.split(' ')[1];
    
    if (!token) {
      return [401, { message: 'Unauthorized' }];
    }
    
    const userId = token.split('.')[0]; // Simplified token handling
    const doctorAppointments = appointments.filter(a => a.doctorId === userId && a.paymentStatus === 'paid');
    
    const doctor = doctors.find(d => d.id === userId);
    const fee = doctor?.consultationFee || 0;
    
    const earnings = {
      today: doctorAppointments.filter(a => {
        const today = new Date().toISOString().split('T')[0];
        return a.date === today;
      }).length * fee,
      thisWeek: doctorAppointments.filter(a => {
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const appointmentDate = new Date(a.date);
        return appointmentDate >= weekStart;
      }).length * fee,
      thisMonth: doctorAppointments.filter(a => {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const appointmentDate = new Date(a.date);
        return appointmentDate >= monthStart;
      }).length * fee,
      total: doctorAppointments.length * fee,
    };
    
    return [200, earnings];
  });
};
import axios from 'axios';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: '/api', // This would typically be your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to set auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// For demo purposes, we'll mock API responses
// In a real application, remove this and connect to an actual backend
if (import.meta.env.DEV) {
  // Mock implementation for development
  import('./mockApi').then(({ setupMockApi }) => {
    setupMockApi();
  });
}

// API service functions
export const authService = {
  login: (email: string, password: string, role: string) => 
    api.post('/auth/login', { email, password, role }),
  
  register: (userData: any) => 
    api.post('/auth/register', userData),
  
  getProfile: () => 
    api.get('/user/profile'),
  
  updateProfile: (userData: any) => 
    api.put('/user/profile', userData),
};

export const appointmentService = {
  getAvailableSlots: (doctorId: string, date: string) => 
    api.get(`/appointments/available-slots?doctorId=${doctorId}&date=${date}`),
  
  bookAppointment: (appointmentData: any) => 
    api.post('/appointments', appointmentData),
  
  getPatientAppointments: () => 
    api.get('/appointments/patient'),
  
  getDoctorAppointments: () => 
    api.get('/appointments/doctor'),
  
  updateAppointmentStatus: (appointmentId: string, status: string) => 
    api.put(`/appointments/${appointmentId}/status`, { status }),
  
  cancelAppointment: (appointmentId: string) => 
    api.delete(`/appointments/${appointmentId}`),
};

export const doctorService = {
  getDoctors: (specialization?: string) => 
    api.get(`/doctors${specialization ? `?specialization=${specialization}` : ''}`),
  
  getDoctorById: (doctorId: string) => 
    api.get(`/doctors/${doctorId}`),
  
  getDoctorSlots: (doctorId: string) => 
    api.get(`/doctors/${doctorId}/slots`),
  
  updateDoctorProfile: (doctorData: any) => 
    api.put('/doctors/profile', doctorData),
  
  updateAvailability: (slots: any[]) => 
    api.put('/doctors/availability', { slots }),
  
  getDoctorEarnings: () => 
    api.get('/doctors/earnings'),
};

export const paymentService = {
  createPaymentIntent: (appointmentId: string) => 
    api.post('/payments/create-payment-intent', { appointmentId }),
  
  confirmPayment: (paymentIntentId: string, appointmentId: string) => 
    api.post('/payments/confirm', { paymentIntentId, appointmentId }),
  
  getPaymentHistory: () => 
    api.get('/payments/history'),
};

export const adminService = {
  getAllDoctors: () => 
    api.get('/admin/doctors'),
  
  getAllPatients: () => 
    api.get('/admin/patients'),
  
  createDoctor: (doctorData: any) => 
    api.post('/admin/doctors', doctorData),
  
  updateDoctor: (doctorId: string, doctorData: any) => 
    api.put(`/admin/doctors/${doctorId}`, doctorData),
  
  deleteDoctor: (doctorId: string) => 
    api.delete(`/admin/doctors/${doctorId}`),
  
  getDashboardStats: () => 
    api.get('/admin/dashboard-stats'),
};
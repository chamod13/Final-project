// User types
export type UserType = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'admin';
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export type PatientType = UserType & {
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  medicalHistory?: string[];
};

export type DoctorType = UserType & {
  specialization: string;
  qualification: string;
  experience: number;
  bio?: string;
  consultationFee: number;
  availableSlots?: TimeSlotType[];
  rating?: number;
  reviews?: ReviewType[];
};

// Appointment types
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type AppointmentType = {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeSlot: TimeSlotType;
  status: AppointmentStatus;
  symptom?: string;
  notes?: string;
  paymentStatus: 'pending' | 'paid';
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  patient?: PatientType;
  doctor?: DoctorType;
};

// Time slot type
export type TimeSlotType = {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

// Payment type
export type PaymentType = {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'debit_card' | 'net_banking' | 'upi';
  status: 'pending' | 'successful' | 'failed';
  transactionId?: string;
  createdAt: string;
};

// Review type
export type ReviewType = {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  patient?: PatientType;
};

// Notification type
export type NotificationType = {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};
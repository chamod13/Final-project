import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { 
  Calendar,
  Clock,
  Search,
  DollarSign,
  Star,
  MapPin,
  Phone,
  Mail,
  User,
  Stethoscope,
  Filter,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { doctorService, appointmentService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { DoctorType, TimeSlotType } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

type FormData = {
  doctorId: string;
  date: string;
  timeSlotId: string;
  symptom: string;
};

const BookAppointment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorType | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlotType[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotType | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('All');
  
  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>();
  
  // Selected values for the appointment
  const selectedDate = watch('date');
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorService.getDoctors();
        setDoctors(response.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);
  
  // Filter doctors based on search and specialization filter
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || doctor.specialization === filter;
    return matchesSearch && matchesFilter;
  });
  
  // Get all unique specializations for the filter dropdown
  const specializations = ['All', ...new Set(doctors.map(doctor => doctor.specialization))];
  
  // Generate an array of the next 30 days for the date selection
  const getDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const dates = getDates();
  
  // Fetch available slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchAvailableSlots = async () => {
        setLoadingSlots(true);
        try {
          const response = await appointmentService.getAvailableSlots(selectedDoctor.id, selectedDate);
          setAvailableSlots(response.data.filter(slot => slot.isAvailable));
        } catch (err) {
          console.error('Error fetching available slots:', err);
          setError('Failed to load available time slots. Please try again later.');
        } finally {
          setLoadingSlots(false);
        }
      };
      
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);
  
  // Handle doctor selection
  const handleDoctorSelect = (doctor: DoctorType) => {
    setSelectedDoctor(doctor);
    setValue('doctorId', doctor.id);
    setStep(2);
  };
  
  // Handle date selection
  const handleDateSelect = (date: string) => {
    setValue('date', date);
    setSelectedSlot(null);
    setValue('timeSlotId', '');
  };
  
  // Handle time slot selection
  const handleSlotSelect = (slot: TimeSlotType) => {
    setSelectedSlot(slot);
    setValue('timeSlotId', slot.id);
  };
  
  // Go back to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Go to next step
  const handleNext = () => {
    if (step < 4) {
      // Validate current step
      if (step === 1 && !selectedDoctor) {
        setError('Please select a doctor');
        return;
      }
      
      if (step === 2 && !selectedDate) {
        setError('Please select a date');
        return;
      }
      
      if (step === 3 && !selectedSlot) {
        setError('Please select a time slot');
        return;
      }
      
      setStep(step + 1);
      setError(null);
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      const appointmentData = {
        doctorId: data.doctorId,
        patientId: user?.id,
        date: data.date,
        timeSlot: selectedSlot,
        symptom: data.symptom,
        status: 'pending',
        paymentStatus: 'pending'
      };
      
      const response = await appointmentService.bookAppointment(appointmentData);
      
      // Navigate to payment page if appointment is created successfully
      navigate(`/patient/payment/${response.data.id}`);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError('Failed to book appointment. Please try again later.');
    }
  };
  
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Book an Appointment</h1>
        
        {/* Step indicator */}
        <div className="hidden md:flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <div className={`w-8 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <div className={`w-8 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
            3
          </div>
          <div className={`w-8 h-1 ${step >= 4 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
            4
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow-sm rounded-lg p-6">
          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="form-input pl-10"
                    placeholder="Search doctors by name or specialization"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="relative md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter size={18} className="text-gray-400" />
                  </div>
                  <select
                    className="form-input pl-10"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    {specializations.map((specialization) => (
                      <option key={specialization} value={specialization}>{specialization}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="large" />
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-12">
                  <Stethoscope size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No doctors found matching your search criteria.</p>
                  <p className="text-gray-500 mt-1">Try adjusting your search or filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredDoctors.map((doctor) => (
                    <div 
                      key={doctor.id}
                      className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${
                        selectedDoctor?.id === doctor.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                      }`}
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3 h-48 md:h-auto relative">
                          <img 
                            src={doctor.image || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} 
                            alt={doctor.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-medium">
                            {doctor.specialization}
                          </div>
                        </div>
                        <div className="p-4 md:w-2/3">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold">{doctor.name}</h3>
                            <div className="flex items-center text-yellow-500">
                              <Star size={16} className="fill-current" />
                              <span className="ml-1 text-sm">{doctor.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {doctor.qualification} • {doctor.experience} years exp.
                          </p>
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                            {doctor.bio || 'Experienced healthcare professional dedicated to providing quality patient care.'}
                          </p>
                          <div className="flex items-center text-primary font-medium">
                            <DollarSign size={16} />
                            <span>₹{doctor.consultationFee} Consultation Fee</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Step 2: Select Date */}
          {step === 2 && selectedDoctor && (
            <div>
              <div className="flex items-center mb-6">
                <button 
                  type="button" 
                  className="text-gray-600 hover:text-gray-900 mr-3"
                  onClick={handleBack}
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-semibold">Select Appointment Date</h2>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-3">
                  <User size={20} className="text-primary mr-2" />
                  <h3 className="font-medium">{selectedDoctor.name}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <Stethoscope size={16} className="text-gray-500 mr-2" />
                    <span>{selectedDoctor.specialization}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-gray-500 mr-2" />
                    <span>₹{selectedDoctor.consultationFee} Consultation Fee</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Select a Date</h3>
                
                <div className="flex overflow-x-auto space-x-3 pb-2">
                  {dates.map((date, index) => {
                    const dateString = date.toISOString().split('T')[0];
                    const isToday = index === 0;
                    const isTomorrow = index === 1;
                    const isSelected = dateString === selectedDate;
                    
                    return (
                      <div 
                        key={dateString}
                        className={`flex-shrink-0 w-20 h-24 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                          isSelected ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => handleDateSelect(dateString)}
                      >
                        <p className="text-xs font-medium">
                          {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {date.getDate()}
                        </p>
                        <p className="text-xs">
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="hidden">
                <Controller
                  name="date"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Please select a date' }}
                  render={({ field }) => (
                    <input type="hidden" {...field} />
                  )}
                />
                
                <Controller
                  name="doctorId"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Please select a doctor' }}
                  render={({ field }) => (
                    <input type="hidden" {...field} />
                  )}
                />
              </div>
            </div>
          )}
          
          {/* Step 3: Select Time Slot */}
          {step === 3 && selectedDoctor && selectedDate && (
            <div>
              <div className="flex items-center mb-6">
                <button 
                  type="button" 
                  className="text-gray-600 hover:text-gray-900 mr-3"
                  onClick={handleBack}
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-semibold">Select Appointment Time</h2>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center">
                    <User size={20} className="text-primary mr-2" />
                    <h3 className="font-medium">{selectedDoctor.name}</h3>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={20} className="text-primary mr-2" />
                    <span>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Available Time Slots</h3>
                
                {loadingSlots ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="medium" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock size={40} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No available slots for this date.</p>
                    <p className="text-gray-500 mt-1">Please select a different date.</p>
                    <button
                      type="button"
                      className="mt-3 text-primary hover:text-primary-dark font-medium"
                      onClick={handleBack}
                    >
                      Go back to select another date
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {availableSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-3 rounded-md text-center cursor-pointer transition-colors ${
                          selectedSlot?.id === slot.id
                            ? 'bg-primary text-white'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => handleSlotSelect(slot)}
                      >
                        <p className={`font-medium ${selectedSlot?.id === slot.id ? 'text-white' : 'text-gray-900'}`}>
                          {slot.startTime}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="hidden">
                <Controller
                  name="timeSlotId"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Please select a time slot' }}
                  render={({ field }) => (
                    <input type="hidden" {...field} />
                  )}
                />
              </div>
            </div>
          )}
          
          {/* Step 4: Confirm Details */}
          {step === 4 && selectedDoctor && selectedDate && selectedSlot && (
            <div>
              <div className="flex items-center mb-6">
                <button 
                  type="button" 
                  className="text-gray-600 hover:text-gray-900 mr-3"
                  onClick={handleBack}
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-semibold">Confirm Appointment Details</h2>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    <img 
                      src={selectedDoctor.image || "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} 
                      alt={selectedDoctor.name} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-semibold mb-2">{selectedDoctor.name}</h3>
                    <p className="text-gray-600 mb-4">{selectedDoctor.specialization} • {selectedDoctor.qualification}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start">
                        <Calendar size={18} className="text-primary mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Date</p>
                          <p>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock size={18} className="text-primary mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Time</p>
                          <p>{selectedSlot.startTime} - {selectedSlot.endTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <DollarSign size={18} className="text-primary mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Consultation Fee</p>
                          <p>₹{selectedDoctor.consultationFee}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin size={18} className="text-primary mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p>Online Consultation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="symptom" className="form-label">
                  Describe Your Symptoms (Optional)
                </label>
                <textarea
                  id="symptom"
                  className="form-input min-h-[100px]"
                  placeholder="Please describe your symptoms or reason for the appointment"
                  {...register('symptom')}
                ></textarea>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md mb-6 flex items-start">
                <Info size={20} className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 font-medium">Important Information</p>
                  <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
                    <li>Please arrive 10 minutes before your scheduled appointment time.</li>
                    <li>Bring any relevant medical records or test results.</li>
                    <li>You can cancel or reschedule your appointment up to 6 hours before the scheduled time.</li>
                    <li>Payment is required to confirm your appointment.</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h3 className="text-lg font-medium mb-3">Payment Summary</h3>
                <div className="flex justify-between mb-2">
                  <span>Consultation Fee</span>
                  <span>₹{selectedDoctor.consultationFee}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Booking Fee</span>
                  <span>₹0</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>₹{selectedDoctor.consultationFee}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleBack}
              >
                Back
              </button>
            )}
            
            {step < 4 ? (
              <button
                type="button"
                className="btn btn-primary ml-auto"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary ml-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Proceed to Payment'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
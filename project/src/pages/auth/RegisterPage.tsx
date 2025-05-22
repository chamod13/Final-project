import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'patient' | 'doctor';
  specialization?: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
};

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor'>('patient');
  
  const password = watch('password');
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    // Prepare user data based on role
    const userData = selectedRole === 'patient' 
      ? {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: 'patient'
        }
      : {
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: 'doctor',
          specialization: data.specialization,
          qualification: data.qualification,
          experience: data.experience,
          consultationFee: data.consultationFee
        };
    
    try {
      await registerUser(userData, data.role);
      
      // Redirect based on role
      if (data.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (data.role === 'doctor') {
        navigate('/doctor/dashboard');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="py-8 px-6 md:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
              <p className="mt-2 text-gray-600">
                Join MedBook and experience streamlined healthcare appointments.
              </p>
            </div>
            
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-md p-1 bg-gray-100">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedRole === 'patient'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedRole('patient')}
                >
                  I'm a Patient
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedRole === 'doctor'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedRole('doctor')}
                >
                  I'm a Doctor
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter your full name"
                    {...register('name', { 
                      required: 'Full name is required' 
                    })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="Enter your phone number"
                    {...register('phone', { 
                      required: 'Phone number is required' 
                    })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="role" className="form-label">
                    Register as
                  </label>
                  <select
                    id="role"
                    className={`form-input ${errors.role ? 'border-red-500' : ''}`}
                    {...register('role', { required: 'Role is required' })}
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as 'patient' | 'doctor')}
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>
              </div>
              
              {/* Doctor-specific fields */}
              {selectedRole === 'doctor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                  <div>
                    <label htmlFor="specialization" className="form-label">
                      Specialization
                    </label>
                    <select
                      id="specialization"
                      className={`form-input ${errors.specialization ? 'border-red-500' : ''}`}
                      {...register('specialization', { 
                        required: selectedRole === 'doctor' ? 'Specialization is required' : false 
                      })}
                    >
                      <option value="">Select Specialization</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Gynecology">Gynecology</option>
                      <option value="Ophthalmology">Ophthalmology</option>
                      <option value="Dentistry">Dentistry</option>
                      <option value="GeneralPractice">General Practice</option>
                    </select>
                    {errors.specialization && (
                      <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="qualification" className="form-label">
                      Qualification
                    </label>
                    <input
                      id="qualification"
                      type="text"
                      className={`form-input ${errors.qualification ? 'border-red-500' : ''}`}
                      placeholder="e.g., MD, MBBS, PhD"
                      {...register('qualification', { 
                        required: selectedRole === 'doctor' ? 'Qualification is required' : false 
                      })}
                    />
                    {errors.qualification && (
                      <p className="mt-1 text-sm text-red-600">{errors.qualification.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="form-label">
                      Years of Experience
                    </label>
                    <input
                      id="experience"
                      type="number"
                      min="0"
                      className={`form-input ${errors.experience ? 'border-red-500' : ''}`}
                      {...register('experience', { 
                        required: selectedRole === 'doctor' ? 'Experience is required' : false,
                        min: {
                          value: 0,
                          message: 'Experience cannot be negative'
                        }
                      })}
                    />
                    {errors.experience && (
                      <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="consultationFee" className="form-label">
                      Consultation Fee (₹)
                    </label>
                    <input
                      id="consultationFee"
                      type="number"
                      min="0"
                      step="100"
                      className={`form-input ${errors.consultationFee ? 'border-red-500' : ''}`}
                      placeholder="e.g., 1000"
                      {...register('consultationFee', { 
                        required: selectedRole === 'doctor' ? 'Consultation fee is required' : false,
                        min: {
                          value: 0,
                          message: 'Consultation fee cannot be negative'
                        }
                      })}
                    />
                    {errors.consultationFee && (
                      <p className="mt-1 text-sm text-red-600">{errors.consultationFee.message}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Password fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="Create a password"
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        }
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="text-gray-500" />
                      ) : (
                        <Eye size={20} className="text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm your password"
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:text-primary-dark">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:text-primary-dark">
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary py-3"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>
            
            <p className="text-center mt-8 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  CheckCircle, 
  User, 
  Calendar, 
  Clock, 
  DollarSign, 
  Shield,
  X,
  AlertCircle
} from 'lucide-react';
import { appointmentService, paymentService } from '../../services/api';
import { AppointmentType, DoctorType } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

type PaymentMethod = 'credit_card' | 'debit_card' | 'net_banking' | 'upi';

const PaymentPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  
  const [appointment, setAppointment] = useState<AppointmentType | null>(null);
  const [doctor, setDoctor] = useState<DoctorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!appointmentId) return;
      
      try {
        // In a real app, you would fetch the appointment details
        // For demo, we'll use mock data
        const response = await appointmentService.getPatientAppointments();
        const appointment = response.data.find(appt => appt.id === appointmentId);
        
        if (!appointment) {
          setError('Appointment not found. Please try again later.');
          return;
        }
        
        setAppointment(appointment);
        setDoctor(appointment.doctor || null);
      } catch (err) {
        console.error('Error fetching appointment details:', err);
        setError('Failed to load appointment details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointmentDetails();
  }, [appointmentId]);
  
  const handlePayment = async () => {
    if (!appointment || !doctor) return;
    
    // Validate form fields
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        setError('Please fill in all card details');
        return;
      }
      
      // Basic validations
      if (cardNumber.length < 15) {
        setError('Invalid card number');
        return;
      }
      
      if (expiryDate.length !== 5 || !expiryDate.includes('/')) {
        setError('Invalid expiry date (MM/YY)');
        return;
      }
      
      if (cvv.length < 3) {
        setError('Invalid CVV');
        return;
      }
    }
    
    setProcessingPayment(true);
    setError(null);
    
    try {
      // Create payment intent
      const paymentResponse = await paymentService.createPaymentIntent(appointment.id);
      
      // Mock payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Confirm payment
      await paymentService.confirmPayment(paymentResponse.data.clientSecret, appointment.id);
      
      // Update state to show success
      setPaymentSuccess(true);
    } catch (err) {
      console.error('Payment failed:', err);
      setError('Payment failed. Please try again or use a different payment method.');
    } finally {
      setProcessingPayment(false);
    }
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    } else {
      return v;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace('/', '');
    setExpiryDate(formatExpiryDate(value));
  };
  
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };
  
  return (
    <div className="fade-in">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      ) : paymentSuccess ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been confirmed. Thank you for booking with MedBook.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">{doctor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(appointment?.date || '').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {appointment?.timeSlot.startTime} - {appointment?.timeSlot.endTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">₹{doctor?.consultationFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-xs">{appointment?.paymentId || 'PAY-XXXX-XXXX'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="btn btn-outline"
              onClick={() => navigate('/patient/appointments')}
            >
              View My Appointments
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/patient/dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
              
              <div className="space-y-3">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'credit_card' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('credit_card')}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      paymentMethod === 'credit_card' ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'credit_card' && (
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <span className="font-medium">Credit Card</span>
                    <div className="ml-auto flex space-x-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" alt="Visa" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" className="h-6" />
                    </div>
                  </div>
                </div>
                
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'debit_card' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('debit_card')}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      paymentMethod === 'debit_card' ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'debit_card' && (
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <span className="font-medium">Debit Card</span>
                    <div className="ml-auto flex space-x-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" alt="Visa" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Rupay-Logo.png/800px-Rupay-Logo.png" alt="RuPay" className="h-6" />
                    </div>
                  </div>
                </div>
                
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'net_banking' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('net_banking')}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      paymentMethod === 'net_banking' ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'net_banking' && (
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <span className="font-medium">Net Banking</span>
                  </div>
                </div>
                
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'upi' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      paymentMethod === 'upi' ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'upi' && (
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <span className="font-medium">UPI</span>
                    <div className="ml-auto flex space-x-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png" alt="Google Pay" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Card Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="form-label">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        id="cardNumber"
                        type="text"
                        className="form-input pl-10"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <CreditCard size={18} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="cardName" className="form-label">
                      Cardholder Name
                    </label>
                    <input
                      id="cardName"
                      type="text"
                      className="form-input"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="form-label">
                        Expiry Date
                      </label>
                      <input
                        id="expiryDate"
                        type="text"
                        className="form-input"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        maxLength={5}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="form-label">
                        CVV
                      </label>
                      <input
                        id="cvv"
                        type="text"
                        className="form-input"
                        placeholder="123"
                        value={cvv}
                        onChange={handleCvvChange}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === 'net_banking' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Net Banking</h3>
                
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                  {['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB', 'Kotak', 'BOB', 'Yes Bank'].map((bank) => (
                    <div key={bank} className="border rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">
                      <p className="font-medium">{bank}</p>
                    </div>
                  ))}
                </div>
                
                <div>
                  <label htmlFor="otherBank" className="form-label">
                    Other Banks
                  </label>
                  <select id="otherBank" className="form-input">
                    <option value="">Select Bank</option>
                    <option value="canara">Canara Bank</option>
                    <option value="union">Union Bank</option>
                    <option value="idbi">IDBI Bank</option>
                    <option value="indian">Indian Bank</option>
                  </select>
                </div>
              </div>
            )}
            
            {paymentMethod === 'upi' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">UPI Payment</h3>
                
                <div>
                  <label htmlFor="upiId" className="form-label">
                    UPI ID
                  </label>
                  <input
                    id="upiId"
                    type="text"
                    className="form-input"
                    placeholder="yourname@upi"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter your UPI ID (e.g., mobilenumber@upi, username@bank)
                  </p>
                </div>
                
                <div className="mt-6">
                  <p className="font-medium mb-3">Or pay using</p>
                  <div className="grid grid-cols-4 gap-3">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                      <div key={app} className="border rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50">
                        <p className="text-sm">{app}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Appointment Summary</h2>
              
              {doctor && appointment && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-500 mr-2" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-500 mr-2" />
                      <span>
                        {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                    <h3 className="font-medium mb-3">Payment Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consultation Fee</span>
                        <span>₹{doctor.consultationFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Fee</span>
                        <span>₹0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>₹0</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                        <span>Total Amount</span>
                        <span>₹{doctor.consultationFee}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    <Shield size={16} className="text-green-600 mr-2" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                  
                  <button
                    type="button"
                    className="btn btn-primary w-full py-3"
                    onClick={handlePayment}
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </span>
                    ) : `Pay ₹${doctor.consultationFee}`}
                  </button>
                  
                  <p className="text-center text-sm text-gray-500">
                    By clicking "Pay", you agree to our Terms and Conditions
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
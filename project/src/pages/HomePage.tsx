import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, CreditCard, Clock, Star, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Healthcare Appointments
              <span className="block">Made Simple</span>
            </h1>
            <p className="text-xl mb-8 md:pr-10 text-white/90">
              Book appointments with top doctors, manage your healthcare, and pay online—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md font-medium text-base">
                Get Started
              </Link>
              <Link to="/login" className="btn border border-white text-white hover:bg-white/10 px-8 py-3 rounded-md font-medium text-base">
                Login
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <img 
              src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Doctor consultation" 
              className="rounded-lg shadow-xl max-w-full lg:max-w-md h-auto object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform simplifies the entire healthcare appointment process from finding the right doctor to payment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                <Search className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Doctors</h3>
              <p className="text-gray-600">
                Search for doctors by specialization, ratings, and availability to find the perfect match.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                <Calendar className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Book Appointment</h3>
              <p className="text-gray-600">
                Select your preferred time slot and book your appointment in just a few clicks.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                <CreditCard className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Online Payment</h3>
              <p className="text-gray-600">
                Securely pay for your consultation online and avoid any hassle at the clinic.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                <Clock className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Reminder</h3>
              <p className="text-gray-600">
                Receive timely notifications and never miss your scheduled appointments.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Doctor Showcase Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Top Doctors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with experienced healthcare professionals across various specialties.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Doctor 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
              <img 
                src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Dr. Sarah Johnson" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    Cardiology
                  </span>
                  <div className="flex items-center ml-auto">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-gray-700 ml-1">4.8</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Dr. Sarah Johnson</h3>
                <p className="text-gray-600 mb-4">
                  Specialist in heart diseases with 8 years of experience.
                </p>
                <Link 
                  to="/patient/book-appointment" 
                  className="text-primary font-medium flex items-center hover:text-primary-dark"
                >
                  Book Appointment <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Doctor 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
              <img 
                src="https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Dr. Michael Chen" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    Neurology
                  </span>
                  <div className="flex items-center ml-auto">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-gray-700 ml-1">4.9</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Dr. Michael Chen</h3>
                <p className="text-gray-600 mb-4">
                  Experienced neurologist specializing in brain disorders.
                </p>
                <Link 
                  to="/patient/book-appointment" 
                  className="text-primary font-medium flex items-center hover:text-primary-dark"
                >
                  Book Appointment <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Doctor 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
              <img 
                src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Dr. James Wilson" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    Orthopedics
                  </span>
                  <div className="flex items-center ml-auto">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-gray-700 ml-1">4.6</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Dr. James Wilson</h3>
                <p className="text-gray-600 mb-4">
                  Specialized in joint replacements and sports injuries.
                </p>
                <Link 
                  to="/patient/book-appointment" 
                  className="text-primary font-medium flex items-center hover:text-primary-dark"
                >
                  Book Appointment <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/patient/book-appointment" 
              className="btn btn-primary px-8 py-3 rounded-md font-medium text-base"
            >
              View All Doctors
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover how MedBook has transformed the healthcare experience for patients and doctors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={18} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "Booking appointments with MedBook has been a breeze. I love how I can see all available slots and choose what works for me. The reminders are super helpful too!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Emily R." 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Emily R.</h4>
                  <p className="text-gray-500 text-sm">Patient</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={18} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "As a doctor, MedBook has revolutionized how I manage my practice. The scheduling system is intuitive, and I can track all my appointments and earnings in one place."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Dr. Michael C." 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Dr. Michael C.</h4>
                  <p className="text-gray-500 text-sm">Neurologist</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={18} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "The online payment feature is a game-changer. No more waiting at the reception to settle bills. Everything is seamless and professional with MedBook!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Sophia G." 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Sophia G.</h4>
                  <p className="text-gray-500 text-sm">Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-white/90 text-xl max-w-2xl mx-auto mb-8">
            Join MedBook today and experience the future of healthcare appointments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md font-medium text-base"
            >
              Sign Up Now
            </Link>
            <Link 
              to="/login" 
              className="btn border border-white text-white hover:bg-white/10 px-8 py-3 rounded-md font-medium text-base"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
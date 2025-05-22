import React from 'react';
import { UserCircle, Mail, Phone, MapPin, Clock, Award, Edit } from 'lucide-react';

const DoctorProfile = () => {
  // This would typically fetch the doctor's data from your backend
  const doctorData = {
    name: "Dr. Sarah Wilson",
    specialization: "Cardiologist",
    email: "sarah.wilson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Medical Center Drive, Suite 100",
    experience: "15 years",
    education: "MD - Cardiology, Stanford University",
    availability: "Mon-Fri: 9:00 AM - 5:00 PM"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UserCircle className="w-20 h-20 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">{doctorData.name}</h1>
                <p className="text-blue-100">{doctorData.specialization}</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span>{doctorData.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-5 h-5" />
                  <span>{doctorData.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{doctorData.address}</span>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Details</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Award className="w-5 h-5" />
                  <span>{doctorData.experience} of Experience</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Award className="w-5 h-5" />
                  <span>{doctorData.education}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{doctorData.availability}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  // Check if user is on a dashboard page (requires sidebar)
  const isDashboardPage = 
    isAuthenticated && 
    (location.pathname.includes('/patient/') || 
     location.pathname.includes('/doctor/') || 
     location.pathname.includes('/admin/'));
  
  // Get appropriate sidebar items based on user role
  const getSidebarItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'patient':
        return [
          { title: 'Dashboard', href: '/patient/dashboard', icon: 'LayoutDashboard' },
          { title: 'Book Appointment', href: '/patient/book-appointment', icon: 'Calendar' },
          { title: 'My Appointments', href: '/patient/appointments', icon: 'ClipboardList' },
          { title: 'My Profile', href: '/patient/profile', icon: 'User' }
        ];
      case 'doctor':
        return [
          { title: 'Dashboard', href: '/doctor/dashboard', icon: 'LayoutDashboard' },
          { title: 'Appointments', href: '/doctor/appointments', icon: 'Calendar' },
          { title: 'My Earnings', href: '/doctor/earnings', icon: 'DollarSign' },
          { title: 'My Profile', href: '/doctor/profile', icon: 'User' }
        ];
      case 'admin':
        return [
          { title: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
          { title: 'Manage Doctors', href: '/admin/doctors', icon: 'Users' },
          { title: 'Manage Patients', href: '/admin/patients', icon: 'Users' }
        ];
      default:
        return [];
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        {isDashboardPage && (
          <Sidebar items={getSidebarItems()} />
        )}
        
        <main className={`flex-1 ${isDashboardPage ? 'pt-16 md:pt-0 md:pl-64' : 'pt-16'}`}>
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;
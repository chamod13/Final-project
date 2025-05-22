import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  User, 
  DollarSign, 
  Users, 
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarItem {
  title: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = React.useState(true);
  
  // Function to render the appropriate icon
  const renderIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'LayoutDashboard':
        return <LayoutDashboard size={size} />;
      case 'Calendar':
        return <Calendar size={size} />;
      case 'ClipboardList':
        return <ClipboardList size={size} />;
      case 'User':
        return <User size={size} />;
      case 'DollarSign':
        return <DollarSign size={size} />;
      case 'Users':
        return <Users size={size} />;
      default:
        return <LayoutDashboard size={size} />;
    }
  };
  
  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        className="fixed bottom-4 right-4 md:hidden z-20 bg-primary text-white p-3 rounded-full shadow-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu size={24} />
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-md transition-all duration-300 z-10
          ${collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
          w-64
        `}
      >
        <div className="h-full flex flex-col">
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <ul className="space-y-1">
              {items.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => 
                      isActive ? 'nav-link nav-link-active' : 'nav-link'
                    }
                    onClick={() => setCollapsed(true)}
                  >
                    {renderIcon(item.icon)}
                    <span>{item.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <button 
              onClick={logout}
              className="nav-link text-red-600 hover:bg-red-50 hover:text-red-700 w-full justify-center"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setCollapsed(true)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
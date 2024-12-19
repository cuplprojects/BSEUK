import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { useThemeStore } from '../store/themeStore';
import { useState } from 'react';

function Layout() {
  const theme = useThemeStore((state) => state.theme);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-blue-900'}`}>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-30 md:z-0`}>
        <Sidebar 
          onClose={() => setIsMobileMenuOpen(false)} 
          isMobile={window.innerWidth < 768}
          isCollapsed={isCollapsed}
          onCollapse={setIsCollapsed}
        />
      </div>
      
      {/* Main Content */}
      <div className={`flex flex-col flex-1 w-full md:w-[calc(100%-${isCollapsed ? '4.5rem' : '16rem'})]`}>
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} className="" />
        <main className={`flex-1 overflow-auto p-4 md:p-6 ${
          theme === 'dark' 
            ? '' 
            : 'bg-white'
        }`}>
          <div className="container mx-auto">
            <Breadcrumb />
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;

import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

// Routes that should not show the navbar
const noNavbarRoutes = ['/login', '/signin', '/dashboard'];

export default function Layout({ children }) {
  const location = useLocation();
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white">
      {showNavbar && <Navbar />}
      <main className={`${showNavbar ? 'pt-16 sm:pt-20' : ''}`}>
        {children}
      </main>
    </div>
  );
} 
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Features', to: '/#features' },
  { name: 'Pricing', to: '/#pricing' },
  { name: 'FAQ', to: '/#faq' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        const closeButton = document.querySelector('[aria-label="Close menu"]');
        if (closeButton) {
          closeButton.click();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    // Close menu on scroll
    const handleScrollClose = () => {
      const closeButton = document.querySelector('[aria-label="Close menu"]');
      if (closeButton) {
        closeButton.click();
      }
    };

    window.addEventListener('scroll', handleScrollClose);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScrollClose);
    };
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/' && sectionId.startsWith('/#')) {
      window.location.href = sectionId;
      return;
    }

    // If we're already on home page and it's a section link
    if (sectionId.startsWith('/#')) {
      const element = document.getElementById(sectionId.substring(2));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Disclosure as="nav" className="fixed w-full z-[100] top-0">
      {({ open, close }) => (
        <>
          {/* Solid overlay when mobile menu is open */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[90] sm:hidden"
                onClick={() => close()}
              />
            )}
          </AnimatePresence>

          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`${
              isScrolled || open
                ? 'bg-white shadow-lg'
                : 'bg-transparent'
            } transition-all duration-200`}
          >
            <div className="container mx-auto px-4">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/">
                      <motion.span
                        className="text-2xl font-bold text-primary-600 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        PromoGenieAI
                      </motion.span>
                    </Link>
                  </div>
                  
                  {/* Desktop navigation */}
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <motion.a
                        key={item.name}
                        href={item.to}
                        onClick={(e) => scrollToSection(e, item.to)}
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.name}
                      </motion.a>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="hidden sm:flex sm:items-center sm:space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        to="/login"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                      >
                        Login
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        to="/signin"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </div>
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center sm:hidden">
                  <Disclosure.Button 
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                    aria-label={open ? "Close menu" : "Open menu"}
                  >
                    <motion.div
                      initial={false}
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </motion.div>
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile menu panel */}
            <Disclosure.Panel className="sm:hidden" ref={menuRef}>
              <motion.div
                initial={{ 
                  opacity: 0, 
                  y: -20,
                  borderRadius: "0px"
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  borderRadius: "0px 0px 20px 20px"
                }}
                exit={{ 
                  opacity: 0, 
                  y: -20,
                  borderRadius: "0px"
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className="absolute w-full bg-white shadow-lg z-[95] overflow-hidden"
              >
                <div className="space-y-1 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.to}
                      onClick={(e) => {
                        scrollToSection(e, item.to);
                        close();
                      }}
                      className="block py-3 px-4 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                  <div className="px-4 py-3 space-y-2 border-t border-gray-100">
                    <Link 
                      to="/login"
                      onClick={() => close()}
                      className="block w-full px-4 py-2 text-center border border-transparent text-sm font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signin"
                      onClick={() => close()}
                      className="block w-full px-4 py-2 text-center border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </motion.div>
            </Disclosure.Panel>
          </motion.div>
        </>
      )}
    </Disclosure>
  );
} 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '#' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  return (
    <Disclosure as="nav" className="fixed w-full z-50">
      {({ open }) => (
        <>
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`${
              isScrolled
                ? 'bg-white/80 backdrop-blur-lg shadow-lg'
                : 'bg-transparent'
            } transition-all duration-200`}
          >
            <div className="container">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-shrink-0 items-center">
                    <motion.a
                      href="#"
                      className="text-2xl font-bold text-primary-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      PromoGenieAI
                    </motion.a>
                  </div>
                  
                  {/* Desktop navigation */}
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.name}
                      </motion.a>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="hidden sm:flex sm:items-center sm:space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-secondary"
                    >
                      Login
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                    >
                      Sign Up
                    </motion.button>
                  </div>
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile menu panel */}
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block py-2 px-4 text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                <div className="px-4 py-3 space-y-2">
                  <button className="w-full btn-secondary">Login</button>
                  <button className="w-full btn-primary">Sign Up</button>
                </div>
              </div>
            </Disclosure.Panel>
          </motion.div>
        </>
      )}
    </Disclosure>
  );
} 
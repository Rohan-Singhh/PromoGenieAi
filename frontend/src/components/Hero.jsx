import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3
    }
  }
};

const companyLogos = [
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    width: "w-24 sm:w-32"
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    width: "w-20 sm:w-28"
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    width: "w-24 sm:w-32"
  },
  {
    name: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    width: "w-20 sm:w-24"
  }
];

export default function Hero() {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center pt-16 sm:pt-0">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 animate-gradient" />
      
      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-4 -right-4 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-8 -left-8 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800"
            variants={itemVariants}
          >
            AI-Powered Ads in Seconds
          </motion.h1>
          
          <motion.p
            className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Type an idea, let AI create scripts & videos. No influencers, no hassle.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <motion.button
              className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signin')}
            >
              Try for Free
            </motion.button>
            <motion.button
              className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDemoModal(true)}
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="mt-12 sm:mt-16"
            variants={itemVariants}
          >
            <p className="text-sm font-medium text-gray-600 mb-6 sm:mb-8">Trusted by innovative brands worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
              {companyLogos.map((company, index) => (
                <motion.img
                  key={index}
                  src={company.logo}
                  alt={company.name}
                  className={`${company.width} h-6 sm:h-8 object-contain opacity-60 hover:opacity-100 transition-opacity`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowDemoModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 relative"
              >
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="text-center">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-16 h-16 mx-auto mb-6 border-4 border-primary-600 border-t-transparent rounded-full"
                  />
                  <h3 className="text-xl sm:text-2xl font-bold mb-4">Demo Coming Soon!</h3>
                  <p className="text-gray-600 mb-6">
                    Our team is currently working on an exciting demo video to showcase our AI-powered ad generation capabilities. Stay tuned!
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
                      <span>Research and Development in Progress</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDemoModal(false)}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 
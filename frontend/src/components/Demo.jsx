import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import demoVideo from '../assets/demo_compressed.mp4';

const demoScripts = [
  "Drive more sales with our new collection 🛍️",
  "Experience luxury at its finest ✨",
  "Transform your space with our design tips 🏠",
  "Get fit with our 30-day challenge 💪",
  "Discover the taste of authentic cuisine 🍜",
  "Level up your skincare routine ✨",
  "Master social media marketing 📱",
  "Boost your productivity today 🚀",
  "Learn a new language in weeks 🗣️",
  "Start your wellness journey now 🧘‍♀️"
];

export default function Demo() {
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScripts, setGeneratedScripts] = useState([]);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3, // When 30% of the video is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      });
    }, options);

    if (videoContainerRef.current) {
      observer.observe(videoContainerRef.current);
    }

    return () => {
      if (videoContainerRef.current) {
        observer.unobserve(videoContainerRef.current);
      }
    };
  }, []);

  const handleGenerate = () => {
    if (!inputValue) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation with a delay
    setTimeout(() => {
      setGeneratedScripts(demoScripts);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <section id="demo" className="section bg-gray-50 px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            See the Magic Happen
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Type your product or service idea below and watch AI transform it into
            engaging ad scripts in seconds.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g., 'Promote our new coffee shop'"
                className="w-full flex-1 px-4 py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              />
              <motion.button
                onClick={handleGenerate}
                disabled={isGenerating || !inputValue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all text-sm sm:text-base ${
                  isGenerating || !inputValue ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? 'Generating...' : 'Generate Scripts'}
              </motion.button>
            </div>

            {/* Generated Scripts */}
            <div className="mt-6 sm:mt-8">
              {isGenerating ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 sm:h-24 bg-gray-100 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : generatedScripts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {generatedScripts.map((script, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer text-sm sm:text-base"
                    >
                      {script}
                    </motion.div>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>

          {/* Video Demo */}
          <motion.div
            ref={videoContainerRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="aspect-video bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl"
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              muted
              loop
              poster="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop"
            >
              <source src={demoVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 
import { useState } from 'react';
import { motion } from 'framer-motion';

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
    <section id="demo" className="section bg-gray-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading">See the Magic Happen</h2>
          <p className="subheading">
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
            className="bg-white rounded-2xl shadow-xl p-6 mb-12"
          >
            <div className="flex gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g., 'Promote our new coffee shop'"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              />
              <motion.button
                onClick={handleGenerate}
                disabled={isGenerating || !inputValue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`btn-primary whitespace-nowrap ${
                  isGenerating || !inputValue ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? 'Generating...' : 'Generate Scripts'}
              </motion.button>
            </div>

            {/* Generated Scripts */}
            <div className="mt-8">
              {isGenerating ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-24 bg-gray-100 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : generatedScripts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {generatedScripts.map((script, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="w-full h-full flex items-center justify-center text-white">
              <p className="text-lg">Demo Video Placeholder</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 
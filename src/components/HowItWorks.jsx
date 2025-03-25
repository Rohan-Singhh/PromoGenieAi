import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  VideoCameraIcon, 
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const steps = [
  {
    icon: DocumentTextIcon,
    title: "Write Your Idea",
    description: "Simply type your video concept or requirements into our AI-powered platform. No technical skills needed."
  },
  {
    icon: SparklesIcon,
    title: "AI Script Generation",
    description: "Our AI analyzes your input and generates an engaging script optimized for your target audience."
  },
  {
    icon: VideoCameraIcon,
    title: "Video Creation",
    description: "Watch as our AI transforms your script into a professional video with visuals, voiceover, and music."
  },
  {
    icon: ArrowPathIcon,
    title: "Customize & Export",
    description: "Fine-tune your video with our intuitive editor, then export in your preferred format and quality."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading">How PromoGenieAI Works</h2>
          <p className="subheading">
            Create professional videos in minutes with our simple 4-step process
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <step.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 transform -translate-y-1/2">
                    <div className="absolute right-0 top-0 w-4 h-4 bg-primary-500 rounded-full transform -translate-y-1/2 translate-x-1/2" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try It Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 
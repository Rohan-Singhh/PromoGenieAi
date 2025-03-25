import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  VideoCameraIcon,
  RocketLaunchIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: DocumentTextIcon,
    title: 'Automated Script Writing',
    description:
      'Transform your ideas into compelling ad scripts using advanced AI technology.',
  },
  {
    icon: VideoCameraIcon,
    title: 'AI-Powered Video Generation',
    description:
      'Convert scripts into professional-quality videos with just a few clicks.',
  },
  {
    icon: RocketLaunchIcon,
    title: 'Faster & Cheaper Than Agencies',
    description:
      'Save time and money while getting better results than traditional agencies.',
  },
  {
    icon: CogIcon,
    title: 'Customizable Ad Options',
    description:
      'Fine-tune your ads with customizable options for tone, style, and format.',
  },
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

export default function Features() {
  return (
    <section id="features" className="section bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading">Why PromoGenieAI?</h2>
          <p className="subheading">
            Revolutionize your ad creation process with our cutting-edge AI
            technology.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative p-6 rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '10x', label: 'Faster Creation' },
            { value: '80%', label: 'Cost Savings' },
            { value: '1000+', label: 'Happy Users' },
            { value: '24/7', label: 'AI Availability' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-primary-50"
            >
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 
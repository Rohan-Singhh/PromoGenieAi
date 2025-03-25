import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    question: "How does PromoGenieAI work?",
    answer: "PromoGenieAI uses advanced AI technology to generate engaging video scripts and create professional videos from your text input. Simply type your idea or requirements, and our AI will handle the rest - from scriptwriting to video generation."
  },
  {
    question: "What types of videos can I create?",
    answer: "You can create various types of videos including product promotions, social media ads, explainer videos, brand stories, and more. Our AI is versatile and can adapt to different styles and formats based on your needs."
  },
  {
    question: "How long does it take to generate a video?",
    answer: "Most videos are generated within minutes. The exact time depends on the complexity and length of the video, but typically you can expect your first draft within 5-10 minutes."
  },
  {
    question: "Can I customize the generated videos?",
    answer: "Yes! You can customize various aspects including voice selection, background music, visual style, and more. Our platform provides intuitive editing tools to make your videos perfect."
  },
  {
    question: "What video quality do you offer?",
    answer: "We offer multiple quality options from standard (720p) to high definition (1080p) and even 4K for enterprise plans. The quality you can access depends on your subscription tier."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service. No questions asked."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We provide comprehensive support including email, chat, and phone support (for enterprise plans). Our support team is available 24/7 to help you with any questions or issues."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section bg-gray-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading">Frequently Asked Questions</h2>
          <p className="subheading">
            Find answers to common questions about PromoGenieAI
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-lg font-medium text-gray-900 text-left">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-white rounded-b-lg">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </motion.div>
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
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 
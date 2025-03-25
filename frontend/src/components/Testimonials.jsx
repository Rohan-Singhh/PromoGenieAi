import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "TechFlow Solutions",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    review: "PromoGenieAI has revolutionized our ad creation process. We've cut our production time by 80% while maintaining high-quality content.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Digital Marketing Manager",
    company: "GrowthLabs",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    review: "The AI-generated scripts are incredibly engaging. Our conversion rates have increased by 40% since we started using PromoGenieAI.",
    rating: 5
  },
  {
    name: "Emma Thompson",
    role: "Content Strategist",
    company: "Creative Minds Co.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    review: "The video generation feature is a game-changer. We can now create professional ads in minutes instead of days.",
    rating: 5
  }
];

const companyLogos = [
  {
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Adobe_InDesign_CC_icon.svg",
    width: "w-24"
  },
  {
    name: "Salesforce",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    width: "w-32"
  },
  {
    name: "HubSpot",
    logo: "https://logos-marcas.com/wp-content/uploads/2022/01/HubSpot-Simbolo.jpg",
    width: "w-28"
  },
  {
    name: "Slack",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
    width: "w-24"
  },
  {
    name: "Dropbox",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg",
    width: "w-24"
  },
  {
    name: "Zoom",
    logo: "https://logowik.com/content/uploads/images/zoom-app2328.logowik.com.webp",
    width: "w-24"
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

export default function Testimonials() {
  return (
    <section className="section bg-gray-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading">Trusted by Innovative Brands</h2>
          <p className="subheading">
            See what our clients have to say about their experience with PromoGenieAI
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-600 italic">"{testimonial.review}"</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <p className="text-center text-sm font-medium text-gray-600 mb-8">
            Trusted by leading brands worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {companyLogos.map((company, index) => (
              <motion.img
                key={index}
                src={company.logo}
                alt={company.name}
                className={`${company.width} h-8 object-contain opacity-60 hover:opacity-100 transition-opacity`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
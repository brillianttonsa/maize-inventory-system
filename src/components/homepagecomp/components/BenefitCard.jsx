import { motion } from "framer-motion";
import { fadeIn } from "../../animations/Animations";

export const BenefitCard = ({ icon, title, description, stat, statLabel }) => {
  return (
    <motion.div
      className=" bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
      variants={fadeIn}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold text-green-400 mb-2">{stat}</div>
      <div className="text-sm text-yellow-600 mb-4">{statLabel}</div>
      <h3 className="text-xl font-bold mb-3 text-yellow-900 ">{title}</h3>
      <p className="text-gray-900">{description}</p>
    </motion.div>
  );
};

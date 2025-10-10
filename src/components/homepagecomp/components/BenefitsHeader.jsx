import { motion } from "framer-motion";

export const BenefitsHeader = () => {
  return (
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
        Measurable Business Benefits
      </h2>
      <p className="text-lg text-yellow-900 max-w-3xl mx-auto">
        MaizeTrack delivers tangible results that directly impact your bottom line. Here's what our customers
        typically achieve.
      </p>
    </motion.div>
  );
};

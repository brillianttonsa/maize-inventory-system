import { motion } from "framer-motion";
import { BenefitCard } from "./components/BenefitCard";
import { BenefitsHeader } from "./components/BenefitsHeader";
import { benefits } from "./Features";
import { staggerContainer } from "../animations/Animations";

export const BenefitsSection = () => {

  return (
    <section className="py-20 bg-gray-50">
      
      <div className="container mx-auto px-4">
        
        <BenefitsHeader />
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 "
          variants={staggerContainer}
          initial="hidden"
          animate="visible" 
        >
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

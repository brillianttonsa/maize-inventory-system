import { motion } from "framer-motion";
import { WhatMaizefeatures } from "./Features";
import { fadeIn } from "../animations/Animations";

export default function WhatIsMaizeTrack() {
  return (
    <section className="relative overflow-hidden sm:py-24 py-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/50 to-yellow-400/50 z-10"></div>

      <div className="relative z-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-900">
            What is MaizeTrack?
          </h2>
          <p className="text-lg text-yellow-800 mb-8 leading-relaxed">
            MaizeTrack is an enterprise-grade business management system specifically designed for maize processing
            companies. Whether you're a small family business or a large industrial operation, MaizeTrack provides the
            tools you need to streamline operations, reduce costs, and increase profitability.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {WhatMaizefeatures.map((feature) => (
              <motion.div
                key={feature.id}
                className="text-center"
                variants={fadeIn}
                transition={{ delay: feature.delay }}
              >
                <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-900">{feature.title}</h3>
                <p className="text-yellow-800">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

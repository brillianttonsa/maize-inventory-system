import { FeaturesHome } from "./Features"
import {motion} from "framer-motion"

export const FeatureSection = () => {
    return (
        <section className="py-16 container mx-auto px-4">
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                    Comprehensive Features for Modern Businesses
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    MaizeTrackAI provides everything you need to run a successful maize processing business, from basic inventory
                    management to advanced AI-powered analytics and forecasting.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
                {FeaturesHome.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center mb-4">
                            {feature.icon}
                        </div>

                        <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
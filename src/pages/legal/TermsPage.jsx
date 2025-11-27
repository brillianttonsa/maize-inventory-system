import Navbar from "../../components/common/Navbar"
import { Footer } from "../../components/common/Footer"

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border-t-4 border-yellow-500 transition-colors">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Terms of Service</h1>
            <div className="flex flex-col sm:flex-row sm:gap-8 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong className="text-gray-900 dark:text-gray-100">Effective Date:</strong> January 1, 2024
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100">Platform Name:</strong> MaizeTrackAI
              </p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors">
            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600 dark:text-yellow-500">1. Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                MaizeTrackAI is a cloud-based software that helps businesses track maize inventory, manage production,
                monitor resources, and generate reports. These Terms govern your access to and use of the platform.
              </p>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600 dark:text-yellow-500">
                2. User Responsibilities
              </h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
                <li className="pl-2">You agree to provide accurate information when registering.</li>
                <li className="pl-2">
                  You are responsible for maintaining the confidentiality of your account credentials.
                </li>
                <li className="pl-2">You must not use the platform for illegal or unauthorized purposes.</li>
              </ul>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600 dark:text-yellow-500">3. Data and Content</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
                <li className="pl-2">You retain ownership of the data you upload to MaizeTrackAI.</li>
                <li className="pl-2">
                  By using our platform, you grant us the right to store and process your data to provide the service.
                </li>
                <li className="pl-2">We do not sell or share your business data with third parties.</li>
              </ul>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600 dark:text-yellow-500">
                4. Service Availability
              </h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
                <li className="pl-2">We aim for 99.9% uptime, but we do not guarantee uninterrupted access.</li>
                <li className="pl-2">
                  We may update, pause, or modify features at any time for improvements or maintenance.
                </li>
              </ul>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600 dark:text-yellow-500">
                5. Billing and Payments
              </h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
                <li className="pl-2">
                  Subscription and billing terms (if applicable) will be provided during sign-up.
                </li>
                <li className="pl-2">Failure to make payment may result in account suspension.</li>
              </ul>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600 dark:text-yellow-500">6. Termination</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
                <li className="pl-2">You may delete your account at any time.</li>
                <li className="pl-2">We may suspend or terminate accounts that violate these Terms.</li>
              </ul>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600 dark:text-yellow-500">
                7. Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                MaizeTrackAI is provided "as is." We are not liable for losses, damages, or disruptions caused by
                software issues, outages, or third-party failures.
              </p>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600 dark:text-yellow-500">8. Changes to Terms</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update these Terms from time to time. Continued use of the platform means you accept the revised
                terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600 dark:text-yellow-500">9. Contact</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                For questions about these Terms, contact us at:
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-yellow-600 dark:text-yellow-500">Email:</strong>{" "}
                <a
                  href="mailto:abdullatifmnyamis@gmail.com"
                  className="text-yellow-600 dark:text-yellow-400 hover:underline"
                >
                  abdullatifmnyamis@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

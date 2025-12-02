import Navbar from "../../components/common/Navbar"
import { Footer } from "../../components/common/Footer"

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 transition-colors">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-t-4 border-yellow-500 transition-colors">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Privacy Policy</h1>
            <div className="flex flex-col sm:flex-row sm:gap-8 text-sm text-gray-600">
              <p>
                <strong className="text-gray-900">Effective Date:</strong> December 2, 2025
              </p>
              <p>
                <strong className="text-gray-900">Platform Name:</strong> MaizeTrack AI
              </p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="bg-white rounded-lg shadow-lg p-8 transition-colors">
            <section className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600">
                1. Information We Collect
              </h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                <li className="pl-2">Account information (name, email, business name)</li>
                <li className="pl-2">Business data you submit (e.g., inventory, production logs)</li>
                <li className="pl-2">Device/browser information for analytics</li>
              </ul>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600">
                2. How We Use Your Data
              </h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                <li className="pl-2">Provide and improve our services</li>
                <li className="pl-2">Generate reports and forecasts</li>
                <li className="pl-2">Send service-related emails or alerts</li>
                <li className="pl-2">Ensure system security and performance</li>
              </ul>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600">3. Data Sharing</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                <li className="pl-2">
                  We do <strong className="text-gray-900">not</strong> sell your data to third
                  parties.
                </li>
                <li className="pl-2">
                  We may share data with service providers (e.g., hosting, SMS) strictly to operate the platform.
                </li>
              </ul>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600">4. Data Security</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                <li className="pl-2">Industry-standard encryption and secure hosting</li>
                <li className="pl-2">You are responsible for keeping your login credentials safe</li>
              </ul>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600">5. Your Rights</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                <li className="pl-2">Access, update, or delete your data from your dashboard</li>
                <li className="pl-2">Request data deletion by contacting us</li>
              </ul>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600">6. Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                We may use cookies to remember your preferences and improve user experience.
              </p>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600">
                7. Updates to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this policy and notify you via email or platform notifications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-yellow-600 dark:text-yellow-500">8. Contact</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                For privacy concerns, contact us at:
              </p>
              <p className="text-gray-700">
                <strong className="text-yellow-600">Email:</strong>{" "}
                <a
                  href="mailto:abdullatifmnyamis@gmail.com"
                  className="text-yellow-600 hover:underline"
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

export default PrivacyPolicy

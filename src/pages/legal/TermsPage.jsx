export default function TermsPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-2"><strong>Effective Date:</strong> [Insert Date]</p>
      <p className="mb-6"><strong>Platform Name:</strong> MaizeTrackAI</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Overview</h2>
        <p>
          MaizeTrackAI is a cloud-based software that helps businesses track maize inventory, manage production,
          monitor resources, and generate reports. These Terms govern your access to and use of the platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You agree to provide accurate information when registering.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You must not use the platform for illegal or unauthorized purposes.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Data and Content</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You retain ownership of the data you upload to MaizeTrackAI.</li>
          <li>
            By using our platform, you grant us the right to store and process your data to provide the service.
          </li>
          <li>We do not sell or share your business data with third parties.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Service Availability</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>We aim for 99.9% uptime, but we do not guarantee uninterrupted access.</li>
          <li>
            We may update, pause, or modify features at any time for improvements or maintenance.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Billing and Payments</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Subscription and billing terms (if applicable) will be provided during sign-up.</li>
          <li>Failure to make payment may result in account suspension.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Termination</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You may delete your account at any time.</li>
          <li>We may suspend or terminate accounts that violate these Terms.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
        <p>
          MaizeTrackAI is provided “as is.” We are not liable for losses, damages, or disruptions caused by software issues,
          outages, or third-party failures.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the platform means you accept the revised terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">9. Contact</h2>
        <p>For questions about these Terms, contact us at:</p>
        <p>📧 [your-email@example.com]</p>
      </section>
    </div>
  )
}

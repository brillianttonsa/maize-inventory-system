const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-2 font-medium">Effective Date: <span className="font-normal">[Insert Date]</span></p>
      <p className="mb-6 font-medium">Platform Name: <span className="font-normal">MaizeTrackAI</span></p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Account information (name, email, business name)</li>
          <li>Business data you submit (e.g., inventory, production logs)</li>
          <li>Device/browser information for analytics</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Data</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide and improve our services</li>
          <li>Generate reports and forecasts</li>
          <li>Send service-related emails or alerts</li>
          <li>Ensure system security and performance</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>We do <strong>not</strong> sell your data to third parties.</li>
          <li>We may share data with service providers (e.g., hosting, SMS) strictly to operate the platform.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Industry-standard encryption and secure hosting</li>
          <li>You are responsible for keeping your login credentials safe</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Access, update, or delete your data from your dashboard</li>
          <li>Request data deletion by contacting us</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Cookies</h2>
        <p>We may use cookies to remember your preferences and improve user experience.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Updates to This Policy</h2>
        <p>We may update this policy and notify you via email or platform notifications.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
        <p>For privacy concerns, contact us at: 📧 <span className="underline">[your-email@example.com]</span></p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

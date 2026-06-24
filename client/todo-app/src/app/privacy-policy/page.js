import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto max-w-m mt-12">
      <div className="text-center mb-6">
        <h1 className="mb-4">Taskwave</h1>
        <h2>Privacy Policy</h2>
      </div>
      <div className="flex justify-center">
        <div className="w-1/2 border border-gray-300 rounded p-6 space-y-4 text-sm text-gray-700">

          <section className="text-xs text-gray-400 border-b border-gray-200 pb-3">
            <p>
              This privacy policy was drafted with the assistance of{" "}
              <a href="https://app-privacy-policy-generator.nisrulz.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
                App Privacy Policy Generator
              </a>{" "}
              and <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Claude</a> (Anthropic).
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-1">Overview</h3>
            <p>
              Taskwave is a task management app. This policy describes what data we collect,
              how we use it, and your rights regarding that data.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-1">Data We Collect</h3>
            <p>
              If you create an account, we collect your email address, a hashed (encrypted)
              version of your password, and the tasks you create. We never store your password
              in plain text.
            </p>
            <p className="mt-2">
              If you use the app without an account, all data is stored locally on your device
              only and is never sent to our servers.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-1">How We Use Your Data</h3>
            <p>
              Your data is used solely to provide the app's functionality — storing and
              retrieving your tasks. We do not sell, share, or use your data for advertising
              or analytics.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-1">Data Storage</h3>
            <p>
              Account data is stored on secured servers. Local-only data remains on your
              device and is removed when the app is uninstalled.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-1">Third Party Services</h3>
            <p>
              Taskwave is distributed through Google Play, which may collect certain device
              and usage information in accordance with its own privacy policy. We do not use
              any additional third-party analytics or advertising SDKs.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <a href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Google Play Services Privacy Policy
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-1">Opt-Out Rights</h3>
            <p>
              You can stop all data collection by uninstalling the app. Note that uninstalling
              does not automatically delete account data already stored on our servers — use
              the{" "}
              <Link href="/delete-account" className="text-red-600 underline">
                Delete Account
              </Link>{" "}
              page to remove that data before uninstalling.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-1">Data Retention</h3>
            <p>
              Account data (email, password hash, and tasks) is retained for as long as your
              account exists. Upon account deletion, all data is permanently removed from our
              servers immediately. Anonymized or aggregated data not linked to any individual
              may be retained indefinitely.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-1">Security</h3>
            <p>
              Passwords are never stored in plain text — they are hashed before storage.
              Account data is held on secured servers. While we take reasonable precautions
              to protect your information, no method of transmission or storage is 100% secure.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-1">Children</h3>
            <p>
              Taskwave is not directed at children under 13 years of age. We do not knowingly
              collect personal information from children under 13. If you believe a child has
              provided us with personal information, contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-1">Changes to This Policy</h3>
            <p>
              We may update this privacy policy from time to time. Any changes will be posted
              on this page with an updated effective date. Continued use of the app after
              changes are posted constitutes your acceptance of the updated policy.
            </p>
            <p className="mt-2">This policy is effective as of 2026-06-18.</p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-900 mb-1">Contact</h3>
            <p>
              If you have any questions about this policy, contact us at{" "}
              <a href="mailto:commontsuw@gmail.com" className="text-blue-600 underline">
                commontsuw@gmail.com
              </a>
              .
            </p>
          </section>

        </div>

      </div>
      <div className="flex justify-center mt-4">
        <Link className="text-gray-600 hover:text-gray-700 underline text-sm p-2" href={"/"}>
          Back to Login
        </Link>
      </div>
    </main>
  );
}

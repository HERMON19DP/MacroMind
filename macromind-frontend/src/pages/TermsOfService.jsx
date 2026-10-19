import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { usePageDescription } from "../hooks/usePageDescription";

const sections = [
  {
    title: "1. Acceptance of These Terms",
    paragraphs: [
      "These Terms of Service govern your access to and use of MacroMind. By using the service, you agree to these terms and applicable laws. If you do not agree, do not use the service.",
    ],
  },
  {
    title: "2. About MacroMind",
    paragraphs: [
      "MacroMind is a nutrition-tracking application that helps users record meals, review nutrition information, monitor goals, and use AI-assisted meal analysis. Features may change as the application develops.",
    ],
  },
  {
    title: "3. Accounts and Account Information",
    paragraphs: [
      "You are responsible for providing accurate information when registering and for maintaining the confidentiality of your login credentials. You should promptly take appropriate steps if you believe your account has been accessed without authorization.",
      "You must not impersonate another person, misuse another user’s account, or provide information you are not authorized to submit.",
    ],
  },
  {
    title: "4. AI and Nutrition Information",
    paragraphs: [
      "AI-generated meal analysis and nutrition values are estimates. Results may be incomplete, inaccurate, or unsuitable for your individual needs. Food quantities, preparation methods, ingredients, and available reference data can affect the results.",
      "MacroMind is not a medical service and does not provide a diagnosis or personalized medical treatment. Do not rely solely on its estimates for medical decisions, treatment of a health condition, or management of a medically prescribed diet. Consult a qualified healthcare professional when appropriate.",
    ],
  },
  {
    title: "5. Acceptable Use",
    paragraphs: [
      "You agree not to use MacroMind for unlawful purposes, attempt to gain unauthorized access to systems or accounts, interfere with the service, distribute malicious code, or abuse features in ways that may harm other users or the service.",
      "You must not attempt to bypass security controls or use the service in violation of applicable laws.",
    ],
  },
  {
    title: "6. Your Content",
    paragraphs: [
      "You remain responsible for the information, meal entries, text, screenshots, and other content you submit. You must have the rights and permissions needed to submit that content.",
      "You authorize MacroMind to process submitted content as reasonably necessary to provide the features you request, including meal analysis and bug-report handling, subject to the Privacy Policy.",
    ],
  },
  {
    title: "7. Third-Party Services",
    paragraphs: [
      "Some features rely on third-party services, including Google Gemini for AI-assisted meal analysis. Their services may be subject to separate terms, availability limits, and privacy practices. MacroMind does not control every aspect of third-party services.",
    ],
  },
  {
    title: "8. Availability and Changes",
    paragraphs: [
      "We may modify, suspend, or discontinue features as the application evolves. We aim to keep the service useful, but we do not guarantee uninterrupted availability, error-free operation, or permanent availability of any feature.",
    ],
  },
  {
    title: "9. Disclaimer",
    paragraphs: [
      "To the extent permitted by applicable law, MacroMind is provided on an “as is” and “as available” basis. We do not guarantee the accuracy or completeness of nutrition data, AI outputs, or other information provided through the service.",
      "Nothing in these terms excludes a right or remedy that cannot lawfully be excluded under applicable law.",
    ],
  },
  {
    title: "10. Limitation of Liability",
    paragraphs: [
      "To the extent permitted by applicable law, MacroMind and its operators will not be liable for indirect, incidental, special, consequential, or punitive losses arising from use of the service. This section does not exclude liability where such exclusion is prohibited by law.",
    ],
  },
  {
    title: "11. Suspension or Termination",
    paragraphs: [
      "Access may be restricted or suspended where reasonably necessary to protect the service, users, or comply with legal obligations. If you stop using MacroMind, stored account data may not be automatically deleted. The current service does not provide an in-app account deletion feature.",
    ],
  },
  {
    title: "12. Changes to These Terms",
    paragraphs: [
      "We may update these terms as MacroMind changes. Updated terms will be posted on this page with a revised date. Where required by law, we will provide notice or obtain consent for material changes.",
    ],
  },
];

export default function TermsOfService() {
  usePageTitle("Terms of Service");
  usePageDescription(
    "Read the terms for using MacroMind, including AI nutrition estimates, acceptable use, accounts, and service limitations.",
  );

  return (
    <main className="min-h-screen bg-white px-5 py-12 text-gray-900 sm:py-16">
      <article className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to MacroMind
        </Link>

        <header className="mt-8 border-b border-gray-100 pb-8">
          <p className="text-sm font-medium text-emerald-700">
            MACROMIND · LEGAL
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: October 19, 2026
          </p>
          <p className="mt-5 leading-7 text-gray-600">
            These terms explain the conditions for using MacroMind and its
            nutrition-tracking and AI-assisted features.
          </p>
        </header>

        <div className="divide-y divide-gray-100">
          {sections.map((section) => (
            <section key={section.title} className="py-7">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-7 text-gray-600">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section className="py-7">
            <h2 className="text-lg font-semibold">13. Contact</h2>
            <p className="mt-3 leading-7 text-gray-600">
              For questions about these terms, contact the MacroMind team using
              its designated contact method. Add a monitored contact address
              before publishing this page.
            </p>
          </section>
        </div>

        <footer className="mt-6 border-t border-gray-100 pt-6 text-sm text-gray-500">
          Read our{" "}
          <Link
            to="/privacy"
            className="font-medium text-emerald-700 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </footer>
      </article>
    </main>
  );
}

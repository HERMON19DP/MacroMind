import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { usePageDescription } from "../hooks/usePageDescription";

const sections = [
  {
    title: "1. Information We Collect",
    paragraphs: [
      "Depending on the features you use, MacroMind may process account and profile details, nutrition goals, meal entries, food quantities, and information you submit while using the application.",
      "If you submit a bug report, the information you provide may include a description of the issue and any screenshots or attachments you choose to upload.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    paragraphs: [
      "We use information to operate your account, display nutrition records and summaries, support your goals, provide meal-analysis features, troubleshoot errors, and maintain the application.",
    ],
  },
  {
    title: "3. AI-Powered Meal Analysis",
    paragraphs: [
      "MacroMind uses Google Gemini for AI-assisted meal analysis. Information submitted for analysis may be sent to Google to generate a response. The exact information processed depends on the feature and the request you submit.",
      "AI-generated calorie and nutrient estimates may be incomplete or inaccurate. They should not be treated as medical advice or a substitute for advice from a qualified healthcare professional.",
    ],
  },
  {
    title: "4. Storage and Security",
    paragraphs: [
      "MacroMind uses a backend service and PostgreSQL database to support its functionality. Information may also be handled by other service providers involved in operating the application.",
      "Reasonable security measures should be maintained to protect information. However, no method of electronic storage or transmission can be guaranteed to be completely secure.",
    ],
  },
  {
    title: "5. Sharing and Third-Party Services",
    paragraphs: [
      "Information may be processed by third-party providers when necessary to operate features you use, including AI meal analysis, hosting, and file storage where applicable. Those providers may process information under their own terms and privacy practices.",
      "MacroMind does not sell personal information as a business model. Confirm this statement against all analytics, advertising, and other integrations before publication.",
    ],
  },
  {
    title: "6. Retention and Account Deletion",
    paragraphs: [
      "Information may be retained for as long as needed to provide the service, maintain records, resolve issues, and meet applicable legal obligations. Actual retention periods depend on the type of information and how it is used.",
      "MacroMind does not currently provide an in-app account deletion feature. If you want to make a request concerning your account or personal information, contact us using the privacy contact details provided below. Requests will be reviewed under applicable law.",
    ],
  },
  {
    title: "7. Your Privacy Rights",
    paragraphs: [
      "Depending on applicable law, you may have rights to request access to, correction of, or deletion of your personal information, or to exercise other privacy rights.",
      "Contact MacroMind using the contact details below to submit a request. We may need to verify your identity before responding.",
    ],
  },
  {
    title: "8. Children's Privacy",
    paragraphs: [
      "MacroMind is not intended for use by individuals who are not permitted to use the service under applicable age and consent requirements. The intended minimum age and any applicable parental-consent process must be established before launch.",
    ],
  },
  {
    title: "9. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy as MacroMind changes. The revised policy will include an updated date. Where required by law, we will provide notice of material changes.",
    ],
  },
];

export default function PrivacyPolicy() {
  usePageTitle("Privacy Policy");
  usePageDescription(
    "Learn how MacroMind handles account information, nutrition records, AI-powered meal analysis, and privacy requests.",
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
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: October 19, 2026
          </p>
          <p className="mt-5 leading-7 text-gray-600">
            This policy explains how MacroMind handles information when you use
            our website and nutrition-tracking features.
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
            <h2 className="text-lg font-semibold">10. Contact</h2>
            <p className="mt-3 leading-7 text-gray-600">
              For privacy questions or requests, contact the MacroMind team
              through its designated privacy contact.
            </p>
            <p className="mt-3 leading-7 text-gray-600">
              The contact details must be added here before this policy is
              published. Do not publish this page as final until users have a
              working way to submit privacy requests.
            </p>
          </section>
        </div>

        <footer className="mt-6 border-t border-gray-100 pt-6 text-sm text-gray-500">
          Read our{" "}
          <Link
            to="/terms"
            className="font-medium text-emerald-700 hover:underline"
          >
            Terms of Service
          </Link>
          .
        </footer>
      </article>
    </main>
  );
}

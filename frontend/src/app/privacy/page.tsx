'use client';

import { LegalLayout } from '@/components/layout/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout 
      title="Privacy Protocol" 
      subtitle="Data protection declaration according to GDPR (DSGVO). We prioritize your cognitive sovereignty and data privacy."
      lastUpdated="April 2026"
    >
      <section>
        <h2>1. An Overview of Data Protection</h2>
        <h3>General Information</h3>
        <p>
          The following information will provide you with an easy-to-navigate overview of what will happen with your personal data when you visit our website. The term “personal data” comprises all data that can be used to personally identify you. 
        </p>
      </section>

      <section>
        <h2>2. Data Recording on Our Website</h2>
        <h3>Who is responsible for the data recording on this website?</h3>
        <p>
          The data on this website is processed by the website operator, whose contact details can be found in the <strong><a href="/impressum">Impressum</a></strong> of this website.
        </p>
      </section>

      <section>
        <h2>3. Use of AI and Cognitive Processing</h2>
        <p>
          EvoChat processes your voice and text inputs using advanced AI models. These inputs are used exclusively for:
        </p>
        <ul>
          <li>Generating real-time responses during your sparring sessions.</li>
          <li>Analyzing syntax and grammar errors to provide personalized feedback.</li>
          <li>Building your "Vector Memory" to track learning progress over time.</li>
        </ul>
        <p>
          <strong>Audio Data:</strong> Voice recordings are processed in real-time. We do not store raw audio files unless explicitly requested for future analysis features.
        </p>
      </section>

      <section>
        <h2>4. Supabase and Infrastructure</h2>
        <p>
          We use Supabase for authentication and database management. Your data is stored on servers located within the EU (Frankfurt region) to ensure compliance with German data protection standards.
        </p>
      </section>

      <section>
        <h2>5. Your Rights Regarding Your Data</h2>
        <p>
          You have the right to receive information about the source, recipient, and purposes of your archived personal data at any time without having to pay a fee for such disclosures. You also have the right to demand that your data are rectified or eradicated. 
        </p>
      </section>

      <section>
        <h2>6. Cookies and Tracking</h2>
        <p>
          We use strictly necessary cookies for authentication (sb-access-token). We do not use third-party marketing or tracking cookies without your explicit consent.
        </p>
      </section>
    </LegalLayout>
  );
}

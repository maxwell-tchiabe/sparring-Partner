'use client';

import { LegalLayout } from '@/components/layout/LegalLayout';

export default function ImpressumPage() {
  return (
    <LegalLayout 
      title="Impressum" 
      subtitle="Legal disclosure according to § 5 TMG and § 55 RStV. Required for all business operations within the Federal Republic of Germany."
      lastUpdated="April 2026"
    >
      <section>
        <h2>Information according to § 5 TMG</h2>
        <p>
          <strong>[Name of Representative/Company]</strong><br />
          [Street Address]<br />
          [Postal Code, City]<br />
          Germany
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Phone: [Your Phone Number]<br />
          Email: [Your Email Address]<br />
          Website: www.evochat.ai
        </p>
      </section>

      <section>
        <h2>Register Entry</h2>
        <p>
          Entry in the Handelsregister (Commercial Register). <br />
          Register Court: [e.g., Amtsgericht Berlin]<br />
          Register Number: [e.g., HRB 123456]
        </p>
      </section>

      <section>
        <h2>VAT ID</h2>
        <p>
          Sales tax identification number according to § 27 a of the Sales Tax Law:<br />
          [VAT ID Number, e.g., DE 123 456 789]
        </p>
      </section>

      <section>
        <h2>Responsible for Content</h2>
        <p>
          Responsible for the content according to § 55 paragraph 2 RStV:<br />
          <strong>[Name of Content Manager]</strong><br />
          [Street Address]<br />
          [Postal Code, City]
        </p>
      </section>

      <section>
        <h2>Dispute Resolution</h2>
        <p>
          The European Commission provides a platform for online dispute resolution (OS): <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>. <br />
          We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
        </p>
      </section>

      <section>
        <h2>Liability for Content</h2>
        <p>
          As a service provider, we are responsible for our own content on these pages in accordance with general laws according to § 7 para. 1 TMG. According to §§ 8 to 10 TMG, however, we as a service provider are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
        </p>
      </section>
    </LegalLayout>
  );
}

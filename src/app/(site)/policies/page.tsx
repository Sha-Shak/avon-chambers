import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { ConsultationSection } from "@/components/consultation-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site.config";
import { breadcrumbSchema } from "@/lib/schema";
import { buildOpenGraph } from "@/lib/seo";

const DESCRIPTION = `Terms of engagement and the policies that govern how ${siteConfig.name} works with clients, handles data and conducts itself.`;

export const metadata: Metadata = {
  title: "Policies & Terms of Engagement",
  description: DESCRIPTION,
  alternates: { canonical: "/policies" },
  openGraph: buildOpenGraph({
    title: `Policies & Terms of Engagement — ${siteConfig.name}`,
    description: DESCRIPTION,
    url: "/policies",
  }),
};

/**
 * Anchor sections rendered below, in order — also drives the jump-to chip
 * row so the two never drift out of sync.
 */
const SECTIONS = [
  { id: "terms-of-engagement", label: "Terms of Engagement" },
  { id: "privacy-policy", label: "Privacy Policy" },
  { id: "confidentiality-policy", label: "Confidentiality" },
  { id: "cookie-policy", label: "Cookies" },
  { id: "fees-and-billing", label: "Fees & Billing" },
  { id: "complaints-policy", label: "Complaints" },
  { id: "aml-policy", label: "Client Due Diligence" },
  { id: "equality-policy", label: "Equality & Diversity" },
  { id: "lawyer-advertising", label: "Lawyer Advertising" },
  { id: "accessibility", label: "Accessibility" },
] as const;

export default function PoliciesPage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Policies & Terms of Engagement", path: "/policies" },
        ])}
      />

      <section className="border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <FadeIn className="max-w-3xl">
            <p className="eyebrow">Policies</p>
            <h1 className="mt-6 text-4xl leading-[1.1] text-foreground sm:text-5xl">
              Policies & Terms of Engagement
            </h1>
            <p className="mt-7 text-base leading-relaxed text-muted-foreground">
              {DESCRIPTION} This page is a working draft prepared to give the site complete, honest
              policy coverage from launch — the firm should have it reviewed by its own counsel and
              refined to reflect its actual practice before treating any clause as final.
            </p>
          </FadeIn>

          <FadeIn delay={80} className="mt-10 flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center rounded-full border border-foreground/15 px-4 py-1.5 text-[0.75rem] tracking-wide text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-10 lg:py-24">
        <PolicySection id="terms-of-engagement" title="Terms of Engagement">
          <p>
            These terms govern the relationship between {siteConfig.name} (&ldquo;the Chambers&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo;) and any person or entity who instructs us (&ldquo;the client&rdquo;, &ldquo;you&rdquo;). They apply
            from the point a matter is accepted, alongside any engagement letter issued for that specific matter —
            where the two conflict, the engagement letter for that matter takes precedence.
          </p>
          <h3>Scope of engagement</h3>
          <p>
            We act only on the matter(s) specifically instructed and confirmed in writing. Advice given on one
            matter should not be relied on as covering any other matter, past or future, unless we confirm
            otherwise in writing. We are not obliged to advise on a matter outside the agreed scope, even if it
            comes to our attention while acting for you.
          </p>
          <h3>Fees, retainers and disbursements</h3>
          <p>
            Fees are agreed before work begins, on the fixed-fee, hourly-rate or retainer basis set out in the
            engagement letter for that matter. Disbursements — court fees, stamp duty, expert or counsel fees,
            travel and similar third-party costs — are billed separately as incurred. See{" "}
            <a href="#fees-and-billing">Fees &amp; Billing</a> below for invoicing and payment terms.
          </p>
          <h3>Client responsibilities</h3>
          <p>
            You agree to provide instructions, documents and information promptly and accurately, and to tell us
            without delay if circumstances relevant to the matter change. We are entitled to rely on the accuracy
            and completeness of what you provide, and are not responsible for advice that turns out to be wrong
            because it was based on incomplete or inaccurate information you supplied.
          </p>
          <h3>Confidentiality and privilege</h3>
          <p>
            Information you share with us is kept confidential and, where applicable, protected by
            attorney&ndash;client privilege, subject to the exceptions set out in our{" "}
            <a href="#confidentiality-policy">Confidentiality Policy</a> below (for example, where disclosure is
            required by law or a competent court).
          </p>
          <h3>Conflicts of interest</h3>
          <p>
            Before accepting a new instruction we check it against our existing and former clients. Where a
            conflict — or a risk of one — is identified, we will decline the instruction, or act only once an
            appropriate conflict waiver has been obtained from everyone affected.
          </p>
          <h3>Limitation of liability</h3>
          <p>
            Our liability to you for any claim arising from a matter is limited to the fees paid to us for that
            matter, except where such liability cannot be limited or excluded under the laws of Bangladesh (for
            example, liability for fraud or wilful default). We are not liable for indirect or consequential loss.
          </p>
          <h3>Termination</h3>
          <p>
            Either party may end the engagement on reasonable written notice. On termination, you remain
            responsible for fees and disbursements incurred up to that point, and we will take reasonable steps to
            protect your position on any matter left unresolved, including handing over your file promptly on
            request.
          </p>
          <h3>Governing law</h3>
          <p>
            These terms, and any matter we act on, are governed by the laws of Bangladesh. Any dispute arising
            from these terms or our engagement is subject to the exclusive jurisdiction of the courts of Dhaka,
            without prejudice to any right to refer a dispute to mediation or arbitration by mutual agreement.
          </p>
        </PolicySection>

        <PolicySection id="privacy-policy" title="Privacy Policy">
          <p>
            This policy explains what personal data this website and {siteConfig.name} collect, why, and how it
            is handled.
          </p>
          <h3>What we collect</h3>
          <ul>
            <li>
              <strong>Consultation and contact form submissions</strong> — name, email, phone number, and the
              details of your enquiry, submitted voluntarily when you book a consultation or contact us.
            </li>
            <li>
              <strong>Client and matter records</strong> — information you provide once we act for you, held as
              part of the file for that matter.
            </li>
            <li>
              <strong>Usage data</strong> — where analytics are enabled on this site, aggregated, anonymised
              information about how visitors use it (pages viewed, general location, device type) is collected to
              help us improve the site. See <a href="#cookie-policy">Cookies</a> below.
            </li>
          </ul>
          <h3>How we use it</h3>
          <p>
            We use personal data to respond to enquiries, provide legal services to clients, meet our own legal
            and regulatory obligations, and — only with appropriate care — to improve this website. We do not sell
            personal data, and we do not share it with third parties except: service providers who help us run
            this site or our practice (under confidentiality obligations), where required by law or a court order,
            or with your consent.
          </p>
          <h3>Retention</h3>
          <p>
            Enquiry details that do not lead to an engagement are kept only as long as needed to respond to you
            and are then deleted. Client and matter records are retained for the period required by professional
            conduct rules and Bangladeshi law, after which they are securely destroyed.
          </p>
          <h3>Your rights</h3>
          <p>
            You may ask us what personal data we hold about you, request a correction, or ask us to delete data we
            are not otherwise required to keep. To make a request, contact us at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </PolicySection>

        <PolicySection id="confidentiality-policy" title="Confidentiality Policy">
          <p>
            Confidentiality is a professional obligation we take seriously, not just a contractual one. Every
            member of Chambers and our support staff is bound by confidentiality obligations that continue after a
            matter ends and after they leave the firm.
          </p>
          <h3>What is confidential</h3>
          <p>
            All information relating to a client or a matter is treated as confidential, whether it is marked as
            such or not, unless it is already public knowledge through no fault of ours.
          </p>
          <h3>Exceptions</h3>
          <p>
            We may disclose confidential information where the client consents, where disclosure is required by
            law, court order, or a regulator with jurisdiction over us, or to the limited extent necessary to
            defend ourselves in a dispute with the client over the matter.
          </p>
          <h3>Information security</h3>
          <p>
            Physical files are kept in access-controlled storage, and digital records are protected by
            access controls, encryption in transit, and restricted internal access on a need-to-know basis.
          </p>
        </PolicySection>

        <PolicySection id="cookie-policy" title="Cookie Policy">
          <p>This site uses a small number of cookies and similar technologies, grouped as follows.</p>
          <h3>Essential cookies</h3>
          <p>
            Used for core site functionality — for example, remembering your appearance (light/dark) preference.
            These cannot be switched off, as the site would not function correctly without them.
          </p>
          <h3>Analytics cookies</h3>
          <p>
            Where enabled, Google Analytics sets cookies to help us understand how visitors use this site, in
            aggregate and without identifying you personally. You can opt out of Google Analytics tracking
            site-wide using the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              Google Analytics opt-out browser add-on
            </a>
            , or block cookies generally in your browser settings.
          </p>
          <h3>Managing cookies</h3>
          <p>
            Most browsers let you view, delete and block cookies from a site&apos;s settings menu. Blocking essential
            cookies may affect how parts of this site behave.
          </p>
        </PolicySection>

        <PolicySection id="fees-and-billing" title="Fees & Billing Policy">
          <p>
            Fees are agreed in writing before work begins, on one of three bases: a fixed fee for a defined scope
            of work, an hourly rate for matters where the scope cannot be fixed in advance, or a retainer for
            ongoing advisory support.
          </p>
          <h3>Invoicing and payment</h3>
          <p>
            Invoices are issued at agreed intervals (or on completion of a fixed-fee matter) and are due within
            the period stated on the invoice, ordinarily 14 days. Disbursements paid on your behalf are itemised
            separately and billed at cost.
          </p>
          <h3>Estimates</h3>
          <p>
            Where a precise fee cannot be fixed in advance, we provide a good-faith estimate and will tell you
            promptly if it looks likely to be exceeded, before further costs are incurred.
          </p>
          <h3>Late payment</h3>
          <p>
            Overdue invoices may attract late-payment interest as permitted by law, and we reserve the right to
            pause further work on a matter until an overdue invoice is settled.
          </p>
        </PolicySection>

        <PolicySection id="complaints-policy" title="Complaints Policy">
          <p>
            We aim to provide a good service every time, but if something goes wrong we want to hear about it and
            put it right.
          </p>
          <h3>How to raise a complaint</h3>
          <p>
            In the first instance, raise your concern with the lawyer handling your matter. If you would prefer
            not to, or are not satisfied with their response, write to us at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> marked &ldquo;Complaint&rdquo;, setting out
            what happened and what outcome you are looking for.
          </p>
          <h3>What happens next</h3>
          <p>
            We will acknowledge a written complaint within 5 working days and aim to provide a full response
            within 28 days. If a complaint cannot be resolved to your satisfaction internally, we will explain any
            further options available to you, including referral to the relevant professional body.
          </p>
        </PolicySection>

        <PolicySection id="aml-policy" title="Client Due Diligence & Anti-Money Laundering Policy">
          <p>
            Before accepting instructions on certain matters, we are required to verify the identity of clients
            (and, where relevant, the ultimate beneficial owners of a corporate client) and to understand the
            source of funds involved.
          </p>
          <h3>What we may ask for</h3>
          <p>
            Valid photo identification, proof of address, company incorporation and ownership documents for
            corporate clients, and information about the source of funds for a transaction. Instructions may be
            delayed until satisfactory checks are complete.
          </p>
          <h3>Reporting obligations</h3>
          <p>
            Where we are required by law to report a suspicion of money laundering or other financial crime to the
            relevant authority, we will do so — this obligation can override our usual duty of confidentiality,
            and in some circumstances the law prevents us from telling the client that a report has been made.
          </p>
        </PolicySection>

        <PolicySection id="equality-policy" title="Equality & Diversity Policy">
          <p>
            {siteConfig.name} is committed to equality of opportunity in how we recruit, develop and treat our
            people, and in how we serve our clients. We do not tolerate discrimination, harassment or victimisation
            on the basis of gender, religion, ethnicity, disability, age, or any other characteristic protected
            under the laws of Bangladesh.
          </p>
          <p>
            Anyone — staff, client, or third party — who believes they have experienced or witnessed conduct
            falling short of this commitment can raise it confidentially with the firm using the contact details on
            our <Link href="/contact">Contact</Link> page.
          </p>
        </PolicySection>

        <PolicySection id="lawyer-advertising" title="Lawyer Advertising">
          <p>
            This website is attorney advertising. It is provided for general informational purposes only and does
            not constitute legal advice, nor does viewing it or contacting us through it create a lawyer&ndash;client
            relationship — that relationship only comes into existence once we have confirmed in writing that we
            are acting for you, and any necessary conflict checks have been completed.
          </p>
          <p>
            Prior results described anywhere on this site do not guarantee a similar outcome. Every matter turns
            on its own facts and circumstances, and past performance is not a promise of future results.
          </p>
          <p>
            Content on this site (including articles under <Link href="/insights">Articles</Link>) reflects the
            law in general terms at the time of writing and may not reflect subsequent developments. It should not
            be relied on as a substitute for advice on your specific circumstances.
          </p>
        </PolicySection>

        <PolicySection id="accessibility" title="Accessibility Statement">
          <p>
            We want this site to be usable by as many people as possible, including people using assistive
            technology such as a screen reader, magnification, or keyboard-only navigation.
          </p>
          <h3>What we&apos;ve done</h3>
          <p>
            The site is built with semantic HTML, visible keyboard focus states, alt text on informational images,
            and respects your operating system&apos;s reduced-motion preference. We target conformance with{" "}
            <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer">
              WCAG 2.1 level AA
            </a>{" "}
            as a working standard, though this has not yet been through a full independent audit.
          </p>
          <h3>Reporting a problem</h3>
          <p>
            If you find any part of this site difficult to use, please tell us at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or{" "}
            <a href={`tel:${siteConfig.consultationPhoneE164}`}>{siteConfig.consultationPhoneDisplay}</a> — include
            the page and what happened, and we will do our best to fix it.
          </p>
        </PolicySection>

        <p className="mt-16 border-t border-foreground/10 pt-8 text-xs text-muted-foreground">
          Last updated {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
          Questions about any policy on this page can be sent to{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-foreground hover:underline">
            {siteConfig.email}
          </a>
          .
        </p>
      </div>

      <ConsultationSection eyebrow="Still have a question" heading="Talk to us before you decide" />
    </div>
  );
}

function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-foreground/10 py-14 first:border-t-0 first:pt-0">
      <FadeIn>
        <h2 className="text-2xl text-foreground sm:text-3xl">{title}</h2>
        <div className="prose-insight prose prose-sm mt-6 max-w-none">{children}</div>
      </FadeIn>
    </section>
  );
}

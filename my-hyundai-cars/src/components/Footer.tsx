import { NAV_ITEMS } from '../data/nav'
import { CONTACT_EMAIL, SITE, whatsAppLinkFor } from '../config/site'

const LEGAL = ['Privacy Policy', 'Terms of Service', 'Legal Disclaimer']

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink pt-20 pb-[calc(7rem+env(safe-area-inset-bottom))] text-bone sm:pt-24 lg:pt-28 lg:pb-16">
      <div className="shell">
        <div className="grid gap-12 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10 lg:pb-16">
          <div>
            <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-white sm:text-xs">
              {SITE.name}
            </p>
            <p className="mt-5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-white/55">
              An independent Hyundai consultation service for personal, family and business
              mobility needs.
            </p>
          </div>

          <FooterColumn title="Navigation">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="inline-block py-1.5 text-[0.9375rem] text-white/60 transition-colors duration-300 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact">
            <li>
              <a
                href={whatsAppLinkFor('general')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1.5 text-[0.9375rem] text-white/60 transition-colors duration-300 hover:text-white"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block py-1.5 text-[0.9375rem] break-all text-white/60 transition-colors duration-300 hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
          </FooterColumn>

          <FooterColumn title="Legal">
            {LEGAL.map((item) => (
              <li key={item}>
                <a
                  href="#top"
                  className="inline-block py-1.5 text-[0.9375rem] text-white/60 transition-colors duration-300 hover:text-white"
                >
                  {item}
                </a>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-6 pt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <p className="max-w-[68ch] text-[0.8125rem] leading-relaxed text-white/55">
            {SITE.disclaimer}
          </p>
          <p className="shrink-0 text-[0.8125rem] text-white/55">
            © {year} {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow text-white/55">{title}</h2>
      <ul className="mt-4 flex flex-col">{children}</ul>
    </div>
  )
}

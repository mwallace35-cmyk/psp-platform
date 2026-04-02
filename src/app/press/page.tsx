import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Press & Media | PhillySportsPack.com',
  description: 'Media resources, brand assets, and contact information for PhillySportsPack.com — the definitive Philadelphia high school sports database.',
  alternates: { canonical: 'https://phillysportspack.com/press' },
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <Breadcrumb items={[{ label: 'Press & Media' }]} />
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-[var(--psp-navy)] to-[var(--psp-navy-mid)] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wider mb-4">
            Press & Media
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            PhillySportsPack.com is the definitive source for Philadelphia high school sports data,
            covering 7 sports across 700+ schools with 85 years of history.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* About */}
        <section>
          <h2 className="font-bebas text-2xl text-[var(--psp-navy)] tracking-wider mb-4">About PhillySportsPack</h2>
          <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
            <p>
              PhillySportsPack.com is a comprehensive high school sports database serving the Philadelphia
              metropolitan area. Founded by lifelong Philadelphia sports enthusiasts, PSP tracks stats, scores,
              rankings, and recruiting across football, basketball, baseball, soccer, lacrosse, track & field,
              and wrestling.
            </p>
            <p>
              Our database includes <strong>55,000+ player profiles</strong>, <strong>700+ schools</strong>,
              and historical records dating back to 1937. We cover the Philadelphia Catholic League,
              Philadelphia Public League, Inter-Academic League, and surrounding independent programs.
            </p>
          </div>
        </section>

        {/* By The Numbers */}
        <section>
          <h2 className="font-bebas text-2xl text-[var(--psp-navy)] tracking-wider mb-4">By The Numbers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '55K+', label: 'Player Profiles' },
              { value: '700+', label: 'Schools' },
              { value: '7', label: 'Sports' },
              { value: '85+', label: 'Years of Data' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[var(--psp-navy)] rounded-lg p-4 text-center">
                <div className="font-bebas text-3xl text-[var(--psp-gold)] tracking-wider">{stat.value}</div>
                <div className="text-xs text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Media Contact */}
        <section>
          <h2 className="font-bebas text-2xl text-[var(--psp-navy)] tracking-wider mb-4">Media Contact</h2>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <p className="text-gray-700 mb-4">
              For press inquiries, interviews, data requests, or partnership opportunities:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href="mailto:press@phillysportspack.com" className="text-[var(--psp-blue)] hover:underline">
                  press@phillysportspack.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Twitter/X:</strong>{' '}
                <a
                  href="https://twitter.com/PhillySportsPak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--psp-blue)] hover:underline"
                >
                  @PhillySportsPak
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Data Usage */}
        <section>
          <h2 className="font-bebas text-2xl text-[var(--psp-navy)] tracking-wider mb-4">Data & Attribution</h2>
          <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
            <p>
              Journalists and media organizations are welcome to reference PhillySportsPack data with
              proper attribution. Please credit <strong>&ldquo;PhillySportsPack.com&rdquo;</strong> when
              citing stats, records, or rankings from our platform.
            </p>
            <p>
              For bulk data access or API partnerships, please reach out via the contact information above.
            </p>
          </div>
        </section>

        {/* Brand Assets */}
        <section>
          <h2 className="font-bebas text-2xl text-[var(--psp-navy)] tracking-wider mb-4">Brand Colors</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'Liberty Blue', hex: '#0a1628', text: 'text-white' },
              { name: 'Championship Gold', hex: '#f0a500', text: 'text-[var(--psp-navy)]' },
              { name: 'Cream', hex: '#faf5eb', text: 'text-gray-700' },
            ].map((color) => (
              <div key={color.name} className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <p className="text-sm font-bold text-gray-800">{color.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back link */}
        <div className="pt-4 border-t border-gray-200">
          <Link href="/" className="text-sm text-[var(--psp-blue)] hover:underline">
            &larr; Back to PhillySportsPack.com
          </Link>
        </div>
      </div>
    </div>
  );
}

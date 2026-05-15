import { FiAward, FiDownload, FiShield } from 'react-icons/fi';
import Layout from '../components/Layout';
import { SectionHeading, SurfaceCard } from '../components/UiPrimitives';

const certificates = [
  { title: 'Advanced React Engineering', issuer: 'Tecnoprism Academy', date: 'Mar 2026' },
  { title: 'Cloud Security Essentials', issuer: 'Internal Security Guild', date: 'Feb 2026' },
  { title: 'Product Discovery Foundations', issuer: 'Product Council', date: 'Jan 2026' },
];

function Certificates() {
  return (
    <Layout title="Certificates" subtitle="Professional achievements and verified learning milestones.">
      <SurfaceCard className="rounded-2xl p-5">
        <SectionHeading title="Issued Certificates" subtitle="Download and showcase credentials earned in the platform." />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <div key={certificate.title} className="gradient-border premium-card rounded-2xl p-4">
              <div className="mb-3 flex items-start justify-between">
                <span className="rounded-xl bg-indigo-100 p-2 text-indigo-600 dark:bg-slate-800 dark:text-indigo-300">
                  <FiAward />
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  Verified
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{certificate.title}</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{certificate.issuer}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{certificate.date}</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
              >
                <FiDownload /> Download
              </button>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard className="mt-5 rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          <FiShield className="mr-2 inline text-indigo-500" />
          Verification
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          All certificates are cryptographically signed and verifiable within Tecnoprism&apos;s HR systems.
        </p>
      </SurfaceCard>
    </Layout>
  );
}

export default Certificates;

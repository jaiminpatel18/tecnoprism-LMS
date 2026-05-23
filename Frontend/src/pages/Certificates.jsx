import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FiAward, FiDownload, FiShield } from 'react-icons/fi';
import Layout from '../components/Layout';
import { EmptyState, SectionHeading, SurfaceCard } from '../components/UiPrimitives';
import CertificateSkeleton from '../components/skeletons/CertificateSkeleton';
import { API_URL, authConfig } from '../utils/api';

function Certificates() {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [certificateData, setCertificateData] = useState({ data: [], meta: null });

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/gamification/certificates`, authConfig(token));
        setCertificateData({ data: data.data || [], meta: data.meta || null });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load certificates.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [token]);

  if (loading) {
    return (
      <Layout title="Certificates" subtitle="Loading your achievements...">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <CertificateSkeleton key={idx} />
          ))}
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Certificates" subtitle="Could not load certificates.">
        <EmptyState icon={FiAward} title="Certificates unavailable" description={error} />
      </Layout>
    );
  }

  const certificates = certificateData.data || [];
  const meta = certificateData.meta;

  return (
    <Layout title="Certificates" subtitle="Professional achievements generated from actual completed courses.">
      <SurfaceCard className="rounded-2xl p-5">
        <SectionHeading title="Issued Certificates" subtitle="Automatically created after full course completion." />
        {certificates.length === 0 ? (
          <EmptyState
            icon={FiAward}
            title="No certificates yet"
            description="Complete enrolled courses to unlock your first certificate."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {certificates.map((certificate) => (
              <div key={certificate.certificateId} className="gradient-border premium-card rounded-2xl p-4">
                <div className="mb-3 flex items-start justify-between">
                  <span className="rounded-xl bg-indigo-100 p-2 text-indigo-600 dark:bg-slate-800 dark:text-indigo-300">
                    <FiAward />
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    Verified
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{certificate.title}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{certificate.course?.title || 'Course completion'}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">ID: {certificate.certificateId}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Issued: {new Date(certificate.issuedAt).toLocaleDateString()}
                </p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
                >
                  <FiDownload /> Download
                </button>
              </div>
            ))}
          </div>
        )}
      </SurfaceCard>

      <SurfaceCard className="mt-5 rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          <FiShield className="mr-2 inline text-indigo-500" />
          Verification
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {meta?.totalCertificates || 0} certificates issued • {meta?.completedCourses || 0} completed courses •{' '}
          {meta?.totalXp || 0} XP earned.
        </p>
      </SurfaceCard>
    </Layout>
  );
}

export default Certificates;

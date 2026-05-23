import { SkeletonBlock, SkeletonLine } from './SkeletonBase';

function CertificateSkeleton() {
  return (
    <div className="premium-card rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <SkeletonBlock className="h-10 w-10 rounded-xl" />
        <SkeletonLine className="h-4 w-16" />
      </div>
      <SkeletonLine className="mt-4 h-4 w-2/3" />
      <SkeletonLine className="mt-2 h-3 w-1/2" />
      <SkeletonLine className="mt-2 h-3 w-1/3" />
      <SkeletonBlock className="mt-4 h-9 w-28 rounded-lg" />
    </div>
  );
}

export default CertificateSkeleton;

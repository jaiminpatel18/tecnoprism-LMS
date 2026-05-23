import { SkeletonBlock, SkeletonLine } from './SkeletonBase';

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="premium-card rounded-3xl p-7">
        <SkeletonLine className="h-4 w-40" />
        <SkeletonLine className="mt-4 h-6 w-3/5" />
        <SkeletonLine className="mt-2 h-4 w-2/3" />
        <div className="mt-6 flex gap-3">
          <SkeletonBlock className="h-10 w-40 rounded-xl" />
          <SkeletonBlock className="h-10 w-56 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="premium-card rounded-2xl p-5">
            <SkeletonLine className="h-3 w-24" />
            <SkeletonLine className="mt-4 h-6 w-16" />
            <SkeletonBlock className="mt-6 h-10 w-10 rounded-xl" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">
        <div className="premium-card rounded-2xl p-5">
          <SkeletonLine className="h-4 w-40" />
          <SkeletonBlock className="mt-5 h-48 rounded-2xl" />
        </div>
        <div className="premium-card rounded-2xl p-5">
          <SkeletonLine className="h-4 w-32" />
          <div className="mt-4 space-y-3">
            {[...Array(3)].map((_, idx) => (
              <div key={idx}>
                <SkeletonLine className="h-3 w-24" />
                <SkeletonBlock className="mt-2 h-3 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="premium-card rounded-2xl p-5">
            <SkeletonLine className="h-4 w-32" />
            <div className="mt-4 space-y-3">
              {[...Array(3)].map((__, itemIdx) => (
                <SkeletonBlock key={itemIdx} className="h-12 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardSkeleton;

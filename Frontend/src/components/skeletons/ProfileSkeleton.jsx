import { SkeletonAvatar, SkeletonBlock, SkeletonLine } from './SkeletonBase';

function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_1.9fr]">
      <div className="premium-card rounded-2xl p-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <SkeletonAvatar className="h-24 w-24" />
          <SkeletonLine className="h-4 w-40" />
          <SkeletonLine className="h-3 w-24" />
          <SkeletonBlock className="h-8 w-40 rounded-xl" />
        </div>
      </div>

      <div className="space-y-5">
        <div className="premium-card rounded-2xl p-5">
          <SkeletonLine className="h-4 w-32" />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
            {[...Array(4)].map((_, idx) => (
              <SkeletonBlock key={idx} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="premium-card rounded-2xl p-5">
          <SkeletonLine className="h-4 w-40" />
          <div className="mt-4 space-y-3">
            {[...Array(3)].map((_, idx) => (
              <SkeletonBlock key={idx} className="h-12 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="premium-card rounded-2xl p-5">
          <SkeletonLine className="h-4 w-36" />
          <div className="mt-4 space-y-3">
            {[...Array(3)].map((_, idx) => (
              <SkeletonBlock key={idx} className="h-10 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;

import { SkeletonBlock, SkeletonLine } from './SkeletonBase';

function SessionCardSkeleton() {
  return (
    <div className="premium-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <SkeletonLine className="h-3 w-24" />
        <SkeletonLine className="h-3 w-20" />
      </div>
      <SkeletonLine className="mt-4 h-5 w-2/3" />
      <SkeletonLine className="mt-3 h-3 w-full" />
      <SkeletonLine className="mt-2 h-3 w-5/6" />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <SkeletonBlock className="h-8 rounded-xl" />
        <SkeletonBlock className="h-8 rounded-xl" />
        <SkeletonBlock className="h-8 rounded-xl" />
        <SkeletonBlock className="h-8 rounded-xl" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <SkeletonLine className="h-3 w-24" />
        <SkeletonBlock className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  );
}

export default SessionCardSkeleton;

import { SkeletonBlock, SkeletonLine } from './SkeletonBase';

function CourseCardSkeleton() {
  return (
    <div className="premium-card overflow-hidden rounded-2xl">
      <SkeletonBlock className="h-40 w-full" />
      <div className="space-y-3 p-5">
        <SkeletonLine className="h-4 w-2/3" />
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-5/6" />
        <div className="mt-2 flex items-center justify-between">
          <SkeletonLine className="h-3 w-24" />
          <SkeletonLine className="h-3 w-20" />
        </div>
        <SkeletonBlock className="h-2.5 w-full rounded-full" />
        <SkeletonBlock className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default CourseCardSkeleton;

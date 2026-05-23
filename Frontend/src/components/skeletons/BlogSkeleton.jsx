import { SkeletonBlock, SkeletonLine } from './SkeletonBase';

function BlogSkeleton() {
  return (
    <div className="premium-card overflow-hidden rounded-2xl">
      <SkeletonBlock className="h-48 w-full" />
      <div className="space-y-3 p-5">
        <SkeletonLine className="h-4 w-2/3" />
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-5/6" />
        <div className="mt-4 flex items-center justify-between">
          <SkeletonLine className="h-3 w-24" />
          <SkeletonLine className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export default BlogSkeleton;

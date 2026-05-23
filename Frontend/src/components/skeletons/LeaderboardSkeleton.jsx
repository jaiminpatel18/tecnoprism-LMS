import { SkeletonAvatar, SkeletonBlock, SkeletonLine } from './SkeletonBase';
import TableSkeleton from './TableSkeleton';

function LeaderboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="premium-card rounded-2xl p-5 text-center">
            <SkeletonAvatar className="mx-auto h-20 w-20" />
            <SkeletonLine className="mt-3 h-3 w-24 mx-auto" />
            <SkeletonLine className="mt-2 h-4 w-32 mx-auto" />
            <SkeletonBlock className="mt-4 h-8 w-24 mx-auto rounded-full" />
          </div>
        ))}
      </div>
      <TableSkeleton rows={7} columns={3} />
    </div>
  );
}

export default LeaderboardSkeleton;

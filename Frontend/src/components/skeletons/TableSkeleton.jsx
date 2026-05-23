import { SkeletonBlock, SkeletonLine } from './SkeletonBase';

function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="premium-card overflow-hidden rounded-2xl">
      <div className="border-b border-slate-200/60 px-5 py-4 dark:border-slate-700">
        <SkeletonLine className="h-4 w-32" />
      </div>
      <div className="space-y-3 px-5 py-4">
        {[...Array(rows)].map((_, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-4">
            {[...Array(columns)].map((__, colIdx) => (
              <SkeletonBlock key={colIdx} className="h-4 flex-1 rounded-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableSkeleton;

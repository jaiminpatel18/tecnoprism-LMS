import { SkeletonBlock, SkeletonLine } from './SkeletonBase';

function NotificationSkeleton({ items = 5 }) {
  return (
    <div className="space-y-3">
      {[...Array(items)].map((_, idx) => (
        <div key={idx} className="premium-card flex items-start gap-3 rounded-2xl p-4">
          <SkeletonBlock className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="h-3 w-1/2" />
            <SkeletonLine className="h-3 w-full" />
            <SkeletonLine className="h-3 w-32" />
          </div>
          <SkeletonBlock className="h-6 w-10 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default NotificationSkeleton;

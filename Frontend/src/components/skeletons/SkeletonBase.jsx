export const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

export const SkeletonLine = ({ className = '' }) => (
  <div className={`skeleton h-3 rounded-full ${className}`} />
);

export const SkeletonAvatar = ({ className = '' }) => (
  <div className={`skeleton rounded-full ${className}`} />
);

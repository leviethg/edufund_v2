import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
    <div className="flex justify-between mb-4">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-4 w-12" />
    </div>
    <Skeleton className="h-8 w-3/4 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-6" />
    <div className="mt-auto">
      <Skeleton className="h-2 w-full mb-4" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);
import React from 'react';

export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  if (type === 'detail') {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="h-6 bg-gray-200 rounded w-1/3 self-start mb-3" />
            <div className="h-8 bg-gray-200 rounded w-2/3 self-start mb-6" />
            <div className="w-64 h-64 bg-gray-200 rounded-2xl mb-4" />
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200" />
              <div className="w-6 h-6 rounded-full bg-gray-200" />
              <div className="w-6 h-6 rounded-full bg-gray-200" />
            </div>
          </div>
          <div className="md:col-span-7 space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="space-y-3 pt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl" />
              ))}
            </div>
            <div className="h-12 bg-gray-200 rounded-xl mt-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
          <div className="flex justify-between mb-4">
            <div className="h-4 w-12 bg-gray-200 rounded-full" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
          <div className="h-48 bg-gray-100 rounded-xl mb-4" />
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}
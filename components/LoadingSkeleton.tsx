import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs animate-pulse flex flex-col space-y-3">
      <div className="w-full h-40 bg-gray-200 rounded-xl" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-8 bg-gray-200 rounded-full w-24" />
      </div>
    </div>
  );
};

export const OrderCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-5 bg-gray-200 rounded-full w-20" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-12" /></td>
      <td className="py-4 px-4"><div className="h-6 bg-gray-200 rounded w-20" /></td>
    </tr>
  );
};

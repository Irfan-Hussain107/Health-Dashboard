// src/components/CivicComplaintsWidget.jsx
import React from 'react';

const CivicComplaintsWidget = ({ data }) => {
  const resolutionRate = Math.round((data.resolved / data.total) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Civic Complaints</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{data.total}</div>
          <div className="text-xs text-gray-600">Total Complaints</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{data.resolved}</div>
          <div className="text-xs text-gray-600">Resolved</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{data.pending}</div>
          <div className="text-xs text-gray-600">Pending</div>
        </div>
      </div>

      {/* Resolution Rate */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Resolution Rate</span>
          <span className="text-sm font-semibold text-green-600">{resolutionRate}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${resolutionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Complaint Categories */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Complaint Categories</h4>
        <div className="space-y-2">
          {data.categories.map((category, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-700">{category.name}</span>
              <span className="text-sm font-semibold text-gray-900">{category.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CivicComplaintsWidget;

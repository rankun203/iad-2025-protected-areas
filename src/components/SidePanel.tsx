'use client';

import { useState } from 'react';

interface PermitArea {
  id: string;
  name: string;
  type: string;
}

interface SidePanelProps {
  requestedAreas: PermitArea[];
  onSubmitApplication: () => void;
}

export default function SidePanel({ requestedAreas, onSubmitApplication }: SidePanelProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg border-r border-gray-200 z-20 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Permit Application</h2>
        
        {requestedAreas.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No permits requested yet</p>
            <p className="text-sm mt-2">Click &ldquo;Obtain a Permit&rdquo; on permit required areas to add them here</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Requested Areas</h3>
              <div className="space-y-3">
                {requestedAreas.map((area) => (
                  <div key={area.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800">{area.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Type: <span className="capitalize">{area.type}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Area ID: {area.id}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={onSubmitApplication}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Submit Application
            </button>
          </>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Application Information</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• All permits are subject to approval</p>
            <p>• Processing time: 3-5 business days</p>
            <p>• Contact: permits@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

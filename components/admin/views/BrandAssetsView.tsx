"use client";

import { Package } from "lucide-react";

export default function BrandAssetsView() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          Somaliland Brand
        </h2>
        <p className="text-gray-600 flex items-center gap-2">
          <Package className="w-4 h-4 text-[#004225]" />
          Manage and access brand resources
        </p>
      </div>

      <div className="bg-white/70 p-12 rounded-xl border border-[#004225]/30 text-center">
        <Package className="w-16 h-16 text-[#004225]/30 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-semibold">
          Content coming soon
        </p>
        <p className="text-gray-400 mt-2">
          Brand guidelines and media assets will be available here.
        </p>
      </div>
    </div>
  );
}

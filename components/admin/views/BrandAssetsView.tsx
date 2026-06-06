"use client";

import { useState } from "react";
import { Package } from "lucide-react";

export default function BrandAssetsView() {
  return (
  <div className="space-y-8">

    <div>
      <h2>...</h2>
      <p>...</p>
    </div>

    <div className="bg-white/70 p-6 rounded-xl border border-[#004225]/30">
      <iframe
        src="https://wbhbzgiagqrgcikbeihw.supabase.co/storage/v1/object/public/brand-assets/Gov-Somaliland-Branding_0001.pdf"
        width="100%"
        height="800"
        title="Somaliland Brand Guidelines"
        className="rounded-lg"
      />
    </div>

  </div>

);
}

'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export default function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=Hello%20VL%20Designs!%20I%20am%20browsing%20your%20website%20and%20need%20assistance%20with%20a%20cotton%20design.`;

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="group relative flex items-center space-x-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white"
        aria-label="Chat directly on WhatsApp"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
        </span>

        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
}

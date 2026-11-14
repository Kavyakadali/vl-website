'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <aside aria-label="Support and Assistance" className="fixed bottom-6 right-6 z-40">
      <a
        href="https://wa.me/919876543210?text=Hello%20VL%20Designs!%20I%20am%20browsing%20your%20website%20and%20need%20assistance%20with%20a%20cotton%20design."
        target="_blank"
        rel="noreferrer"
        className="group flex items-center space-x-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white"
        aria-label="Chat with VL Designs support on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          Chat with Designer
        </span>
      </a>
    </aside>
  );
}

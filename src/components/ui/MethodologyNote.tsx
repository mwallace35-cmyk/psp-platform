'use client';

import React, { useState } from 'react';

export interface MethodologyNoteProps {
  title: string;
  children: React.ReactNode;
}

export default function MethodologyNote({ title, children }: MethodologyNoteProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="rounded-lg border p-4 mt-4 transition-colors"
      style={{
        borderColor: 'var(--psp-gray-200)',
        background: 'rgba(59, 130, 246, 0.02)',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
        style={{ color: 'var(--psp-blue)' }}
      >
        <span>{isOpen ? '▼' : '▶'}</span>
        <span>ℹ️ {title}</span>
      </button>

      {isOpen && (
        <div
          className="mt-3 text-sm leading-relaxed"
          style={{ color: 'var(--psp-gray-700)' }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

"use client";

import { ForwardedRef, forwardRef } from "react";

interface SearchInputProps {
  value: string;
  isOpen: boolean;
  selectedIndex: number;
  onSearch: (query: string) => void;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  getActivedescendantId: () => string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    value,
    isOpen,
    selectedIndex,
    onSearch,
    onFocus,
    onKeyDown,
    getActivedescendantId,
  }: SearchInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {

  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder="Search players, schools, coaches..."
        aria-label="Search for players, schools, and coaches"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="search-listbox"
        aria-autocomplete="list"
        aria-activedescendant={getActivedescendantId()}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:bg-white/15 focus:border-[var(--psp-gold)] focus:outline-none transition-colors"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>
    </div>
  );
});

export default SearchInput;

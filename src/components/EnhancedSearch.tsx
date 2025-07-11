
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles, Filter, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getSearchSuggestions, getPopularSearches } from '@/utils/searchUtils';

interface EnhancedSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterChange?: (filters: SearchFilters) => void;
  placeholder?: string;
}

interface SearchFilters {
  platforms: string[];
  patterns: string[];
  industries: string[];
}

const UX_PATTERNS = [
  'onboarding', 'empty state', 'error state', 'loading state', 'checkout', 
  'signup', 'login', 'profile', 'search', 'navigation', 'feed', 
  'notifications', 'referral', 'dashboard', 'settings', 'chat'
];

const INDUSTRIES = [
  'b2b', 'fintech', 'ecommerce', 'health', 'education', 'social', 
  'productivity', 'travel', 'food', 'entertainment', 'news', 'dating'
];

const PLATFORMS = ['iOS', 'Android', 'Web', 'PWA'];

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  searchTerm,
  onSearchChange,
  onFilterChange,
  placeholder = "Search apps, screens, patterns..."
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    platforms: [],
    patterns: [],
    industries: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popularSearches = getPopularSearches();

  useEffect(() => {
    if (searchTerm.length > 2) {
      const newSuggestions = getSearchSuggestions(searchTerm);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleFilterToggle = (type: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters };
    const currentArray = newFilters[type];
    
    if (currentArray.includes(value)) {
      newFilters[type] = currentArray.filter(item => item !== value);
    } else {
      newFilters[type] = [...currentArray, value];
    }
    
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { platforms: [], patterns: [], industries: [] };
    setFilters(emptyFilters);
    onFilterChange?.(emptyFilters);
  };

  const hasActiveFilters = filters.platforms.length > 0 || filters.patterns.length > 0 || filters.industries.length > 0;

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative group">
        <div className="absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
          <Search className="h-4 w-4 lg:h-5 lg:w-5" />
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setShowSuggestions(suggestions.length > 0 || !searchTerm)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10 lg:pl-14 pr-20 lg:pr-24 py-4 lg:py-6 text-base lg:text-lg rounded-xl lg:rounded-2xl border-2 border-slate-200 focus:border-blue-500 transition-all duration-300 shadow-lg shadow-slate-100/50 group-focus-within:shadow-xl group-focus-within:shadow-blue-100/50"
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {/* AI Search Indicator */}
          {searchTerm && (
            <div className="flex items-center space-x-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">AI</span>
            </div>
          )}

          {/* Filter Toggle */}
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 w-8 p-0 ${hasActiveFilters ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Search Filters</h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Platform Filters */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wide">Platforms</h4>
                  <div className="flex flex-wrap gap-1">
                    {PLATFORMS.map(platform => (
                      <Badge
                        key={platform}
                        variant={filters.platforms.includes(platform) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => handleFilterToggle('platforms', platform)}
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* UX Pattern Filters */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wide">UX Patterns</h4>
                  <div className="flex flex-wrap gap-1">
                    {UX_PATTERNS.slice(0, 8).map(pattern => (
                      <Badge
                        key={pattern}
                        variant={filters.patterns.includes(pattern) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => handleFilterToggle('patterns', pattern)}
                      >
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Industry Filters */}
                <div>
                  <h4 className="text-xs font-medium text-slate-600 mb-2 uppercase tracking-wide">Industries</h4>
                  <div className="flex flex-wrap gap-1">
                    {INDUSTRIES.slice(0, 8).map(industry => (
                      <Badge
                        key={industry}
                        variant={filters.industries.includes(industry) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => handleFilterToggle('industries', industry)}
                      >
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Clear Search */}
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange('')}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {[...filters.platforms, ...filters.patterns, ...filters.industries].map(filter => (
            <Badge key={filter} variant="secondary" className="text-xs">
              {filter}
              <button
                onClick={() => {
                  if (PLATFORMS.includes(filter)) handleFilterToggle('platforms', filter);
                  else if (UX_PATTERNS.includes(filter)) handleFilterToggle('patterns', filter);
                  else if (INDUSTRIES.includes(filter)) handleFilterToggle('industries', filter);
                }}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-4 z-50 shadow-xl border border-slate-200">
          {suggestions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-1 text-blue-500" />
                Smart Suggestions
              </h4>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left p-2 hover:bg-slate-50 rounded-lg text-sm transition-colors"
                  >
                    <span className="text-slate-700">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!searchTerm && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <Command className="h-4 w-4 mr-1" />
                Popular Searches
              </h4>
              <div className="space-y-1">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="block w-full text-left p-2 hover:bg-slate-50 rounded-lg text-sm transition-colors"
                  >
                    <span className="text-slate-700">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Tips */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Search Tips</h4>
            <div className="text-xs text-slate-500 space-y-1">
              <p>• Try "how does [app] handle [feature]"</p>
              <p>• Search by UX pattern: "empty state", "onboarding"</p>
              <p>• Filter by industry: "fintech", "b2b", "ecommerce"</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

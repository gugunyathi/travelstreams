import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, X } from "lucide-react";
import { VideoCategory } from "@/types/video";

const CATEGORIES: VideoCategory[] = ['safety', 'fun', 'shopping', 'food', 'culture', 'nightlife', 'adventure', 'nature'];

interface StreamFiltersProps {
  selectedCategories: VideoCategory[];
  onCategoryToggle: (category: VideoCategory) => void;
  locationSearch: string;
  onLocationSearch: (location: string) => void;
  onClearFilters: () => void;
}

export const StreamFilters = ({
  selectedCategories,
  onCategoryToggle,
  locationSearch,
  onLocationSearch,
  onClearFilters,
}: StreamFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const closeSearch = () => {
    setShowSearch(false);
    setShowFilters(false);
  };

  return (
    <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2">
      {/* Search icon / expanded search row */}
      <div className="flex items-center gap-2">
        {/* Floating search toggle button */}
        <button
          onClick={() => setShowSearch(v => !v)}
          className={`w-10 h-10 rounded-full backdrop-blur-md border shadow-lg flex items-center justify-center transition-all ${
            showSearch || locationSearch
              ? 'bg-white/20 border-white/50 text-white'
              : 'bg-black/50 border-white/20 text-white hover:bg-black/70'
          }`}
          aria-label="Search location"
        >
          {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
        </button>

        {/* Expanding search input */}
        {showSearch && (
          <div className="relative flex items-center">
            <Input
              autoFocus
              type="text"
              placeholder="Search location..."
              value={locationSearch}
              onChange={(e) => onLocationSearch(e.target.value)}
              onFocus={() => setShowFilters(true)}
              className="w-44 sm:w-64 bg-black/70 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 text-sm pr-8"
            />
            {locationSearch && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                onClick={() => onLocationSearch("")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Active filter count badge */}
        {!showSearch && (selectedCategories.length > 0 || locationSearch) && (
          <button
            onClick={() => setShowSearch(true)}
            className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center -ml-3 -mt-4 shadow"
          >
            {selectedCategories.length + (locationSearch ? 1 : 0)}
          </button>
        )}
      </div>

      {/* Category Filters panel */}
      {showSearch && showFilters && (
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 space-y-3 border border-white/20 w-64 sm:w-80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white">Filter by Category</span>
            </div>
            {(selectedCategories.length > 0 || locationSearch) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-7 text-xs text-white/70 hover:text-white"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform capitalize"
                onClick={() => onCategoryToggle(category)}
              >
                {category}
                {selectedCategories.includes(category) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full border-white/20 text-white hover:bg-white/10"
            onClick={closeSearch}
          >
            Done
          </Button>
        </div>
      )}

      {/* Active filter chips (when search closed but filters active) */}
      {!showSearch && (selectedCategories.length > 0 || locationSearch) && (
        <div className="flex items-center gap-2 flex-wrap">
          {locationSearch && (
            <Badge variant="secondary" className="gap-1">
              <MapPin className="w-3 h-3" />
              {locationSearch}
            </Badge>
          )}
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="capitalize gap-1">
              {category}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onCategoryToggle(category)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

import { useState, useEffect, useMemo } from "react";
import { VideoCard } from "./VideoCard";
import { ActionBar } from "./ActionBar";
import { StreamFilters } from "./StreamFilters";
import { ContentSubmissionModal } from "./ContentSubmissionModal";
import { useVideos } from "@/hooks/useVideos";
import { useVideoPreloader } from "@/hooks/useVideoPreloader";
import { VideoCategory } from "@/types/video";
import { ChevronUp, ChevronDown, Play, Pause, Loader2 } from "lucide-react";

export const VideoFeed = () => {
  const { videos: apiVideos, loading, error } = useVideos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<VideoCategory[]>([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());

  // Filter videos based on selected categories and location
  const filteredVideos = useMemo(() => {
    let videos = apiVideos;

    if (selectedCategories.length > 0) {
      videos = videos.filter(video =>
        video.categories.some(cat => selectedCategories.includes(cat))
      );
    }

    if (locationSearch.trim()) {
      videos = videos.filter(video =>
        video.location.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
        video.location.country.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    // Prioritize loaded videos - put them first
    return videos.sort((a, b) => {
      const aLoaded = loadedVideos.has(a.id);
      const bLoaded = loadedVideos.has(b.id);
      if (aLoaded && !bLoaded) return -1;
      if (!aLoaded && bLoaded) return 1;
      return 0;
    });
  }, [apiVideos, selectedCategories, locationSearch, loadedVideos]);

  const currentVideo = filteredVideos[currentIndex];
  
  // Preload next videos for faster loading
  const { isPreloaded, preloadedCount } = useVideoPreloader(filteredVideos, currentIndex, 3);

  // Handle video end - auto-advance to next video
  const handleVideoEnd = () => {
    if (!isAutoPlaying) return;
    
    setCurrentIndex(prev => {
      // Loop back to start when reaching the end
      if (prev >= filteredVideos.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };

  // Track loaded videos
  const handleVideoLoaded = (videoId: string) => {
    setLoadedVideos(prev => new Set(prev).add(videoId));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > 50;
    const isSwipeDown = distance < -50;

    if (isSwipeUp) {
      // Swipe up - go to next video (with loop)
      setCurrentIndex(prev => (prev >= filteredVideos.length - 1) ? 0 : prev + 1);
      // Pause auto-play temporarily when user manually swipes
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000); // Resume after 5 seconds
    }

    if (isSwipeDown) {
      // Swipe down - go to previous video (with loop)
      setCurrentIndex(prev => (prev <= 0) ? filteredVideos.length - 1 : prev - 1);
      // Pause auto-play temporarily when user manually swipes
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000); // Resume after 5 seconds
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      // Arrow down - go to next video (with loop)
      setCurrentIndex(prev => (prev >= filteredVideos.length - 1) ? 0 : prev + 1);
      // Pause auto-play temporarily when user manually navigates
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000); // Resume after 5 seconds
    }
    if (e.key === "ArrowUp") {
      // Arrow up - go to previous video (with loop)
      setCurrentIndex(prev => (prev <= 0) ? filteredVideos.length - 1 : prev - 1);
      // Pause auto-play temporarily when user manually navigates
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000); // Resume after 5 seconds
    }
  };

  const handleWheel = (e: WheelEvent) => {
    // Throttle wheel events to prevent too rapid scrolling
    const now = Date.now();
    if (now - (handleWheel as any).lastScroll < 500) return;
    (handleWheel as any).lastScroll = now;

    if (e.deltaY > 0) {
      // Scroll down - go to next video (with loop)
      setCurrentIndex(prev => (prev >= filteredVideos.length - 1) ? 0 : prev + 1);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000);
    } else if (e.deltaY < 0) {
      // Scroll up - go to previous video (with loop)
      setCurrentIndex(prev => (prev <= 0) ? filteredVideos.length - 1 : prev - 1);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 5000);
    }
  };
  (handleWheel as any).lastScroll = 0;

  const handleCategoryToggle = (category: VideoCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentIndex(0); // Reset to first video when filter changes
  };

  const handleLocationSearch = (location: string) => {
    setLocationSearch(location);
    setCurrentIndex(0); // Reset to first video when search changes
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setLocationSearch("");
    setCurrentIndex(0);
  };

  // Reset index if it's out of bounds after filtering
  useEffect(() => {
    if (currentIndex >= filteredVideos.length && filteredVideos.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredVideos.length, currentIndex]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentIndex, filteredVideos.length]);

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-xl text-muted-foreground">Loading videos from database...</p>
        </div>
      </div>
    );
  }

  // Show error with fallback info
  if (error) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <p className="text-xl text-yellow-500">⚠️ API Connection Issue</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">Using local placeholder videos ({apiVideos.length} available)</p>
          <p className="text-xs text-muted-foreground">Note: All videos are stored in your Supabase database</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry Connection
          </button>
        </div>
        <StreamFilters
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          locationSearch={locationSearch}
          onLocationSearch={handleLocationSearch}
          onClearFilters={handleClearFilters}
        />
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl text-muted-foreground">No videos match your filters</p>
          <button
            onClick={handleClearFilters}
            className="text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
        <StreamFilters
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          locationSearch={locationSearch}
          onLocationSearch={handleLocationSearch}
          onClearFilters={handleClearFilters}
        />
        <ContentSubmissionModal />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-background"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stream Filters */}
      <StreamFilters
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        locationSearch={locationSearch}
        onLocationSearch={handleLocationSearch}
        onClearFilters={handleClearFilters}
      />

      {/* Video Card */}
      <div className="w-full h-full transition-transform duration-300 ease-out">
        <VideoCard 
          video={currentVideo} 
          onVideoEnd={handleVideoEnd}
          onVideoLoaded={handleVideoLoaded}
        />
      </div>

      {/* Navigation Indicators */}
      <div className="fixed right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 sm:gap-3 md:gap-4">
        {/* Auto-play toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/80 border border-white/20 hover:scale-105 active:scale-95"
          title={isAutoPlaying ? "Pause auto-play" : "Resume auto-play"}
        >
          {isAutoPlaying ? (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          )}
        </button>
        
        <button
          onClick={() => {
            // Go to previous video (with loop)
            setCurrentIndex(prev => (prev <= 0) ? filteredVideos.length - 1 : prev - 1);
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all border border-white/20 hover:bg-black/80 hover:scale-105 active:scale-95"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </button>
        <button
          onClick={() => {
            // Go to next video (with loop)
            setCurrentIndex(prev => (prev >= filteredVideos.length - 1) ? 0 : prev + 1);
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all border border-white/20 hover:bg-black/80 hover:scale-105 active:scale-95"
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </button>
      </div>

      {/* Progress Dots — hidden visually, state kept for functionality */}
      <div className="absolute top-14 sm:top-16 md:top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1 sm:gap-1.5 max-w-[90vw] overflow-x-auto scrollbar-hide px-4 invisible pointer-events-none">
        {filteredVideos.slice(0, 20).map((video, index) => (
          <div
            key={index}
            className="relative h-1 rounded-full overflow-hidden flex-shrink-0 transition-all duration-300"
            style={{ 
              width: index === currentIndex ? '24px' : '4px',
              backgroundColor: loadedVideos.has(video.id) 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            {index === currentIndex && (
              <div className="absolute inset-0 bg-primary animate-pulse" />
            )}
          </div>
        ))}
        {filteredVideos.length > 20 && (
          <div className="text-xs text-white/60 ml-2 flex items-center">
            +{filteredVideos.length - 20}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <ActionBar
        tokenSymbol={currentVideo.token.symbol}
        tokenPrice={currentVideo.token.price}
      />

      {/* Content Submission Button */}
      <ContentSubmissionModal />
    </div>
  );
};

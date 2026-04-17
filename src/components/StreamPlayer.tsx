import { useEffect, useState, useRef } from "react";
import { Stream, VideoContent } from "@/types/video";
import { VideoCard } from "./VideoCard";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Award } from "lucide-react";

interface StreamPlayerProps {
  stream: Stream;
  onVideoChange: (video: VideoContent, streamId: string) => void;
  onVideoEnd: (streamId: string) => void;
  autoPlay?: boolean;
  className?: string;
  streamCount?: number;
}

export const StreamPlayer = ({ 
  stream, 
  onVideoChange, 
  onVideoEnd,
  autoPlay = true,
  className = "",
  streamCount = 1
}: StreamPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoEndTimeoutRef = useRef<NodeJS.Timeout>();
  
  const currentVideo = stream.videos[currentIndex];

  const formatViewers = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  // Auto-advance to next video when current video ends
  useEffect(() => {
    if (!autoPlay || !currentVideo) return;

    // Clear any existing timeout
    if (videoEndTimeoutRef.current) {
      clearTimeout(videoEndTimeoutRef.current);
    }

    // Set timeout to advance to next video
    // Subtract 1 second for seamless transition
    const timeoutDuration = (currentVideo.duration - 1) * 1000;
    
    videoEndTimeoutRef.current = setTimeout(() => {
      handleVideoEnd();
    }, timeoutDuration);

    return () => {
      if (videoEndTimeoutRef.current) {
        clearTimeout(videoEndTimeoutRef.current);
      }
    };
  }, [currentIndex, autoPlay, currentVideo]);

  const handleVideoEnd = () => {
    setIsTransitioning(true);
    
    // Notify parent component
    onVideoEnd(stream.id);
    
    // Move to next video
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % stream.videos.length;
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
      
      // Notify parent of video change
      onVideoChange(stream.videos[nextIndex], stream.id);
    }, 300); // Smooth transition delay
  };

  const handleManualNext = () => {
    if (!isTransitioning) {
      handleVideoEnd();
    }
  };

  const handleManualPrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        const prevIndex = currentIndex === 0 ? stream.videos.length - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
        setIsTransitioning(false);
        onVideoChange(stream.videos[prevIndex], stream.id);
      }, 300);
    }
  };

  if (!currentVideo) return null;

  const isCompact = streamCount > 1;
  const isTriple = streamCount >= 3;

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Stream Tag Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent"
        style={{ padding: isCompact ? '6px 8px' : undefined }}
      >
        <div className={`flex items-center justify-between ${isCompact ? 'gap-1' : 'p-2 sm:p-4 gap-2 sm:gap-4'}`}>
          <Badge 
            className={`font-bold ${isCompact ? 'text-[10px] px-1.5 py-0.5' : 'text-sm sm:text-lg px-2 py-1 sm:px-4 sm:py-2 animate-pulse'}`}
            style={{ backgroundColor: stream.tag.color }}
          >
            {stream.tag.displayName}
          </Badge>
          
          <div className={`flex items-center text-white ${isCompact ? 'gap-1' : 'gap-2 sm:gap-4 text-xs sm:text-sm'}`}>
            <div className={`flex items-center gap-1 bg-black/50 rounded-full ${isCompact ? 'px-1.5 py-0.5' : 'px-2 py-1 sm:px-3 sm:py-1'}`}>
              <Users className={isCompact ? 'w-2.5 h-2.5' : 'w-3 h-3 sm:w-4 sm:h-4'} />
              <span className={isCompact ? 'text-[10px]' : ''}>
                {isCompact ? formatViewers(stream.activeViewers) : stream.activeViewers.toLocaleString()}
              </span>
            </div>
            {!isTriple && (
              <div className={`flex items-center gap-1 bg-black/50 rounded-full ${isCompact ? 'px-1.5 py-0.5' : 'px-2 py-1 sm:px-3 sm:py-1'}`}>
                <Award className={`text-yellow-400 ${isCompact ? 'w-2.5 h-2.5' : 'w-3 h-3 sm:w-4 sm:h-4'}`} />
                <span className={isCompact ? 'text-[10px]' : ''}>
                  {isCompact ? formatViewers(stream.xpPool) : stream.xpPool.toLocaleString()} XP
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Content with Transition */}
      <div 
        className={`h-full w-full transition-all duration-300 ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <VideoCard video={currentVideo} compact={isCompact} />
      </div>

      {/* Stream Progress Indicator */}
      {!isCompact && (
      <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 z-20 px-2 sm:px-4">
        <div className="flex items-center gap-0.5 sm:gap-1">
          {stream.videos.map((_, idx) => (
            <div
              key={idx}
              className={`h-0.5 sm:h-1 flex-1 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-white'
                  : idx < currentIndex
                  ? 'bg-white/50'
                  : 'bg-white/20'
              }`}
              style={{
                maxWidth: '40px'
              }}
            />
          ))}
        </div>
      </div>
      )}

      {/* XP Earned Notification */}
      {!isCompact && currentVideo.xpEarned > 0 && (
        <div className="absolute top-16 sm:top-20 right-2 sm:right-4 z-30 animate-slide-up">
          <div className="bg-yellow-500/90 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 shadow-lg">
            <Award className="w-3 h-3 sm:w-5 sm:h-5" />
            <span className="font-bold text-xs sm:text-base">+{currentVideo.xpEarned} XP</span>
          </div>
        </div>
      )}
    </div>
  );
};

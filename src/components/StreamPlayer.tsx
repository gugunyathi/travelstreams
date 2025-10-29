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
}

export const StreamPlayer = ({ 
  stream, 
  onVideoChange, 
  onVideoEnd,
  autoPlay = true,
  className = ""
}: StreamPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoEndTimeoutRef = useRef<NodeJS.Timeout>();
  
  const currentVideo = stream.videos[currentIndex];

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

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Stream Tag Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <Badge 
            className="text-lg font-bold px-4 py-2 animate-pulse"
            style={{ backgroundColor: stream.tag.color }}
          >
            {stream.tag.displayName}
          </Badge>
          
          <div className="flex items-center gap-4 text-white text-sm">
            <div className="flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full">
              <Users className="w-4 h-4" />
              <span>{stream.activeViewers.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>{stream.xpPool.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Content with Transition */}
      <div 
        className={`h-full w-full transition-all duration-300 ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <VideoCard video={currentVideo} />
      </div>

      {/* Stream Progress Indicator */}
      <div className="absolute bottom-20 left-0 right-0 z-20 px-4">
        <div className="flex items-center gap-1">
          {stream.videos.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
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

      {/* XP Earned Notification */}
      {currentVideo.xpEarned > 0 && (
        <div className="absolute top-20 right-4 z-30 animate-slide-up">
          <div className="bg-yellow-500/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Award className="w-5 h-5" />
            <span className="font-bold">+{currentVideo.xpEarned} XP</span>
          </div>
        </div>
      )}
    </div>
  );
};

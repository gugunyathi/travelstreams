import { useEffect, useRef } from 'react';
import { VideoContent } from '@/types/video';

/**
 * Hook to preload videos for faster playback
 * Adapts preloading strategy based on device capabilities
 */
export const useVideoPreloader = (
  videos: VideoContent[],
  currentIndex: number,
  preloadCount: number = 2
) => {
  const preloadedVideos = useRef<Set<string>>(new Set());
  const preloadElements = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    if (!videos.length) return;

    // Detect device capabilities
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const isSlowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g' || connection?.saveData;
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    
    // Adjust preload count based on device
    let adaptivePreloadCount = preloadCount;
    if (isSlowConnection) {
      adaptivePreloadCount = 1; // Only preload next video on slow connections
    } else if (isLowEndDevice) {
      adaptivePreloadCount = 2; // Preload 2 videos on low-end devices
    }

    // Clean up old preload elements
    preloadElements.current.forEach(el => {
      if (el.parentNode) {
        el.pause();
        el.src = '';
        el.load();
        el.parentNode.removeChild(el);
      }
    });
    preloadElements.current = [];

    // Preload current and next videos
    const videosToPreload: VideoContent[] = [];
    
    for (let i = 0; i <= adaptivePreloadCount; i++) {
      const index = (currentIndex + i) % videos.length;
      const video = videos[index];
      
      if (video && !preloadedVideos.current.has(video.videoUrl)) {
        videosToPreload.push(video);
      }
    }

    // Create hidden video elements to preload
    videosToPreload.forEach((video, idx) => {
      const videoElement = document.createElement('video');
      
      // Set attributes before src to ensure proper loading
      videoElement.preload = idx === 0 ? 'auto' : 'metadata'; // Full preload for next, metadata for others
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.style.display = 'none';
      videoElement.crossOrigin = 'anonymous';
      
      videoElement.addEventListener('loadeddata', () => {
        preloadedVideos.current.add(video.videoUrl);
        console.log(`✅ Preloaded: ${video.location.name} (${idx === 0 ? 'full' : 'metadata'})`);
      });
      
      videoElement.addEventListener('error', (e) => {
        // Silently handle errors - not all videos may be available yet
        preloadedVideos.current.delete(video.videoUrl);
      });

      // Set src after all attributes are configured
      videoElement.src = video.videoUrl;
      
      document.body.appendChild(videoElement);
      preloadElements.current.push(videoElement);
      
      // Load the video
      videoElement.load();
    });

    // Cleanup old preloaded entries (keep only last 15)
    if (preloadedVideos.current.size > 15) {
      const entries = Array.from(preloadedVideos.current);
      entries.slice(0, entries.length - 15).forEach(url => {
        preloadedVideos.current.delete(url);
      });
    }

    // Cleanup function
    return () => {
      preloadElements.current.forEach(el => {
        if (el.parentNode) {
          el.pause();
          el.src = '';
          el.load();
          el.parentNode.removeChild(el);
        }
      });
      preloadElements.current = [];
    };

  }, [currentIndex, videos, preloadCount]);

  return {
    isPreloaded: (videoUrl: string) => preloadedVideos.current.has(videoUrl),
    preloadedCount: preloadedVideos.current.size
  };
};

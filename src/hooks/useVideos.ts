import { useState, useEffect } from 'react';
import { VideoContent, VideoCategory } from '@/types/video';
import { VideoService } from '@/services/videoService';

// Check if Supabase is configured
const hasSupabaseConfig = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('🔧 Supabase configured:', hasSupabaseConfig);



export const useVideos = () => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchVideos = async () => {
      try {
        console.log('🔄 Fetching videos directly from Supabase...');
        setLoading(true);
        
        if (!hasSupabaseConfig) {
          throw new Error('Supabase configuration missing. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
        }
        
        // Use VideoService to fetch directly from Supabase
        const data = await VideoService.getAllVideos();
        
        console.log('✅ Successfully fetched data from Supabase');
        console.log('📊 Video count:', data.length);
        console.log('📦 Sample video:', data[0] ? {
          id: data[0].id,
          location: data[0].location?.name,
          duration: data[0].duration
        } : 'No videos');
        
        if (isMounted) {
          setVideos(data);
          setError(null);
          console.log(`✅ Loaded ${data.length} videos directly from Supabase`);
        }
      } catch (err) {
        console.error('❌ Error fetching videos from Supabase:');
        console.error('Error type:', err instanceof Error ? err.constructor.name : typeof err);
        console.error('Error message:', err instanceof Error ? err.message : String(err));
        
        console.error('🔄 Loading fallback videos...');
        
        if (isMounted) {
          // Import and use fallback videos
          import('@/data/mockVideos').then(({ fallbackVideos }) => {
            if (isMounted) {
              setVideos(fallbackVideos);
              setError(`Using fallback videos. ${err instanceof Error ? err.message : String(err)}`);
              console.log(`📦 Loaded ${fallbackVideos.length} fallback videos`);
            }
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVideos();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only fetch once on mount

  return { videos, loading, error };
};

export const useVideosByLocation = (locationId: string) => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchVideosByLocation = async () => {
      try {
        console.log(`🔄 Fetching videos for location ${locationId} directly from Supabase...`);
        setLoading(true);
        
        if (!hasSupabaseConfig) {
          throw new Error('Supabase configuration missing. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
        }
        
        // Use VideoService to fetch directly from Supabase
        const data = await VideoService.getVideosByLocation(locationId);
        
        if (isMounted) {
          setVideos(data);
          setError(null);
          console.log(`✅ Loaded ${data.length} videos for location ${locationId} directly from Supabase`);
        }
      } catch (err) {
        console.error(`❌ Error fetching videos for location ${locationId}:`, err);
        
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
          setVideos([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (locationId) {
      fetchVideosByLocation();
    }
    
    return () => {
      isMounted = false;
    };
  }, [locationId]);

  return { videos, loading, error };
};

export const videoApi = {
  getAllVideos: async (): Promise<VideoContent[]> => {
    try {
      return await VideoService.getAllVideos();
    } catch (error) {
      console.error('Error fetching all videos:', error);
      throw error;
    }
  },
  
  getVideosByLocation: async (locationId: string): Promise<VideoContent[]> => {
    try {
      return await VideoService.getVideosByLocation(locationId);
    } catch (error) {
      console.error(`Error fetching videos for location ${locationId}:`, error);
      throw error;
    }
  },
  
  getVideoStreamUrl: (storagePath: string): string => {
    return VideoService.getVideoStreamUrl(storagePath);
  }
};

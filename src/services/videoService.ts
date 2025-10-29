import { getSupabaseClient, getStorageClient } from '../lib/supabase';
import { VideoDocument, VideoResponse } from '../types/database';

const VIDEOS_TABLE = 'videos';
const VIDEOS_BUCKET = 'videos';

export class VideoService {
  static async getAllVideos(): Promise<VideoResponse[]> {
    try {
      const supabase = getSupabaseClient();
      const { data: videos, error } = await supabase
        .from(VIDEOS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return videos?.map(video => this.transformVideoDocument(video)) || [];
    } catch (error) {
      console.error('Error fetching videos from database:', error);
      throw error;
    }
  }

  static async getVideosByLocation(locationId: string): Promise<VideoResponse[]> {
    try {
      const supabase = getSupabaseClient();
      const { data: videos, error } = await supabase
        .from(VIDEOS_TABLE)
        .select('*')
        .eq('location_id', locationId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return videos?.map(video => this.transformVideoDocument(video)) || [];
    } catch (error) {
      console.error(`Error fetching videos for location ${locationId}:`, error);
      throw error;
    }
  }

  static async getVideoStream(storagePath: string): Promise<string> {
    try {
      const storage = getStorageClient();
      const { data } = storage.from(VIDEOS_BUCKET).getPublicUrl(storagePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting video stream URL:', error);
      // Fallback to API endpoint
      return `/api/videos/stream/${encodeURIComponent(storagePath)}`;
    }
  }

  private static transformVideoDocument(doc: VideoDocument): VideoResponse {
    return {
      id: doc.video_id,
      videoUrl: this.getVideoUrl(doc.storage_path),
      location: {
        id: doc.location_id,
        name: doc.location_name,
        country: doc.country,
        coordinates: doc.coordinates
      },
      creator: doc.creator,
      thumbnailUrl: doc.thumbnail_url || '',
      duration: doc.duration,
      views: doc.views,
      likes: doc.likes,
      viralityScore: doc.virality_score,
      token: doc.token,
      bettingPool: doc.betting_pool,
      paidToPost: doc.paid_to_post,
      categories: doc.categories,
      streamTags: doc.stream_tags,
      xpEarned: doc.xp_earned,
      createdAt: new Date(doc.created_at),
      updatedAt: new Date(doc.updated_at)
    };
  }

  private static getVideoUrl(storagePath: string): string {
    try {
      const storage = getStorageClient();
      const { data } = storage.from(VIDEOS_BUCKET).getPublicUrl(storagePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting video URL:', error);
      return `/api/videos/stream/${encodeURIComponent(storagePath)}`;
    }
  }

  static async uploadVideo(
    filename: string,
    fileBuffer: Buffer,
    metadata: Omit<VideoDocument, 'id' | 'filename' | 'storage_path' | 'created_at' | 'updated_at'>
  ): Promise<string> {
    try {
      const supabase = getSupabaseClient();
      const storage = getStorageClient();

      // Generate unique storage path
      const timestamp = Date.now();
      const storagePath = `${metadata.location_id}/${timestamp}_${filename}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await storage
        .from(VIDEOS_BUCKET)
        .upload(storagePath, fileBuffer, {
          contentType: 'video/mp4',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Save video metadata to database
      const videoDoc: Omit<VideoDocument, 'id' | 'created_at' | 'updated_at'> = {
        ...metadata,
        filename,
        storage_path: storagePath
      };

      const { data: insertData, error: insertError } = await supabase
        .from(VIDEOS_TABLE)
        .insert([videoDoc])
        .select()
        .single();

      if (insertError) {
        // Clean up uploaded file if database insert fails
        await storage.from(VIDEOS_BUCKET).remove([storagePath]);
        throw insertError;
      }

      return insertData.id;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  static async deleteVideo(videoId: string): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const storage = getStorageClient();

      // First get the video to find its storage path
      const { data: video, error: fetchError } = await supabase
        .from(VIDEOS_TABLE)
        .select('storage_path')
        .eq('video_id', videoId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Delete from storage
      const { error: storageError } = await storage
        .from(VIDEOS_BUCKET)
        .remove([video.storage_path]);

      if (storageError) {
        console.error('Error deleting video from storage:', storageError);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from(VIDEOS_TABLE)
        .delete()
        .eq('video_id', videoId);

      if (deleteError) {
        throw deleteError;
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }
}

import { supabase } from '@/lib/supabase';
import { VideoContent } from '@/types/video';

const VIDEOS_COLLECTION = 'videos';

/** Convert a Supabase row to VideoContent */
function rowToVideoContent(row: Record<string, unknown>): VideoContent {
  return {
    id: row.video_id as string,
    videoUrl: row.video_url as string,
    location: {
      id: row.location_id as string,
      name: row.location_name as string,
      country: row.country as string,
      coordinates: { lat: row.lat as number, lng: row.lng as number },
    },
    creator: {
      id: row.creator_id as string,
      username: row.creator_username as string,
      avatar: row.creator_avatar as string,
      xpPoints: row.creator_xp_points as number,
      totalEarnings: row.creator_total_earnings as number,
    },
    thumbnailUrl: (row.thumbnail_url as string | null) ?? '/placeholder.svg',
    duration: row.duration as number,
    views: row.views as number,
    likes: row.likes as number,
    viralityScore: row.virality_score as number,
    token: {
      symbol: row.token_symbol as string,
      price: row.token_price as number,
      change24h: row.token_change_24h as number,
      volume: row.token_volume as number,
      holders: row.token_holders as number,
      marketCap: row.token_market_cap as number,
    },
    bettingPool: row.betting_pool as number,
    paidToPost: row.paid_to_post as number,
    categories: row.categories as VideoContent['categories'],
    streamTags: row.stream_tags as string[],
    xpEarned: row.xp_earned as number,
    createdAt: new Date(row.created_at as string),
  };
}

export class VideoService {
  static async getAllVideos(): Promise<VideoContent[]> {
    const { data, error } = await supabase
      .from(VIDEOS_COLLECTION)
      .select('*')
      .order('virality_score', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(rowToVideoContent);
  }

  static async getVideosByLocation(locationId: string): Promise<VideoContent[]> {
    const { data, error } = await supabase
      .from(VIDEOS_COLLECTION)
      .select('*')
      .eq('location_id', locationId)
      .order('virality_score', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(rowToVideoContent);
  }

  static async getVideosByTag(tag: string): Promise<VideoContent[]> {
    const { data, error } = await supabase
      .from(VIDEOS_COLLECTION)
      .select('*')
      .contains('stream_tags', [tag])
      .order('virality_score', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(rowToVideoContent);
  }

  static async getTopVideos(limit = 10): Promise<VideoContent[]> {
    const { data, error } = await supabase
      .from(VIDEOS_COLLECTION)
      .select('*')
      .order('virality_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []).map(rowToVideoContent);
  }

  static async incrementView(videoId: string): Promise<void> {
    await supabase.rpc('increment_video_views', { p_video_id: videoId });
  }

  static async incrementLike(videoId: string): Promise<void> {
    await supabase.rpc('increment_video_likes', { p_video_id: videoId });
  }

  static async decrementLike(videoId: string): Promise<void> {
    await supabase.rpc('decrement_video_likes', { p_video_id: videoId });
  }

  /** Legacy – videos are now served from /public directly */
  static getVideoStreamUrl(videoUrl: string): string {
    return videoUrl;
  }
}


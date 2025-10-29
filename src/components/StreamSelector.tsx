import { StreamTag } from "@/types/video";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StreamSelectorProps {
  tags: StreamTag[];
  selectedTags: string[];
  onTagSelect: (tagName: string) => void;
  maxSelection?: number;
}

export const StreamSelector = ({ 
  tags, 
  selectedTags, 
  onTagSelect,
  maxSelection = 3
}: StreamSelectorProps) => {
  const canSelectMore = selectedTags.length < maxSelection;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select Streams</h3>
        <Badge variant="outline">
          {selectedTags.length}/{maxSelection} selected
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tags.map(tag => {
          const isSelected = selectedTags.includes(tag.name);
          const canSelect = canSelectMore || isSelected;

          return (
            <Card
              key={tag.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                isSelected 
                  ? 'ring-2 shadow-lg' 
                  : canSelect
                  ? 'hover:ring-1 hover:ring-primary/50'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              style={isSelected ? { 
                borderColor: tag.color,
                boxShadow: `0 0 20px ${tag.color}40`
              } : undefined}
              onClick={() => canSelect && onTagSelect(tag.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge 
                      className="text-base font-bold mb-2"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.displayName}
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        <span>{tag.videoCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span>{tag.totalXP.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <svg 
                        className="w-4 h-4 text-white" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={3} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Top Creators */}
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground font-medium">
                    Top Creators
                  </div>
                  <div className="flex -space-x-2">
                    {tag.topCreators.slice(0, 3).map(creator => (
                      <Avatar 
                        key={creator.id}
                        className="w-8 h-8 border-2 border-background"
                      >
                        <AvatarImage src={creator.avatar} alt={creator.username} />
                        <AvatarFallback>
                          {creator.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { VideoCategory } from "@/types/video";
import { useToast } from "@/hooks/use-toast";
import { BasePay } from "./BasePay";
import { useAccount } from "wagmi";

const CATEGORIES: VideoCategory[] = ['safety', 'fun', 'shopping', 'food', 'culture', 'nightlife', 'adventure', 'nature'];

export const ContentSubmissionModal = () => {
  const [open, setOpen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");
  const [location, setLocation] = useState("");
  const { isConnected } = useAccount();
  const [selectedCategories, setSelectedCategories] = useState<VideoCategory[]>([]);
  const { toast } = useToast();

  const toggleCategory = (category: VideoCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!embedUrl || !location || selectedCategories.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select at least one category",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Content Submitted! 🎉",
      description: `Your content will be added to ${location} stream with ${selectedCategories.length} tags`,
    });

    // Reset form
    setEmbedUrl("");
    setLocation("");
    setSelectedCategories([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:scale-110 transition-transform"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Post to Stream</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="embedUrl">Content URL</Label>
            <Input
              id="embedUrl"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">YouTube, TikTok, Instagram, or direct video URL</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g. Gaborone, Lagos, Nairobi..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categories (Select at least one)</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform capitalize"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                  {selectedCategories.includes(category) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <BasePay
            amount={0.10}
            disabled={!isConnected || selectedCategories.length === 0 || !location.trim() || !embedUrl.trim()}
            onSuccess={() => {
              toast({
                title: "Content submitted!",
                description: "Your video has been posted to the stream",
              });
              setOpen(false);
              // Reset form
              setEmbedUrl("");
              setLocation("");
              setSelectedCategories([]);
            }}
          >
            Post to Stream ($0.10)
          </BasePay>
        </form>
      </DialogContent>
    </Dialog>
  );
};

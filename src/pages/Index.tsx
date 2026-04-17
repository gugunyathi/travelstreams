import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { VideoFeed } from "@/components/VideoFeed";
import { MultiStreamViewer } from "@/components/MultiStreamViewer";
import { SlotMachineViewer } from "@/components/SlotMachineViewer";
import { StreamSelector } from "@/components/StreamSelector";
import { ConnectWallet } from "@/components/ConnectWallet";
import { mockStreams, streamTags } from "@/data/mockStreams";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Layers, 
  Sparkles, 
  Menu, 
  Settings, 
  Play,
  Maximize2,
  Columns2,
  Columns3,
  Filter,
  Home,
  ArrowLeft,
} from "lucide-react";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const viewMode = (searchParams.get('view') as 'classic' | 'streams' | 'slots') || 'classic';

  const setViewMode = (mode: 'classic' | 'streams' | 'slots') => {
    if (mode === 'classic') {
      setSearchParams({});
    } else {
      setSearchParams({ view: mode });
    }
  };

  const goBack = () => navigate(-1);

  const [selectedStreamTags, setSelectedStreamTags] = useState<string[]>(['Bali']);
  const [streamViewMode, setStreamViewMode] = useState<'single' | 'split-2' | 'split-3'>('single');

  const handleTagSelect = (tagName: string) => {
    setSelectedStreamTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(t => t !== tagName);
      }
      return [...prev, tagName];
    });
  };

  const selectedStreams = mockStreams.filter(stream => 
    selectedStreamTags.includes(stream.tag.name)
  );

  return (
    <div className="min-h-screen bg-background relative">

      {/* Floating Left-Centre Controls */}
      <div className="fixed left-3 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2">

        {/* Back button — only when not in classic feed */}
        {viewMode !== 'classic' && (
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full backdrop-blur-md bg-black/50 border border-white/20 hover:bg-black/70 flex items-center justify-center shadow-lg transition-all"
            aria-label="Back to feed"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Burger menu — view modes + stream layout */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-10 h-10 rounded-full backdrop-blur-md bg-black/50 border border-white/20 hover:bg-black/70 flex items-center justify-center shadow-lg transition-all">
              <Menu className="w-5 h-5 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="ml-2 w-[200px]">
            <DropdownMenuLabel className="text-xs">View Mode</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setViewMode('classic')}
              className={viewMode === 'classic' ? 'bg-accent' : ''}
            >
              <Home className="w-4 h-4 mr-2" />
              Classic Feed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setViewMode('streams')}
              className={viewMode === 'streams' ? 'bg-accent' : ''}
            >
              <Play className="w-4 h-4 mr-2" />
              Live Streams
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setViewMode('slots')}
              className={viewMode === 'slots' ? 'bg-accent' : ''}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Video Slots
            </DropdownMenuItem>
            {viewMode === 'streams' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">Stream Layout</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setStreamViewMode('single')}
                  className={streamViewMode === 'single' ? 'bg-accent' : ''}
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Single
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStreamViewMode('split-2')}
                  className={streamViewMode === 'split-2' ? 'bg-accent' : ''}
                >
                  <Columns2 className="w-4 h-4 mr-2" />
                  Split 2
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStreamViewMode('split-3')}
                  className={streamViewMode === 'split-3' ? 'bg-accent' : ''}
                >
                  <Columns3 className="w-4 h-4 mr-2" />
                  Split 3
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings gear */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="w-10 h-10 rounded-full backdrop-blur-md bg-black/50 border border-white/20 hover:bg-black/70 flex items-center justify-center shadow-lg transition-all">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px]">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Layers className="w-4 h-4 mr-2" />
                    Choose Streams
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Select Streams</SheetTitle>
                    <SheetDescription>Pick up to 3 streams to watch simultaneously</SheetDescription>
                  </SheetHeader>
                  <div className="mt-4">
                    <StreamSelector
                      tags={streamTags}
                      selectedTags={selectedStreamTags}
                      onTagSelect={handleTagSelect}
                      maxSelection={3}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <Button variant="outline" className="w-full justify-start">
                <Filter className="w-4 h-4 mr-2" />
                Content Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Connect Wallet — floating top-right */}
      <div className="fixed top-3 right-3 z-50">
        <ConnectWallet />
      </div>

      {/* Floating SLOTS button — right centre */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => setViewMode(viewMode === 'slots' ? 'classic' : 'slots')}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            viewMode === 'slots'
              ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 scale-110'
              : 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 hover:scale-105'
          }`}
          aria-label="Toggle slots"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Full-screen content */}
      <div className="w-full h-screen">
        {viewMode === 'slots' ? (
          <SlotMachineViewer
            streams={mockStreams.slice(0, 3)}
            onBack={goBack}
          />
        ) : viewMode === 'streams' && selectedStreams.length > 0 ? (
          <MultiStreamViewer
            availableStreams={mockStreams}
            initialMode={streamViewMode}
            onBack={goBack}
          />
        ) : (
          <VideoFeed />
        )}
      </div>
    </div>
  );
};

export default Index;

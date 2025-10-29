import { useState } from "react";
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
  Grid3x3, 
  Sparkles, 
  Menu, 
  Settings, 
  Play,
  Maximize2,
  Columns2,
  Columns3,
  Filter,
  Home,
  ArrowLeft
} from "lucide-react";

const Index = () => {
  const [viewMode, setViewMode] = useState<'classic' | 'streams' | 'slots'>('classic');
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
    <main className="min-h-screen bg-background relative">
      {/* Back Button - Show when not in classic mode */}
      {viewMode !== 'classic' && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            onClick={() => setViewMode('classic')}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full backdrop-blur-sm bg-black/60 border-white/20 hover:bg-black/80 shadow-lg"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Mobile: Vertical Left Navigation Bar */}
      <div className="fixed left-2 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 sm:hidden">
        {/* Left Burger Menu - Navigation & View Modes */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="h-10 w-10 rounded-full backdrop-blur-sm bg-black/60 border-white/20 hover:bg-black/80"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="w-[200px]">
            <DropdownMenuLabel className="text-xs">View Modes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => setViewMode('classic')}
              className={`text-xs ${viewMode === 'classic' ? 'bg-accent' : ''}`}
            >
              <Home className="w-3 h-3 mr-2" />
              Classic Feed
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => setViewMode('streams')}
              className={`text-xs ${viewMode === 'streams' ? 'bg-accent' : ''}`}
            >
              <Play className="w-3 h-3 mr-2" />
              Live Streams
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => setViewMode('slots')}
              className={`text-xs ${viewMode === 'slots' ? 'bg-accent' : ''}`}
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Video Slots
            </DropdownMenuItem>
            
            {viewMode === 'streams' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">Stream Layout</DropdownMenuLabel>
                
                <DropdownMenuItem 
                  onClick={() => setStreamViewMode('single')}
                  className={`text-xs ${streamViewMode === 'single' ? 'bg-accent' : ''}`}
                >
                  <Maximize2 className="w-3 h-3 mr-2" />
                  Single Stream
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => setStreamViewMode('split-2')}
                  className={`text-xs ${streamViewMode === 'split-2' ? 'bg-accent' : ''}`}
                >
                  <Columns2 className="w-3 h-3 mr-2" />
                  Split View (2)
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => setStreamViewMode('split-3')}
                  className={`text-xs ${streamViewMode === 'split-3' ? 'bg-accent' : ''}`}
                >
                  <Columns3 className="w-3 h-3 mr-2" />
                  Triple View (3)
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="h-10 w-10 rounded-full backdrop-blur-sm bg-black/60 border-white/20 hover:bg-black/80"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="w-[200px]">
            <DropdownMenuLabel className="text-xs">Stream Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <Sheet>
              <SheetTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-xs">
                  <Layers className="w-3 h-3 mr-2" />
                  Choose Streams
                </DropdownMenuItem>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Choose Your Streams</SheetTitle>
                  <SheetDescription>
                    Select up to 3 streams to watch simultaneously
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <StreamSelector
                    tags={streamTags}
                    selectedTags={selectedStreamTags}
                    onTagSelect={handleTagSelect}
                    maxSelection={3}
                  />
                </div>
              </SheetContent>
            </Sheet>
            
            <DropdownMenuItem className="text-xs">
              <Filter className="w-3 h-3 mr-2" />
              Content Filters
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="text-xs text-muted-foreground">
              Quality Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem className="text-xs text-muted-foreground">
              Notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop: Top Navigation */}
      <div className="hidden sm:block absolute top-4 left-4 right-4 z-50">
        <div className="flex items-center justify-between">
          
          {/* Left Burger Menu - Navigation & View Modes */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10 rounded-full backdrop-blur-sm bg-white/10 border-white/20"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[240px]">
              <DropdownMenuLabel className="text-sm">View Modes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => setViewMode('classic')}
                className={`text-sm ${viewMode === 'classic' ? 'bg-accent' : ''}`}
              >
                <Home className="w-4 h-4 mr-2" />
                Classic Feed
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => setViewMode('streams')}
                className={`text-sm ${viewMode === 'streams' ? 'bg-accent' : ''}`}
              >
                <Play className="w-4 h-4 mr-2" />
                Live Streams
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => setViewMode('slots')}
                className={`text-sm ${viewMode === 'slots' ? 'bg-accent' : ''}`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Video Slots
              </DropdownMenuItem>
              
              {viewMode === 'streams' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-sm">Stream Layout</DropdownMenuLabel>
                  
                  <DropdownMenuItem 
                    onClick={() => setStreamViewMode('single')}
                    className={`text-sm ${streamViewMode === 'single' ? 'bg-accent' : ''}`}
                  >
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Single Stream
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => setStreamViewMode('split-2')}
                    className={`text-sm ${streamViewMode === 'split-2' ? 'bg-accent' : ''}`}
                  >
                    <Columns2 className="w-4 h-4 mr-2" />
                    Split View (2)
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => setStreamViewMode('split-3')}
                    className={`text-sm ${streamViewMode === 'split-3' ? 'bg-accent' : ''}`}
                  >
                    <Columns3 className="w-4 h-4 mr-2" />
                    Triple View (3)
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Center Logo/Title */}
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              TravelStreamz
            </h1>
          </div>

          {/* Right Side - Wallet + Settings */}
          <div className="flex items-center gap-2">
            <ConnectWallet />
            
            {/* Right Burger Menu - Settings & Filters */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-10 w-10 rounded-full backdrop-blur-sm bg-white/10 border-white/20"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px]">
                <DropdownMenuLabel className="text-sm">Stream Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <Sheet>
                  <SheetTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-sm">
                      <Layers className="w-4 h-4 mr-2" />
                      Choose Streams
                    </DropdownMenuItem>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Choose Your Streams</SheetTitle>
                      <SheetDescription>
                        Select up to 3 streams to watch simultaneously
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <StreamSelector
                        tags={streamTags}
                        selectedTags={selectedStreamTags}
                        onTagSelect={handleTagSelect}
                        maxSelection={3}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
                
                <DropdownMenuItem className="text-sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Content Filters
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="text-sm text-muted-foreground">
                  Quality Settings
                </DropdownMenuItem>
                
                <DropdownMenuItem className="text-sm text-muted-foreground">
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile: Top Right - Wallet Only */}
      <div className="fixed top-2 right-2 z-50 sm:hidden">
        <ConnectWallet />
      </div>

      {/* Floating SLOTS Button - Middle Right */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          onClick={() => setViewMode('slots')}
          size="lg"
          className={`h-16 w-16 rounded-full shadow-2xl transition-all duration-300 ${
            viewMode === 'slots'
              ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 hover:scale-110'
              : 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 hover:scale-105'
          }`}
        >
          <Sparkles className="h-8 w-8" />
        </Button>
      </div>

      {/* Main Content */}
      {viewMode === 'slots' ? (
        <SlotMachineViewer 
          streams={mockStreams.slice(0, 3)} 
          onBack={() => setViewMode('classic')}
        />
      ) : viewMode === 'streams' && selectedStreams.length > 0 ? (
        <MultiStreamViewer 
          availableStreams={mockStreams}
          initialMode={streamViewMode}
          onBack={() => setViewMode('classic')}
        />
      ) : (
        <VideoFeed />
      )}
    </main>
  );
};

export default Index;

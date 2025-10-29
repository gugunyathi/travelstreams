import { Button } from "@/components/ui/button";
import { TrendingUp, ShoppingCart, Wallet, DollarSign, X } from "lucide-react";
import { useState } from "react";
import { BasePay } from "./BasePay";
import { useAccount } from "wagmi";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ActionBarProps {
  tokenSymbol: string;
  tokenPrice: number;
}

export const ActionBar = ({ tokenSymbol, tokenPrice }: ActionBarProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [buyAmount, setBuyAmount] = useState(100);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isConnected } = useAccount();

  return (
    <>
      {/* Floating Action Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 z-30 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label="Open trading panel"
        >
          <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:rotate-12 transition-transform" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 animate-ping opacity-20" />
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="fixed bottom-0 left-0 right-0 z-30 animate-slide-up">
          <div className="bg-gradient-to-t from-black via-black/95 to-transparent pt-8 pb-6 px-6">
            {/* Close Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Close trading panel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Token Info Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 mb-4 border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Token</div>
                  <div className="text-2xl font-bold">${tokenSymbol}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Price</div>
                  <div className="text-2xl font-bold">${tokenPrice.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-red-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>-5.5%</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Wallet className="w-3 h-3" />
                  <span>Vol: $158.8K</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>👥 5.0K</span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-900/50 rounded-xl p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">Views</div>
                <div className="text-lg font-bold">70.3K</div>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">XP Earned</div>
                <div className="text-lg font-bold text-yellow-400">+204</div>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-3 text-center">
                <div className="text-xs text-muted-foreground mb-1">Betting Pool</div>
                <div className="text-lg font-bold text-green-400">$47.4K</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="w-3 h-3" />
                <span>{isConnected ? "Connected to Base" : "Connect wallet"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-crypto-green">
                <TrendingUp className="w-3 h-3" />
                <span>+$45.20 today</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="h-14 bg-gradient-viral hover:opacity-90 transition-opacity text-foreground font-bold text-lg rounded-2xl shadow-glow"
                    disabled={!isConnected}
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Bet ${betAmount}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Bet on Virality</DialogTitle>
                    <DialogDescription>
                      Bet ${betAmount} that this video will go viral using Base Pay
                    </DialogDescription>
                  </DialogHeader>
                  <BasePay
                    amount={betAmount}
                    onSuccess={() => console.log(`Successfully bet $${betAmount} on virality`)}
                  >
                    Place Bet
                  </BasePay>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="h-14 bg-gradient-base hover:opacity-90 transition-opacity text-foreground font-bold text-lg rounded-2xl shadow-glow"
                    disabled={!isConnected}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Buy ${buyAmount}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Buy {tokenSymbol} Token</DialogTitle>
                    <DialogDescription>
                      Purchase ${buyAmount} worth of {tokenSymbol} tokens using Base Pay
                    </DialogDescription>
                  </DialogHeader>
                  <BasePay
                    amount={buyAmount}
                    onSuccess={() => console.log(`Successfully bought $${buyAmount} of ${tokenSymbol}`)}
                  >
                    Buy Tokens
                  </BasePay>
                </DialogContent>
              </Dialog>
            </div>

            {/* Quick Action Chips */}
            <div className="flex gap-2 mt-3">
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setBetAmount(amount);
                    setBuyAmount(amount);
                  }}
                  className="flex-1 px-3 py-2 bg-muted/50 hover:bg-muted transition-colors rounded-lg text-sm font-medium text-foreground"
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Base Pay Badge */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-base-blue/20 rounded-full border border-base-blue">
                <div className="w-2 h-2 bg-base-blue rounded-full animate-pulse" />
                <span className="text-xs font-medium text-base-blue">Powered by Base Pay</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

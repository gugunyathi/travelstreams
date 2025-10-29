import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Wallet, LogOut, Copy, ExternalLink, Coins } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatEther } from 'viem'

export function ConnectWallet() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()
  const { data: balance } = useBalance({
    address: address,
  })

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard"
      })
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border-2 border-blue-400"
          >
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-[280px] sm:w-80">
          <div className="p-3">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-sm sm:text-base font-bold">
                  {address.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs sm:text-sm font-semibold truncate">{formatAddress(address)}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">
                  {chain?.name || 'Unknown Network'}
                </div>
              </div>
            </div>
            
            {/* Wallet Balance */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Coins className="w-4 h-4" />
                  <span className="text-xs font-medium">Balance</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">ETH</span>
                  <span className="text-sm sm:text-base font-bold">
                    {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'}
                  </span>
                </div>
                {/* Placeholder for other tokens */}
                <div className="flex items-center justify-between opacity-50">
                  <span className="text-xs text-muted-foreground">USDC</span>
                  <span className="text-xs">0.00</span>
                </div>
                <div className="flex items-center justify-between opacity-50">
                  <span className="text-xs text-muted-foreground">VIRAL</span>
                  <span className="text-xs">0.00</span>
                </div>
              </div>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer text-xs sm:text-sm">
            <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <a 
              href={`https://sepolia.basescan.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-xs sm:text-sm"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              View on BaseScan
            </a>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => disconnect()} 
            className="cursor-pointer text-destructive text-xs sm:text-sm"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
        >
          <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[200px] sm:w-56">
        <div className="p-2 mb-2">
          <h4 className="font-semibold text-xs sm:text-sm mb-1">Connect a Wallet</h4>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Connect to Base Sepolia testnet to start trading
          </p>
        </div>
        
        <DropdownMenuSeparator />
        
        {connectors.map((connector) => (
          <DropdownMenuItem
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="cursor-pointer text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-muted rounded flex items-center justify-center">
                {connector.name === 'Coinbase Wallet' && (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded" />
                )}
                {connector.name !== 'Coinbase Wallet' && (
                  <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </div>
              <span>{connector.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
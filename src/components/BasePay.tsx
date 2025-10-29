import { useState } from 'react'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BasePayProps {
  amount: number // Amount in USD
  onSuccess?: () => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

// Base Sepolia ETH contract address (native ETH payments)
const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'

export function BasePay({ 
  amount, 
  onSuccess, 
  disabled = false, 
  className,
  children 
}: BasePayProps) {
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  
  // For demo purposes, we'll use a simple ETH price conversion
  // In production, you'd want to fetch real-time ETH/USD rates
  const ethAmount = amount / 2500 // Approximate ETH price

  const { 
    sendTransaction, 
    data: hash,
    isPending,
    error 
  } = useSendTransaction()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handlePayment = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a payment",
        variant: "destructive"
      })
      return
    }

    try {
      setIsProcessing(true)
      
      // For demonstration, we'll send ETH to a demo address
      // In production, this would be your payment processor contract
      const demoPaymentAddress = '0x1234567890123456789012345678901234567890'
      
      sendTransaction({
        to: demoPaymentAddress as `0x${string}`,
        value: parseEther(ethAmount.toString()),
      })
      
    } catch (err) {
      console.error('Payment failed:', err)
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment",
        variant: "destructive"
      })
      setIsProcessing(false)
    }
  }

  // Handle successful transaction
  if (isSuccess && onSuccess) {
    onSuccess()
    setIsProcessing(false)
    toast({
      title: "Payment successful!",
      description: `Successfully paid $${amount} via Base Pay`,
    })
  }

  // Handle transaction error
  if (error) {
    setIsProcessing(false)
    toast({
      title: "Transaction failed",
      description: error.message,
      variant: "destructive"
    })
  }

  const isLoading = isPending || isConfirming || isProcessing

  return (
    <div className="space-y-3">
      {/* Payment Info */}
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <span className="text-sm font-medium">Base Pay</span>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold">${amount}</div>
          <div className="text-xs text-muted-foreground">
            ≈ {ethAmount.toFixed(6)} ETH
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <Button 
        onClick={handlePayment}
        disabled={disabled || isLoading || !isConnected}
        className={`w-full h-12 bg-blue-600 hover:bg-blue-700 text-white ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Preparing...'}
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Payment Complete
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            {children || `Pay $${amount} with Base Pay`}
          </>
        )}
      </Button>

      {/* Base Network Badge */}
      <div className="flex justify-center">
        <Badge variant="outline" className="text-xs">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-1" />
          Base Sepolia Testnet
        </Badge>
      </div>

      {/* Transaction Hash */}
      {hash && (
        <div className="text-xs text-muted-foreground text-center">
          <a 
            href={`https://sepolia.basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View transaction
          </a>
        </div>
      )}
    </div>
  )
}
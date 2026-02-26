'use client'

import { motion } from 'framer-motion'

interface BalanceCardProps {
  balance: number
  accountNumber: string
  fullName: string
}

export default function BalanceCard({ balance, accountNumber, fullName }: BalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 shadow-xl"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/70 text-sm">Total Balance</p>
            <p className="text-white/50 text-xs mt-1">{accountNumber}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-xl">Z</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            {formatCurrency(balance)}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-semibold">
              {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">{fullName}</p>
            <p className="text-white/50 text-xs">Active Account</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Transaction } from '@/types'

interface TransactionListProps {
  transactions: Transaction[]
  currentAccount: string
}

export default function TransactionList({ transactions, currentAccount }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="text-accent" size={16} />
      case 'PENDING':
      case 'PROCESSING':
        return <Clock className="text-yellow-400" size={16} />
      case 'FAILED':
        return <XCircle className="text-red-400" size={16} />
      default:
        return <Clock className="text-gray-400" size={16} />
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-gray-400">No transactions yet</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h3 className="font-semibold">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-white/5">
        {transactions.map((tx, index) => {
          const isOutgoing = tx.sourceAccount === currentAccount && tx.type === 'TRANSFER'
          const isIncoming = tx.destinationAccount === currentAccount && tx.type !== 'TRANSFER'
          
          return (
            <Link key={tx.id} href={`/transactions/${tx.transactionRef}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isOutgoing ? 'bg-red-500/20' : 'bg-accent/20'
                }`}>
                  {isOutgoing ? (
                    <ArrowUpRight className="text-red-400" size={24} />
                  ) : (
                    <ArrowDownLeft className="text-accent" size={24} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">
                      {tx.type === 'TOP_UP' ? 'Top Up' : isOutgoing ? 'Transfer Out' : 'Transfer In'}
                    </p>
                    {getStatusIcon(tx.status)}
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {tx.type === 'TOP_UP' 
                      ? 'Payment Gateway' 
                      : isOutgoing 
                        ? `To: ${tx.destinationAccount}` 
                        : `From: ${tx.sourceAccount}`}
                  </p>
                  {tx.description && (
                    <p className="text-xs text-gray-500 truncate">{tx.description}</p>
                  )}
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${isOutgoing ? 'text-red-400' : 'text-accent'}`}>
                    {isOutgoing ? '-' : '+'}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                </div>
              </div>
            </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

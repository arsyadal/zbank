'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Hash,
  Calendar,
  FileText,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { transactionApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { Transaction } from '@/types'

function TransactionDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const ref = params.ref as string

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await transactionApi.getByRef(ref)
        setTransaction(res.data)
      } catch (error) {
        console.error('Failed to fetch transaction:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (ref) fetchTransaction()
  }, [ref])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { icon: CheckCircle, color: 'text-accent', bg: 'bg-accent/20', label: 'Completed' }
      case 'PENDING':
      case 'PROCESSING':
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/20', label: status }
      case 'FAILED':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/20', label: 'Failed' }
      default:
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-400/20', label: status }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-400 text-lg">Transaction not found.</p>
        <button onClick={() => router.back()} className="btn-secondary">
          Go Back
        </button>
      </div>
    )
  }

  const isOutgoing = transaction.sourceAccount === user?.accountNumber && transaction.type === 'TRANSFER'
  const statusConfig = getStatusConfig(transaction.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold">Transaction Detail</h1>
        <p className="text-gray-400">Full transaction information</p>
      </motion.div>

      {/* Amount card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <div className={`w-16 h-16 rounded-2xl ${isOutgoing ? 'bg-red-500/20' : 'bg-accent/20'} flex items-center justify-center mx-auto mb-4`}>
          {isOutgoing ? (
            <ArrowUpRight className="text-red-400" size={32} />
          ) : (
            <ArrowDownLeft className="text-accent" size={32} />
          )}
        </div>
        <p className="text-gray-400 mb-2">
          {transaction.type === 'TOP_UP' ? 'Top Up' : isOutgoing ? 'Transfer Out' : 'Transfer In'}
        </p>
        <p className={`text-4xl font-bold ${isOutgoing ? 'text-red-400' : 'text-accent'}`}>
          {isOutgoing ? '-' : '+'}{formatCurrency(transaction.amount)}
        </p>

        <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full ${statusConfig.bg}`}>
          <StatusIcon className={statusConfig.color} size={16} />
          <span className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
        </div>
      </motion.div>

      {/* Details card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 space-y-4"
      >
        <h2 className="font-semibold text-lg border-b border-white/5 pb-3">Details</h2>

        <DetailRow icon={Hash} label="Reference" value={transaction.transactionRef} mono />
        <DetailRow icon={FileText} label="Type" value={transaction.type} />
        <DetailRow
          icon={ArrowUpRight}
          label="From"
          value={transaction.sourceAccount === 'EXTERNAL' ? 'Payment Gateway' : transaction.sourceAccount}
          mono
        />
        <DetailRow icon={ArrowDownLeft} label="To" value={transaction.destinationAccount} mono />
        {transaction.description && (
          <DetailRow icon={FileText} label="Description" value={transaction.description} />
        )}
        <DetailRow icon={Calendar} label="Created At" value={formatDate(transaction.createdAt)} />
        {transaction.processedAt && (
          <DetailRow icon={Calendar} label="Processed At" value={formatDate(transaction.processedAt)} />
        )}
      </motion.div>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: any
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mt-0.5 flex-shrink-0">
        <Icon size={14} className="text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className={`text-sm break-all ${mono ? 'font-mono text-accent' : 'text-white'}`}>{value}</p>
      </div>
    </div>
  )
}

export default function TransactionDetailPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <TransactionDetailContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

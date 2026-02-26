'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import TransactionList from '@/components/ui/TransactionList'
import { transactionApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { Transaction } from '@/types'

function HistoryContent() {
  const { user } = useAuthStore()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const PAGE_SIZE = 20

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true)
      try {
        const res = await transactionApi.getHistory(page, PAGE_SIZE)
        setTransactions(res.data.content || [])
        setTotalPages(res.data.totalPages || 0)
        setTotalElements(res.data.totalElements || 0)
      } catch (error) {
        console.error('Failed to fetch history:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [page])

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-gray-400">
            {totalElements > 0 ? `${totalElements} total transactions` : 'All your transactions'}
          </p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TransactionList
            transactions={transactions}
            currentAccount={user?.accountNumber || ''}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 glass rounded-2xl p-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <span className="text-sm text-gray-400">
                Page <span className="text-white font-semibold">{page + 1}</span> of{' '}
                <span className="text-white font-semibold">{totalPages}</span>
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <HistoryContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

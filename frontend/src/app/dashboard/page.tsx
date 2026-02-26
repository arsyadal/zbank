'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Clock } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import BalanceCard from '@/components/ui/BalanceCard'
import TransactionList from '@/components/ui/TransactionList'
import { accountApi, transactionApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { useWebSocket } from '@/hooks/useWebSocket'
import { DashboardData, Transaction } from '@/types'

function DashboardContent() {
  const { user } = useAuthStore()
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useWebSocket(dashboard?.accountNumber)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, txRes] = await Promise.all([
          accountApi.getDashboard(),
          transactionApi.getHistory(0, 10),
        ])
        setDashboard(dashboardRes.data)
        setTransactions(txRes.data.content || [])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {dashboard?.fullName}</p>
        </div>
      </div>

      {dashboard && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BalanceCard
              balance={dashboard.balance}
              accountNumber={dashboard.accountNumber}
              fullName={dashboard.fullName}
            />
          </div>
          
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <ArrowUpRight className="text-accent" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Transactions</p>
                  <p className="text-2xl font-bold">{dashboard.totalTransactions}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <Clock className="text-primary-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Today</p>
                  <p className="text-2xl font-bold">{dashboard.todayTransactions}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <div>
        <TransactionList 
          transactions={transactions} 
          currentAccount={user?.accountNumber || ''} 
        />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

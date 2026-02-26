'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, CreditCard } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { externalApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import toast from 'react-hot-toast'

function TopUpContent() {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    reference: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await externalApi.topUp(user?.accountNumber || '', {
        amount: parseFloat(formData.amount),
        reference: formData.reference || undefined,
      })
      
      toast.success('Top-up successful!')
      setFormData({ amount: '', reference: '' })
    } catch (error: any) {
      const message = error.response?.data?.message || 'Top-up failed'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Top Up</h1>
        <p className="text-gray-400">Add funds via Payment Gateway simulation</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center shrink-0">
          <CreditCard className="text-primary-400" size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-400">Account Number</p>
          <p className="text-lg font-semibold truncate">{user?.accountNumber}</p>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-3">Quick Amount</label>
          <div className="grid grid-cols-3 gap-3">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  formData.amount === amount.toString()
                    ? 'bg-accent text-dark'
                    : 'glass hover:bg-white/10'
                }`}
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Custom Amount (IDR)</label>
          <div className="input-with-icon">
            <span className="icon font-medium">Rp</span>
            <input
              type="number"
              required
              min="10000"
              step="1000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter amount"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Reference (optional)</label>
          <input
            type="text"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            className="input-field"
            placeholder="Payment reference"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.amount}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
          ) : (
            <>
              <Plus size={20} /> Top Up Now
            </>
          )}
        </button>
      </motion.form>
    </div>
  )
}

export default function TopUpPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <TopUpContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

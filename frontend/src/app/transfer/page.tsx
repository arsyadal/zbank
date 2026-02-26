'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, KeyRound, User } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { transactionApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import toast from 'react-hot-toast'

function TransferContent() {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    destinationAccount: '',
    amount: '',
    pin: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await transactionApi.transfer({
        destinationAccount: formData.destinationAccount,
        amount: parseFloat(formData.amount),
        pin: formData.pin,
        description: formData.description || undefined,
      })
      
      toast.success('Transfer successful!')
      setFormData({ destinationAccount: '', amount: '', pin: '', description: '' })
    } catch (error: any) {
      const message = error.response?.data?.message || 'Transfer failed'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount)
    if (isNaN(num)) return ''
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Transfer</h1>
        <p className="text-gray-400">Send money to another account</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Destination Account</label>
          <div className="input-with-icon">
            <User className="icon" size={20} />
            <input
              type="text"
              required
              value={formData.destinationAccount}
              onChange={(e) => setFormData({ ...formData, destinationAccount: e.target.value })}
              placeholder="Enter account number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Amount (IDR)</label>
          <div className="input-with-icon">
            <span className="icon font-medium">Rp</span>
            <input
              type="number"
              required
              min="1000"
              step="1000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0"
            />
          </div>
          {formData.amount && (
            <p className="text-sm text-gray-400 mt-2">
              {formatCurrency(formData.amount)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description (optional)</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            placeholder="What's this for?"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">PIN</label>
          <div className="input-with-icon">
            <KeyRound className="icon" size={20} />
            <input
              type="password"
              required
              maxLength={6}
              pattern="\d{6}"
              value={formData.pin}
              onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
              placeholder="Enter your 6-digit PIN"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-4 text-sm">
            <span className="text-gray-400">From Account</span>
            <span className="font-medium">{user?.accountNumber}</span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
            ) : (
              <>
                <Send size={20} /> Transfer Now
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  )
}

export default function TransferPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <TransferContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

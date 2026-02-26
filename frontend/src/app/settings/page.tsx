'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, KeyRound, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { accountApi } from '@/lib/api'

function SettingsContent() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [pinForm, setPinForm] = useState({
    currentPin: '',
    newPin: '',
    confirmNewPin: '',
  })
  const [showPasswords, setShowPasswords] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isPinLoading, setIsPinLoading] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    setIsPasswordLoading(true)
    try {
      await accountApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      toast.success('Password changed successfully')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pinForm.newPin !== pinForm.confirmNewPin) {
      toast.error('New PINs do not match')
      return
    }
    if (!/^\d{6}$/.test(pinForm.newPin)) {
      toast.error('PIN must be exactly 6 digits')
      return
    }
    setIsPinLoading(true)
    try {
      await accountApi.changePin({
        currentPin: pinForm.currentPin,
        newPin: pinForm.newPin,
      })
      toast.success('PIN changed successfully')
      setPinForm({ currentPin: '', newPin: '', confirmNewPin: '' })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change PIN')
    } finally {
      setIsPinLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your account security</p>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Lock className="text-accent" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Change Password</h2>
            <p className="text-sm text-gray-400">Update your login password</p>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="ml-auto text-gray-400 hover:text-white transition-colors"
          >
            {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="input-with-icon">
            <Lock className="icon" size={18} />
            <input
              type={showPasswords ? 'text' : 'password'}
              placeholder="Current Password"
              className="input-field pl-12"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="input-with-icon">
            <Lock className="icon" size={18} />
            <input
              type={showPasswords ? 'text' : 'password'}
              placeholder="New Password (min 8 characters)"
              className="input-field pl-12"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              minLength={8}
              required
            />
          </div>
          <div className="input-with-icon">
            <Lock className="icon" size={18} />
            <input
              type={showPasswords ? 'text' : 'password'}
              placeholder="Confirm New Password"
              className="input-field pl-12"
              value={passwordForm.confirmNewPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={isPasswordLoading} className="btn-primary w-full flex items-center justify-center gap-2">
            {isPasswordLoading ? (
              <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </motion.div>

      {/* Change PIN */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
            <KeyRound className="text-primary-400" size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Change Transaction PIN</h2>
            <p className="text-sm text-gray-400">Update your 6-digit transaction PIN</p>
          </div>
        </div>

        <form onSubmit={handleChangePin} className="space-y-4">
          <div className="input-with-icon">
            <KeyRound className="icon" size={18} />
            <input
              type="password"
              placeholder="Current PIN"
              className="input-field pl-12"
              value={pinForm.currentPin}
              onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
              maxLength={6}
              pattern="\d{6}"
              required
            />
          </div>
          <div className="input-with-icon">
            <KeyRound className="icon" size={18} />
            <input
              type="password"
              placeholder="New PIN (6 digits)"
              className="input-field pl-12"
              value={pinForm.newPin}
              onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
              maxLength={6}
              pattern="\d{6}"
              required
            />
          </div>
          <div className="input-with-icon">
            <KeyRound className="icon" size={18} />
            <input
              type="password"
              placeholder="Confirm New PIN"
              className="input-field pl-12"
              value={pinForm.confirmNewPin}
              onChange={(e) => setPinForm({ ...pinForm, confirmNewPin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
              maxLength={6}
              pattern="\d{6}"
              required
            />
          </div>
          <button type="submit" disabled={isPinLoading} className="btn-primary w-full flex items-center justify-center gap-2">
            {isPinLoading ? (
              <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
            ) : (
              'Update PIN'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <SettingsContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

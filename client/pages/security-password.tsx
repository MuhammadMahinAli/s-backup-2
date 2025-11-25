'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock, Smartphone, AlertCircle, Check } from 'lucide-react'

export function SecurityPassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [saved, setSaved] = useState(false)

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all fields')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const getPasswordStrength = (password: string) => {
    if (password.length < 12) return { level: 'weak', color: 'text-red-500' }
    if (password.length < 16) return { level: 'medium', color: 'text-yellow-500' }
    return { level: 'strong', color: 'text-green-500' }
  }

  const strength = getPasswordStrength(newPassword)

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Security & Password</h1>
          <p className="text-muted-foreground">Manage your account security and login credentials</p>
        </div>

        {/* Card 1: Login & Password */}
        <div className="bg-card rounded-xl p-6 border border-border mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={24} className="text-accent" />
            <h2 className="text-xl font-semibold text-card-foreground">Login & Password</h2>
          </div>

          {/* Current Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your current password"
              />
              <button
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your new password"
              />
              <button
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {newPassword && (
              <div className="mt-2">
                <p className={`text-xs font-medium ${strength.color}`}>
                  Strength: {strength.level}
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Use at least 12 characters, including letters and numbers
            </p>
          </div>

          {/* Confirm New Password */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-card-foreground mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Confirm your new password"
              />
              <button
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 mt-2">Passwords do not match</p>
            )}
          </div>

          <button
            onClick={handleSavePassword}
            className="w-full px-6 py-2 rounded-lg font-medium transition-all bg-accent text-accent-foreground hover:opacity-90 flex items-center justify-center gap-2"
          >
            {saved && <Check size={18} />}
            {saved ? 'Password Saved!' : 'Save Password'}
          </button>
        </div>

        {/* Card 2: Sessions & Devices */}
        <div className="bg-card rounded-xl p-6 border border-border mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Smartphone size={24} className="text-accent" />
            <h2 className="text-xl font-semibold text-card-foreground">Sessions & Devices</h2>
          </div>

          {/* Current Device */}
          <div className="bg-secondary rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-card-foreground">MacBook Pro (Current)</p>
                <p className="text-sm text-muted-foreground mt-1">Chrome on macOS</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Last login: Today at 2:34 PM
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Review and manage your active sessions across all devices
          </p>
          <button className="w-full px-6 py-2 rounded-lg font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-muted">
            Manage Other Sessions
          </button>
        </div>

        {/* Card 3: Account Status */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-card-foreground mb-6">Account Status</h2>

          {/* Status items */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <p className="text-sm font-medium text-card-foreground">Role</p>
                <p className="text-xs text-muted-foreground mt-1">Your account type</p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                PEER ADVOCATE ★
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <p className="text-sm font-medium text-card-foreground">Verification Status</p>
                <p className="text-xs text-muted-foreground mt-1">Your account verification</p>
              </div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                <Check size={16} />
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground">Account Status</p>
                <p className="text-xs text-muted-foreground mt-1">Your current activity status</p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                Active
              </span>
            </div>
          </div>

          {/* Deactivation warning */}
          <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg mb-6">
            <AlertCircle size={18} className="text-accent mt-0.5 flex-shrink-0" />
            <p className="text-sm text-secondary-foreground">
              Deactivating your account is permanent. You will lose access to your profile and all peer advocate privileges.
            </p>
          </div>

          <button className="w-full px-6 py-2 rounded-lg font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-muted">
            Request Deactivation
          </button>
        </div>
      </div>
    </div>
  )
}

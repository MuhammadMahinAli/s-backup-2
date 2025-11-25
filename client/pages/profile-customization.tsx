'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Check } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getCurrentPeerAdvocate } from '@/lib/auth'

export function ProfileCustomization() {
  const currentUser = getCurrentPeerAdvocate()
  const [displayName, setDisplayName] = useState(currentUser?.nickname || '')
  const [bio, setBio] = useState('I\'m here to support peers going through similar experiences.')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [emailVerified, setEmailVerified] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.nickname)
      setEmail(currentUser.email)
    }
  }, [currentUser])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    if (currentUser) {
      setDisplayName(currentUser.nickname)
      setEmail(currentUser.email)
    }
    setBio('I\'m here to support peers going through similar experiences.')
    setEmailVerified(true)
  }

  const showPeerAdvocateWarning = displayName.toLowerCase().includes('peer advocate')

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile & Customization</h1>
          <p className="text-muted-foreground">Edit how you appear to other community members</p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Avatar Section */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">Profile Photo</h2>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/profile.jpg" />
                  <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start gap-2 p-3 bg-secondary rounded-lg">
                    <AlertCircle size={16} className="text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-secondary-foreground">
                      Every peer advocate has the same profile photo to maintain anonymity and ensure all advocates are treated equally.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Name Section */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <label className="block text-sm font-semibold text-card-foreground mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter your display name"
              />
              {showPeerAdvocateWarning && (
                <div className="flex items-start gap-3 mt-3 p-3 bg-secondary rounded-lg">
                  <AlertCircle size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-secondary-foreground">
                    The "Peer Advocate" title and badge are reserved for verified accounts.
                  </p>
                </div>
              )}
              <div className="flex items-start gap-2 mt-3 p-3 bg-secondary rounded-lg">
                <AlertCircle size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm text-secondary-foreground">
                  Using a nickname is encouraged to stay anonymous and protect your privacy.
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This is the name other community members will see
              </p>
            </div>

            {/* Bio Section */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <label className="block text-sm font-semibold text-card-foreground mb-2">
                Short Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                placeholder="Tell us a bit about yourself..."
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">
                  Share what drew you to support peers
                </p>
                <p className="text-xs text-muted-foreground">
                  {bio.length}/150
                </p>
              </div>
            </div>

            {/* Email Section */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <label className="block text-sm font-semibold text-card-foreground mb-2">
                Contact Email
              </label>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter your email"
                />
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  <Check size={16} />
                  <span className="text-sm font-medium">{emailVerified ? 'Verified' : 'Not Verified'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-secondary rounded-lg">
                <AlertCircle size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm text-secondary-foreground">
                  Make sure to use an email that does not disclose your real identity, as this will be given to users to make contact with you.
                </p>
              </div>
            </div>

          </div>

          {/* Right column - Preview Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">Preview</h2>
              <p className="text-xs text-muted-foreground mb-4">
                How you'll appear on community posts
              </p>

              {/* Preview Content */}
              <div className="bg-secondary rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src="/profile.jpg" />
                    <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-card-foreground text-sm">{displayName}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium whitespace-nowrap">
                        PEER ADVOCATE ★
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3 justify-end max-w-7xl mx-auto">
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-lg font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-muted"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg font-medium transition-all bg-accent text-accent-foreground hover:opacity-90 flex items-center gap-2"
          >
            {saved && <Check size={18} />}
            {saved ? 'Changes Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { MessageSquare, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentPeerAdvocate } from '@/lib/auth'

export function DashboardHome() {
  const currentUser = getCurrentPeerAdvocate()

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-secondary to-secondary/50 rounded-2xl p-8 text-foreground border border-border shadow-sm">
        <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser?.nickname || 'User'}</h1>
        <p className="text-lg text-foreground/80">You're logged in as a verified SHY Peer Advocate.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Responses This Week</p>
              <p className="text-4xl font-bold text-primary">24</p>
            </div>
            <MessageSquare className="text-primary/20" size={32} />
          </div>
          <p className="text-xs text-muted-foreground mt-4">+12% from last week</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Conversations Flagged</p>
              <p className="text-4xl font-bold text-accent">3</p>
            </div>
            <AlertCircle className="text-accent/20" size={32} />
          </div>
          <p className="text-xs text-muted-foreground mt-4">For moderator review</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Avg Response Time</p>
              <p className="text-4xl font-bold text-secondary">2m</p>
            </div>
            <Clock className="text-secondary/20" size={32} />
          </div>
          <p className="text-xs text-muted-foreground mt-4">45s faster than average</p>
        </div>
      </div>

      {/* Shortcuts */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => window.location.href = '/community'}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg font-medium shadow-sm"
          >
            Go to Community
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 rounded-lg font-medium shadow-sm">
            Edit Profile
          </Button>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 rounded-lg font-medium shadow-sm">
            View Guidelines
          </Button>
        </div>
      </div>
    </div>
  )
}

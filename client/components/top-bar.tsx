'use client'

import { Bell, HelpCircle, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useNavigate } from 'react-router-dom'
import { getCurrentPeerAdvocate, logoutPeerAdvocate } from '@/lib/auth'

export function TopBar() {
  const navigate = useNavigate()
  const currentUser = getCurrentPeerAdvocate()

  const handleLogout = () => {
    logoutPeerAdvocate()
    navigate('/peer-advocates')
  }

  return (
    <div className="border-b border-border bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <span className="font-semibold text-lg text-foreground">Peer Advocate Dashboard</span>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Peer Advocate: {currentUser?.nickname || 'User'}
            </span>
            <span className="text-lg">★</span>
          </div>

          <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary">
            <Bell size={20} />
          </button>

          <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary">
            <HelpCircle size={20} />
          </button>

          <button 
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-secondary"
            title="Logout"
          >
            <LogOut size={20} />
          </button>

          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser?.profileImage || '/profile.jpg'} />
            <AvatarFallback>{currentUser?.nickname?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}

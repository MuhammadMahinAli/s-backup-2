'use client'

import { LayoutDashboard, User, Lock, Users, HelpCircle, Menu, X, Home, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SidebarProps {
  activePage: string
  setActivePage: (page: string) => void
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()

  const menuItems = [
    { id: 'home', label: 'Dashboard Home', icon: LayoutDashboard },
    { id: 'chat', label: 'Chat Requests', icon: MessageSquare },
    { id: 'profile', label: 'Profile customize', icon: User },
    { id: 'security', label: 'Security & Password', icon: Lock },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'help', label: 'Help & Guidelines', icon: HelpCircle },
  ]

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-sidebar border-r border-sidebar-border flex flex-col h-screen transition-all duration-300`}>
      <div className="p-6 border-b border-sidebar-border flex items-center justify-center">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm justify-start ${isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Back to Homepage Button */}
      <div className="px-3 pb-6 border-t border-sidebar-border pt-4">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          title={isCollapsed ? 'Back to Homepage' : undefined}
        >
          <Home size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="truncate">Back to Homepage</span>}
        </button>
      </div>
    </aside>
  )
}

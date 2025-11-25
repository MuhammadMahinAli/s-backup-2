import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/top-bar';
import { DashboardHome } from './dashboard-home';
import { ProfileCustomization } from './profile-customization';
import { SecurityPassword } from './security-password';
import { HelpGuidelines } from './help-guidelines';
import PeerChatDashboard from '@/components/dashboard/PeerChatDashboard';
import { getCurrentPeerAdvocate, isAuthenticated } from '@/lib/auth';

export default function PeerAdvocateDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('home');
  const currentUser = getCurrentPeerAdvocate();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/peer-advocate-login');
    }
  }, [navigate]);

  // If not authenticated, don't render anything
  if (!isAuthenticated() || !currentUser) {
    return null;
  }

  // Render the active page content
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <DashboardHome />;
      case 'chat':
        return <PeerChatDashboard />;
      case 'profile':
        return <ProfileCustomization />;
      case 'security':
        return <SecurityPassword />;
      case 'community':
        // Navigate to community page
        navigate('/community');
        return null;
      case 'help':
        return <HelpGuidelines />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllPeerAdvocates, getCurrentPeerAdvocate, isAuthenticated, type PeerAdvocate } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PeerAdvocates() {
  const navigate = useNavigate();
  const [advocates, setAdvocates] = useState<PeerAdvocate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<PeerAdvocate | null>(null);
  const [revealedEmails, setRevealedEmails] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchAdvocates = async () => {
      const data = await getAllPeerAdvocates();
      setAdvocates(data);
      setLoading(false);
    };
    fetchAdvocates();
    
    // Check if user is logged in
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setCurrentUser(getCurrentPeerAdvocate());
    }
  }, []);

  const toggleEmailReveal = (index: number) => {
    setRevealedEmails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section style={{ backgroundColor: '#D4EDF4' }} className="px-4 sm:px-8 lg:px-[264.5px] py-12 lg:py-16">
          <div className="max-w-[896px] mx-auto flex flex-col items-center gap-6">
            <h1 className="text-4xl sm:text-5xl lg:text-[67px] font-bold leading-tight lg:leading-[90px] text-center bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #0092B8, #009689, #155DFC)' }}>
              Peer Advocates
            </h1>
            <p className="text-[#315E5B] text-lg sm:text-xl lg:text-[22px] leading-relaxed lg:leading-[39px] text-center max-w-[768px]">
              Meet our trained peer advocates who are here to guide, support,
              and listen.
            </p>
          </div>
        </section>

        {/* Peer Advocates Cards Section */}
        {advocates.length > 0 && (
          <section className="px-4 sm:px-8 lg:px-20 py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-[#315E5B]">
                Our Peer Advocates
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {advocates.map((advocate, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarImage src={advocate.profileImage} />
                        <AvatarFallback>{advocate.nickname.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg mb-1">{advocate.nickname}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-medium mb-3">
                        PEER ADVOCATE ★
                      </span>
                      {advocate.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{advocate.bio}</p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEmailReveal(index)}
                        className="w-full mt-auto flex items-center justify-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        {revealedEmails.has(index) ? 'Hide Email' : 'Contact'}
                      </Button>
                      {revealedEmails.has(index) && advocate.email && (
                        <div className="mt-3 p-2 bg-gray-50 rounded-md w-full">
                          <a 
                            href={`mailto:${advocate.email}`}
                            className="text-sm text-blue-600 hover:text-blue-800 break-all"
                          >
                            {advocate.email}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Action Section */}
        <section style={{ backgroundColor: '#FFFFFF' }} className="px-4 sm:px-8 lg:px-20 py-12 lg:py-16 flex flex-col items-center gap-6">
          {isLoggedIn ? (
            /* Logged In - Show Dashboard Button */
            <div className="flex flex-col items-center gap-4">
              <p className="text-[#315E5B] text-lg font-medium">
                Welcome back, {currentUser?.nickname}!
              </p>
              <button 
                onClick={() => navigate('/peer-advocate-dashboard')}
                style={{ backgroundImage: 'linear-gradient(to right, #0092B8, #009689, #155DFC)' }} 
                className="px-8 py-3 rounded-[10px] text-white font-semibold text-base lg:text-[17px] leading-7 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] hover:opacity-90 transition-opacity"
              >
                Go to Your Dashboard
              </button>
            </div>
          ) : (
            /* Not Logged In - Show Signup and Login Buttons */
            <>
              {/* Become Peer Advocate Button */}
              <button 
                onClick={() => navigate('/peer-advocate-signup')}
                style={{ backgroundImage: 'linear-gradient(to right, #0092B8, #009689, #155DFC)' }} 
                className="px-8 py-3 rounded-[10px] text-white font-semibold text-base lg:text-[17px] leading-7 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] hover:opacity-90 transition-opacity"
              >
                Become Peer Advocate
              </button>

              {/* Login Option */}
              <button 
                onClick={() => navigate('/peer-advocate-login')}
                className="text-[#315E5B] text-base lg:text-[17px] font-medium hover:text-[#006D68] transition-colors"
              >
                Login
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loginPeerAdvocate } from '@/lib/auth';
import { AlertCircle, LogIn, CheckCircle } from 'lucide-react';

export default function PeerAdvocateLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for success message from signup
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    const result = await loginPeerAdvocate(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      // Redirect to dashboard
      navigate('/peer-advocate-dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D4EDF4] to-[#FFFFFF] px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#0092B8] to-[#155DFC] flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            Peer Advocate Login
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0092B8] via-[#009689] to-[#155DFC] hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/peer-advocate-signup')}
                className="text-[#0092B8] hover:text-[#006D68] font-medium"
              >
                Sign up
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/peer-advocates')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Peer Advocates
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


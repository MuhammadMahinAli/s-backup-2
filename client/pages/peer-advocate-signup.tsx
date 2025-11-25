import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signupPeerAdvocate } from '@/lib/auth';
import { AlertCircle, UserPlus } from 'lucide-react';

export default function PeerAdvocateSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.nickname) {
      setError('All fields are required');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.nickname.length < 2) {
      setError('Nickname must be at least 2 characters');
      return;
    }

    setLoading(true);

    const result = await signupPeerAdvocate(formData.email, formData.password, formData.nickname);

    setLoading(false);

    if (result.success) {
      // Redirect to login page
      navigate('/peer-advocate-login', {
        state: { message: 'Account created successfully! Please login.' },
      });
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D4EDF4] to-[#FFFFFF] px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#0092B8] to-[#155DFC] flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            Become a Peer Advocate
          </CardTitle>
          <CardDescription className="text-center">
            Create your account to start helping others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="Choose a display name"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                disabled={loading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0092B8] via-[#009689] to-[#155DFC] hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/peer-advocate-login')}
                className="text-[#0092B8] hover:text-[#006D68] font-medium"
              >
                Login
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


// Authentication helper for peer advocates using backend API
import type { 
  PeerAdvocateProfile, 
  SignupPeerAdvocateRequest, 
  LoginPeerAdvocateRequest,
  SignupPeerAdvocateResponse,
  LoginPeerAdvocateResponse 
} from '@shared/api';

export interface PeerAdvocate extends PeerAdvocateProfile {
  _id?: string;
}

const CURRENT_USER_KEY = 'current_peer_advocate';

// Sign up a new peer advocate
export async function signupPeerAdvocate(
  email: string,
  password: string,
  nickname: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/peer-advocate/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, nickname } as SignupPeerAdvocateRequest),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Signup failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Login a peer advocate
export async function loginPeerAdvocate(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; advocate?: PeerAdvocate }> {
  try {
    const response = await fetch('/api/peer-advocate/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password } as LoginPeerAdvocateRequest),
    });

    const data: LoginPeerAdvocateResponse = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }

    // Save current user to localStorage
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.advocate));

    return { success: true, advocate: data.advocate };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Get current logged-in peer advocate
export function getCurrentPeerAdvocate(): PeerAdvocate | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

// Logout
export function logoutPeerAdvocate(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentPeerAdvocate() !== null;
}

// Get all peer advocates (for displaying on peer advocates page)
export async function getAllPeerAdvocates(): Promise<PeerAdvocate[]> {
  try {
    const response = await fetch('/api/peer-advocate/all');
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Failed to fetch peer advocates');
      return [];
    }
    
    return data.advocates || [];
  } catch (error) {
    console.error('Error fetching peer advocates:', error);
    return [];
  }
}

// Check if a nickname belongs to a peer advocate
export async function checkIsPeerAdvocate(nickname: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/peer-advocate/check?nickname=${encodeURIComponent(nickname)}`);
    const data = await response.json();
    
    return data.isPeerAdvocate || false;
  } catch (error) {
    console.error('Error checking peer advocate:', error);
    return false;
  }
}


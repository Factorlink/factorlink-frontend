import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import useAuthStore from "../store/authStore";
import api from "../lib/axios";
import { getTimeUntilExpiration, isTokenExpired } from "../utils/jwt";
import SessionExpiringModal from "../components/Modals/SessionExpiringModal";

// Configuration constants
const REFRESH_BUFFER_MS = 2 * 60 * 1000; // Refresh 2 minutes before expiration
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes of inactivity
const ACTIVITY_CHECK_INTERVAL_MS = 60 * 1000; // Check every minute
const SESSION_WARNING_SECONDS = 120; // 2 minutes countdown in modal

interface AuthContextValue {
  isSessionExpiring: boolean;
  extendSession: () => void;
  lastActivity: number;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    accessToken,
    refreshToken: storedRefreshToken,
    setAccessToken,
    setRefreshToken,
    logout: clearAuth,
  } = useAuthStore();
  
  const [isSessionExpiring, setIsSessionExpiring] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRefreshingRef = useRef(false);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    if (inactivityTimerRef.current) {
      clearInterval(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  // Perform token refresh
  const performRefresh = useCallback(async () => {
    if (isRefreshingRef.current || !storedRefreshToken) return;
    
    isRefreshingRef.current = true;
    
    try {
      const response = await api.post("auth/refresh-token", { 
        refreshToken: storedRefreshToken 
      });
      
      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
        if (response.data.refreshToken) {
          setRefreshToken(response.data.refreshToken);
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails, logout
      clearAuth();
      window.location.href = "/login";
    } finally {
      isRefreshingRef.current = false;
    }
  }, [storedRefreshToken, setAccessToken, setRefreshToken, clearAuth]);

  // Schedule token refresh
  const scheduleRefresh = useCallback(() => {
    if (!accessToken) return;
    
    const timeUntilExpiration = getTimeUntilExpiration(accessToken);
    
    if (timeUntilExpiration <= 0) {
      // Token already expired
      performRefresh();
      return;
    }
    
    // Schedule refresh before expiration
    const refreshTime = Math.max(0, timeUntilExpiration - REFRESH_BUFFER_MS);
    
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    
    refreshTimerRef.current = setTimeout(() => {
      performRefresh();
    }, refreshTime);
  }, [accessToken, performRefresh]);

  // Update last activity
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    setIsSessionExpiring(false);
  }, []);

  // Extend session (called when user responds to modal)
  const extendSession = useCallback(() => {
    updateActivity();
    performRefresh();
  }, [updateActivity, performRefresh]);

  // Handle logout from modal
  const handleLogout = useCallback(() => {
    clearTimers();
    setIsSessionExpiring(false);
    clearAuth();
    window.location.href = "/login";
  }, [clearTimers, clearAuth]);

  // Check for inactivity
  const checkInactivity = useCallback(() => {
    const timeSinceLastActivity = Date.now() - lastActivity;
    
    if (timeSinceLastActivity >= INACTIVITY_TIMEOUT_MS) {
      setIsSessionExpiring(true);
    }
  }, [lastActivity]);

  // Setup activity listeners
  useEffect(() => {
    if (!accessToken) return;
    
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    
    const handleActivity = () => {
      if (!isSessionExpiring) {
        updateActivity();
      }
    };
    
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });
    
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [accessToken, isSessionExpiring, updateActivity]);

  // Setup refresh timer when token changes
  useEffect(() => {
    if (!accessToken || isTokenExpired(accessToken)) {
      clearTimers();
      return;
    }
    
    scheduleRefresh();
    
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [accessToken, scheduleRefresh, clearTimers]);

  // Setup inactivity check interval
  useEffect(() => {
    if (!accessToken) {
      clearTimers();
      return;
    }
    
    inactivityTimerRef.current = setInterval(checkInactivity, ACTIVITY_CHECK_INTERVAL_MS);
    
    return () => {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
    };
  }, [accessToken, checkInactivity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const value: AuthContextValue = {
    isSessionExpiring,
    extendSession,
    lastActivity,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionExpiringModal
        open={isSessionExpiring}
        onExtendSession={extendSession}
        onLogout={handleLogout}
        countdownSeconds={SESSION_WARNING_SECONDS}
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;

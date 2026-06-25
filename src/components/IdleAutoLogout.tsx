"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { signOut } from "next-auth/react";
import { Timer, ShieldAlert } from "lucide-react";

// Idle timeout: 30 minutes in milliseconds
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
// Warning shown 5 minutes before logout
const WARNING_BEFORE_MS = 5 * 60 * 1000;
// Throttle interval for activity events (avoid excessive updates)
const ACTIVITY_THROTTLE_MS = 30 * 1000;

/**
 * IdleAutoLogout — tracks user inactivity across the admin panel.
 * 
 * Security features:
 * - Logs out after 30 minutes of inactivity (configurable above)
 * - Shows a 5-minute warning before auto-logout
 * - Syncs activity across multiple browser tabs via BroadcastChannel
 * - Does NOT store sensitive data in localStorage
 * - Cleans up all listeners and timers on unmount
 */
export default function IdleAutoLogout() {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const lastActivityRef = useRef<number>(Date.now());
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const broadcastRef = useRef<BroadcastChannel | null>(null);
  const isLoggingOutRef = useRef(false);

  // Perform secure logout
  const performLogout = useCallback(() => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    // Notify other tabs
    try {
      broadcastRef.current?.postMessage({ type: "logout" });
    } catch {
      // BroadcastChannel may be closed
    }

    // Clear all timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    signOut({ callbackUrl: "/login?reason=idle" });
  }, []);

  // Reset the idle timer on user activity
  const resetIdleTimer = useCallback(() => {
    if (isLoggingOutRef.current) return;

    const now = Date.now();
    lastActivityRef.current = now;
    setShowWarning(false);

    // Clear existing timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    // Set warning timer (fires 5 min before logout)
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      const logoutTime = lastActivityRef.current + IDLE_TIMEOUT_MS;
      
      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        const remaining = Math.max(0, logoutTime - Date.now());
        setCountdown(Math.ceil(remaining / 1000));
        
        if (remaining <= 0) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        }
      }, 1000);
    }, IDLE_TIMEOUT_MS - WARNING_BEFORE_MS);

    // Set logout timer
    idleTimerRef.current = setTimeout(() => {
      performLogout();
    }, IDLE_TIMEOUT_MS);

    // Notify other tabs about activity
    try {
      broadcastRef.current?.postMessage({ type: "activity", timestamp: now });
    } catch {
      // BroadcastChannel may be closed
    }
  }, [performLogout]);

  // Throttled activity handler — prevents excessive timer resets
  const throttledResetRef = useRef<number>(0);
  const handleActivity = useCallback(() => {
    const now = Date.now();
    if (now - throttledResetRef.current < ACTIVITY_THROTTLE_MS && !showWarning) {
      return;
    }
    throttledResetRef.current = now;
    resetIdleTimer();
  }, [resetIdleTimer, showWarning]);

  useEffect(() => {
    // Initialize BroadcastChannel for multi-tab sync
    try {
      broadcastRef.current = new BroadcastChannel("admin-session");
      broadcastRef.current.onmessage = (event) => {
        if (event.data?.type === "logout") {
          // Another tab triggered logout
          if (!isLoggingOutRef.current) {
            isLoggingOutRef.current = true;
            signOut({ callbackUrl: "/login?reason=idle" });
          }
        } else if (event.data?.type === "activity") {
          // Another tab had activity — reset our timer too
          lastActivityRef.current = event.data.timestamp;
          resetIdleTimer();
        }
      };
    } catch {
      // BroadcastChannel not supported — single tab fallback
    }

    // Track user activity events
    const events: (keyof WindowEventMap)[] = [
      "mousedown",
      "mousemove", 
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Track visibility changes (tab focus/blur)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Tab became visible — check if we should have logged out
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= IDLE_TIMEOUT_MS) {
          performLogout();
        } else {
          handleActivity();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Start the initial timer
    resetIdleTimer();

    return () => {
      // Cleanup
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

      try {
        broadcastRef.current?.close();
      } catch {
        // Already closed
      }
    };
  }, [handleActivity, performLogout, resetIdleTimer]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-background border border-glass-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-500/10">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Session Expiring
          </h2>
        </div>

        <p className="text-foreground-muted text-sm mb-6 leading-relaxed">
          Sesi Anda akan berakhir karena tidak ada aktivitas. Anda akan otomatis
          logout dalam:
        </p>

        <div className="flex items-center justify-center gap-2 mb-6 p-4 rounded-xl bg-background-secondary border border-glass-border">
          <Timer className="w-5 h-5 text-amber-500" />
          <span className="text-3xl font-extrabold tracking-tighter text-foreground tabular-nums">
            {formatTime(countdown)}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetIdleTimer}
            className="flex-1 py-3 px-4 bg-foreground text-background font-bold rounded-xl hover:scale-[1.02] transition-transform text-sm"
          >
            Lanjutkan Sesi
          </button>
          <button
            onClick={performLogout}
            className="flex-1 py-3 px-4 border border-glass-border text-foreground-muted font-bold rounded-xl hover:bg-error/10 hover:text-error hover:border-error/20 transition-colors text-sm"
          >
            Logout Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

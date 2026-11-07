import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { storage } from '../services/storage';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess, reason = 'general' }) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successUser, setSuccessUser] = useState(null);

  const googleBtnRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '966525555140-n7gf2okpfq3tvdv6ltm2feso12i8fac5.apps.googleusercontent.com';

  // Decode Google JWT Credential Payload
  const decodeJwtPayload = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  const handleGoogleCredentialResponse = (response) => {
    if (response.credential) {
      const payload = decodeJwtPayload(response.credential);
      if (payload) {
        // Enforce trusted & verified Google accounts only
        if (payload.email_verified === false) {
          setErrorMsg('Only trusted & verified Google accounts are eligible to sign in.');
          return;
        }

        const googleUser = {
          name: payload.name || payload.email.split('@')[0],
          email: payload.email.toLowerCase(),
          avatar: payload.picture,
          provider: 'google',
          company: 'Verified Google Account',
          verified: true,
          loggedInAt: new Date().toISOString()
        };

        storage.setCurrentUser(googleUser);
        setSuccessUser(googleUser);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          if (onLoginSuccess) onLoginSuccess(googleUser);
          onClose();
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg('');
      setIsSuccess(false);
      return;
    }

    let intervalId = null;
    let attempts = 0;

    const initGoogleAuth = () => {
      attempts++;
      if (window.google && window.google.accounts && googleClientId) {
        if (intervalId) clearInterval(intervalId);

        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: 'outline',
              size: 'large',
              width: 290,
              text: 'continue_with',
              shape: 'pill',
              logo_alignment: 'left'
            });
          }
        } catch (err) {
          console.warn('Google Identity initialization notice:', err);
        }
      } else if (attempts > 30 && intervalId) {
        clearInterval(intervalId);
      }
    };

    initGoogleAuth();
    if (!window.google || !window.google.accounts) {
      intervalId = setInterval(initGoogleAuth, 200);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, googleClientId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl text-center max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900">
              Welcome, {successUser?.name || 'Verified Member'}!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Signed in via trusted Google account <strong className="text-slate-900">{successUser?.email}</strong>.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Google Account</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Google G Logo & Header */}
            <div>
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3 shadow-xs">
                {/* Official Google 'G' Logo SVG */}
                <svg className="w-7 h-7" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
                Sign In with Google
              </h3>
              
              {reason === 'inquiry' ? (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Sign in with your Google account to submit your custom card proof and quote.</span>
                </div>
              ) : reason === 'review' ? (
                <div className="mt-3 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-sky-600" />
                  <span>Only verified Google accounts can submit customer reviews.</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Only trusted & verified Google accounts are accepted. 1-tap fast access with zero passwords.
                </p>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google Authentication Container */}
            <div className="py-2 flex flex-col items-center justify-center">
              <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]" />
            </div>

            {/* Trust & Verification Badges */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Google OAuth 2.0 Verified Identity</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Trusted Accounts Only · Client ID Protected
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

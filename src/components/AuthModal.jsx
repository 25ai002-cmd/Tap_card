import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, AlertCircle, ShieldCheck, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { storage } from '../services/storage';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess, reason = 'general' }) => {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg('');
      setIsLoading(false);
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
            callback: (response) => {
              if (response.credential) {
                const payload = decodeJwtPayload(response.credential);
                if (payload) {
                  const googleUser = {
                    name: payload.name || payload.email.split('@')[0],
                    email: payload.email.toLowerCase(),
                    avatar: payload.picture,
                    provider: 'google',
                    company: 'Verified Google Account',
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
            }
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: 'outline',
              size: 'large',
              width: 280,
              text: 'continue_with',
              shape: 'rectangular',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match. Please re-enter.');
        }

        const registeredUser = await storage.registerUser({
          name: name.trim(),
          email: email.trim(),
          password
        });

        setSuccessUser(registeredUser);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          if (onLoginSuccess) onLoginSuccess(registeredUser);
          onClose();
        }, 800);
      } else {
        const loggedUser = await storage.loginUserWithPassword(email.trim(), password);
        setSuccessUser(loggedUser);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          if (onLoginSuccess) onLoginSuccess(loggedUser);
          onClose();
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-8 border border-slate-200 shadow-2xl text-left max-h-[92vh] overflow-y-auto">
        
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
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900">
              Welcome, {successUser?.name || 'Verified User'}!
            </h3>
            <p className="text-xs text-slate-600">
              Your account is verified and your custom card inquiries are private and protected.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Header */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto mb-2.5 border border-sky-200 shadow-xs">
                <Lock className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {authMode === 'signin' ? 'Sign In to Your Account' : 'Create Private Account'}
              </h3>
              
              {reason === 'inquiry' ? (
                <div className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Please sign in so your custom card quote and digital proof remain private.</span>
                </div>
              ) : reason === 'review' ? (
                <div className="mt-2 p-2 rounded-xl bg-sky-50 border border-sky-200 text-[11px] text-sky-800 flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-sky-600" />
                  <span>Sign in to submit your verified customer review.</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {authMode === 'signin' 
                    ? 'Access your private quotes, saved cards, and inquiries.' 
                    : 'Register with your email and password to keep your card designs secure.'}
                </p>
              )}
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-xl transition-all text-center ${
                  authMode === 'signin' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-xl transition-all text-center ${
                  authMode === 'signup' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Yaksh Barot"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={authMode === 'signup' ? "At least 6 characters" : "Enter your password"}
                    className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.99] shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : authMode === 'signup' ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Create Secure Account</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In Securely</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase font-mono tracking-wider">or sign in with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Google Authentication */}
            <div className="flex flex-col items-center justify-center">
              <div ref={googleBtnRef} className="w-full flex justify-center min-h-[42px]" />
            </div>

            {/* Privacy & Security Note */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Private Data Isolation · Encrypted Credentials</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

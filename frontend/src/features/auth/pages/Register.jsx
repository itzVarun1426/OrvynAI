import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import ThemeToggle from '../../../components/ThemeToggle';
import OTPInput from '../components/OTPInput.jsx';

const Register = () => {
  const { handleRegister, handleGoogleLogin, authError, setAuthError, handleVerifyOTP, handleResendOTP } = useAuth();
  const navigate = useNavigate();

  // Clear auth error on unmount or navigation
  useEffect(() => {
    return () => {
      if (setAuthError) setAuthError(null);
    };
  }, [setAuthError]);

  const [username, setUsername] = useState("");
  const [emailState, setEmailState] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP verification state
  const [otp, setOTP] = useState("");
  const [isVerifyingScreen, setIsVerifyingScreen] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [resendStatus, setResendStatus] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  // Validation states
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Validation functions
  const validateUsername = (name) => {
    if (!name) return 'Full name is required';
    if (name.trim().length < 2) return 'Full name must be at least 2 characters long';
    if (!/[a-zA-Z]/.test(name)) return 'Please enter a valid full name';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (pass) => {
    if (!pass) return 'Password is required';
    if (pass.length < 8) return 'Password must be at least 8 characters long';
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (!passwordRegex.test(pass)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one special character';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameErrorMsg = validateUsername(username);
    const emailErrorMsg = validateEmail(emailState);
    const passwordErrorMsg = validatePassword(password);

    setUsernameError(usernameErrorMsg);
    setEmailError(emailErrorMsg);
    setPasswordError(passwordErrorMsg);

    if (usernameErrorMsg || emailErrorMsg || passwordErrorMsg) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await handleRegister({ 
        username: username.trim(), 
        email: emailState.toLowerCase().trim(), 
        password 
      });
      if (success) {
        // Direct route navigation guarantees the OTP verification page renders reliably
        navigate(`/verify-otp/${encodeURIComponent(emailState.toLowerCase().trim())}`);
      }
    } catch (err) {
      // Handled by authError in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySubmit = async (codeToVerify) => {
    const finalOtp = codeToVerify || otp;
    if (!finalOtp || finalOtp.length !== 6) {
      setVerifyError('Please enter the complete 6-digit code');
      return;
    }

    setVerifyLoading(true);
    setVerifyError('');
    setResendStatus('');
    try {
      const success = await handleVerifyOTP({ 
        email: emailState.toLowerCase().trim(), 
        otp: finalOtp 
      });
      if (success) {
        navigate("/dashboard");
      } else {
        setVerifyError('Verification failed. Please check your code or request a new one.');
      }
    } catch (err) {
      setVerifyError(err.message || 'Invalid or expired verification code');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendClick = async () => {
    if (resendCountdown > 0) return;
    setVerifyError('');
    setResendStatus('Sending new code...');
    try {
      const res = await handleResendOTP({ email: emailState.toLowerCase().trim() });
      if (res) {
        setResendCountdown(60);
        setResendStatus('A new 6-digit code has been sent to your email.');
        setOTP('');
      } else {
        setResendStatus('');
        setVerifyError('Unable to resend OTP at this time.');
      }
    } catch (err) {
      setResendStatus('');
      setVerifyError(err.message || 'Failed to resend code');
    }
  };



  // Show OTP verification form once registration data is validated
  if (isVerifyingScreen) {
    const maskedEmail = emailState.replace(/([^@\s]{1,2})[^@\s]*(@.*)/, '$1****$2');

    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-inter transition-colors duration-300">
        <div className="absolute top-8 right-8 z-20">
          <ThemeToggle />
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md relative z-10 space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/30">
                i
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-space-grotesk">
              Verify your email
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-semibold text-slate-900 dark:text-white text-base">
              {maskedEmail}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800 transition-colors space-y-6">
            {verifyError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium text-center shadow-sm"
              >
                {verifyError}
              </motion.div>
            )}

            {resendStatus && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-lg text-emerald-700 dark:text-emerald-300 text-sm font-medium text-center"
              >
                {resendStatus}
              </motion.div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleVerifySubmit(); }} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Enter 6-digit code
                </label>

                <OTPInput
                  value={otp}
                  onChange={(val) => {
                    setOTP(val);
                    if (verifyError) setVerifyError('');
                  }}
                  onComplete={(val) => {
                    handleVerifySubmit(val);
                  }}
                  isDisabled={verifyLoading}
                  autoFocus={true}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={verifyLoading || otp.length !== 6}
                type="submit"
                className={`w-full py-3.5 bg-primary hover:bg-primary-dim text-white font-semibold text-sm rounded-xl shadow-sm transition-all ${verifyLoading || otp.length !== 6 ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {verifyLoading ? 'Verifying code...' : 'Confirm & Activate Account'}
              </motion.button>
            </form>

            <div className="pt-2 text-center space-y-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Didn't receive the email?
              </p>
              <button
                type="button"
                onClick={handleResendClick}
                disabled={resendCountdown > 0}
                className={`px-4 py-2 text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 ${resendCountdown > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend Code'}
              </button>
            </div>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg p-2.5">
              ⏱️ Code expires in 5 minutes. <strong>Please check your spam/junk folder</strong> if you don't see it in your inbox!
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => { setIsVerifyingScreen(false); setOTP(''); }}
              className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              ← Back to registration
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-inter transition-colors duration-300">
      {/* Theme Toggle Positioned */}
      <div className="absolute top-8 right-8 z-20">
        <ThemeToggle />
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md relative z-10 space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
             <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-soft">
                O
             </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create an Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sign up to get started with OrvynAI</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-5">
            {authError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{authError}</span>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                onChange={(e) => {
                  setUsername(e.target.value);
                  // Clear error when user starts typing
                  if (e.target.value) setUsernameError('');
                }}
                type="text"
                id="username"
                className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 ${usernameError ? 'border-red-500' : ''}`}
                placeholder="John Doe"
                required
              />
              {usernameError && (
                <p className="mt-1 text-sm text-red-600">{usernameError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                onChange={(e) => {
                  setEmailState(e.target.value);
                  // Clear error when user starts typing
                  if (e.target.value) setEmailError('');
                }}
                type="email"
                id="email"
                className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 ${emailError ? 'border-red-500' : ''}`}
                placeholder="john@example.com"
                required
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div className="space-y-1.5 relative">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // Clear error when user starts typing
                    if (e.target.value) setPasswordError('');
                  }}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 pr-10 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 ${passwordError ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center justify-center p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isSubmitting}
              className={`w-full py-3.5 bg-primary hover:bg-primary-dim text-white font-semibold text-sm rounded-lg shadow-sm transition-all mt-2 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account & sending OTP...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </motion.button>

            <div className="mt-6 flex flex-col items-center gap-4 w-full">
              <div className="flex items-center w-full">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                <span className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">or sign up with</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
              </div>
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    const success = await handleGoogleLogin(credentialResponse.credential);
                    if (success) navigate("/dashboard");
                  }}
                  onError={() => {
                    console.error('Registration Failed');
                  }}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                />
              </div>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary-dim dark:hover:text-primary-bright font-bold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            Return to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default Register;
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import { motion } from 'framer-motion';
import ThemeToggle from '../../../components/ThemeToggle';
import OTPInput from '../components/OTPInput.jsx';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const { loading, handleVerifyOTP, handleResendOTP, authError } = useAuth();

  const [otp, setOTP] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [resendStatus, setResendStatus] = useState('');
  const [verifyError, setVerifyError] = useState('');

  // Email to show in UI (masked for privacy)
  const maskedEmail = email
    ? email.replace(/([^@\s]{1,2})[^@\s]*(@.*)/, '$1****$2')
    : '';

  // Cooldown countdown timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleSubmit = async (codeToVerify) => {
    const finalOtp = codeToVerify || otp;
    if (!finalOtp || finalOtp.length !== 6) {
      setVerifyError('Please enter a complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setVerifyError('');
    setResendStatus('');
    try {
      const success = await handleVerifyOTP({ email, otp: finalOtp });
      if (success) {
        navigate("/dashboard");
      } else {
        setVerifyError('Invalid or expired verification code');
      }
    } catch (err) {
      setVerifyError(err.message || 'Invalid or expired verification code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setVerifyError('');
    setResendStatus('Sending new code...');
    try {
      const res = await handleResendOTP({ email });
      if (res) {
        setResendCountdown(60);
        setResendStatus('A new 6-digit code has been sent to your email.');
        setOTP('');
      } else {
        setResendStatus('');
        setVerifyError('Failed to resend verification code');
      }
    } catch (error) {
      setResendStatus('');
      setVerifyError(error.message || 'Failed to resend code');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-inter text-slate-500 dark:text-slate-400 font-medium text-sm">Verifying your email...</p>
        </div>
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
                i
             </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Verify Your Email
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-bold text-slate-900 dark:text-white text-lg">
            {maskedEmail}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800 transition-colors">
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

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            <div className="space-y-2">
              <p className="text-slate-600 dark:text-slate-400 text-center">
                Please enter the 6-digit code sent to your email
              </p>

              <div className="flex flex-col">
                <label htmlFor="otp" className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Verification Code
                </label>
                <OTPInput
                  value={otp}
                  onChange={(val) => {
                    setOTP(val);
                    if (verifyError) setVerifyError('');
                  }}
                  onComplete={handleSubmit}
                  isDisabled={isVerifying}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isVerifying || otp.length !== 6}
              type="submit"
              className={`w-full py-3.5 bg-primary hover:bg-primary-dim text-white font-semibold text-sm rounded-lg shadow-sm transition-all mt-2 ${isVerifying || otp.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resendCountdown > 0}
              className={`px-4 py-2 bg-transparent text-sm font-medium transition-colors border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-950 ${resendCountdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
            </button>
          </div>

          <div className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            <p>
              This code will expire in 5 minutes. If you didn't request this verification, you can safely ignore this email.
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

export default VerifyOTP;
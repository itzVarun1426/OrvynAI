import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from '../../../components/ThemeToggle';
import { User, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Briefcase, Camera } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, handleUpdateProfile, handleUploadAvatar } = useAuth();
  const avatarInputRef = useRef(null);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || '');

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingAvatar(true);
    setStatusMessage(null);

    try {
      const res = await handleUploadAvatar(file);
      if (res?.avatarUrl) {
        setAvatarPreview(res.avatarUrl);
      }
      setStatusMessage({ type: 'success', text: 'Profile picture updated successfully!' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to upload profile picture.' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      await handleUpdateProfile({
        fullName,
        username,
        bio,
        targetRole,
        experienceLevel
      });
      setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-inter min-h-screen selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      {/* Hidden File Input for Avatar */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      {/* Top Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-6 h-16 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
              i
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              My Profile
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Avatar Section */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 rounded-full border-4 border-white/20 overflow-hidden bg-slate-800 flex items-center justify-center shadow-2xl relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-slate-400" />
                )}

                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-slate-900"
                title="Change Avatar"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Banner Text */}
            <div className="space-y-2 text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {fullName || user?.username || 'User Profile'}
              </h1>
              <p className="text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2">
                <Briefcase size={14} className="text-primary" />
                {targetRole || 'Set your target role below'}
                {experienceLevel && <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-semibold">{experienceLevel}</span>}
              </p>
              <p className="text-slate-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>

          {/* Status Toast / Alert */}
          <AnimatePresence>
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium shadow-sm ${
                  statusMessage.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 size={20} className="shrink-0 text-green-500" />
                ) : (
                  <AlertCircle size={20} className="shrink-0 text-red-500" />
                )}
                <span>{statusMessage.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Form */}
          <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Sparkles size={18} className="text-primary" />
              Personal & Career Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm text-slate-800 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="alexj"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm text-slate-800 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Target Role */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm text-slate-800 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm text-slate-800 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                >
                  <option value="">Select Level</option>
                  <option value="Junior">Junior (0-2 years)</option>
                  <option value="Mid-Level">Mid-Level (2-5 years)</option>
                  <option value="Senior">Senior (5-8 years)</option>
                  <option value="Lead / Principal">Lead / Principal (8+ years)</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>

            {/* Bio / Summary */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Professional Bio & Experience Summary</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Share a short bio or summary of your skills and domain expertise..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-800 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    Save Profile Details
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;

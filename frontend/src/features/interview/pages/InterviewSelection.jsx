import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router';
import { 
  Play, 
  FileText, 
  Target,
  ArrowRight, 
  Layers,
  ChevronRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { interviewContext } from '../interview.context';
import { getInterviewReportById } from '../services/interview.api';
import ThemeToggle from '../../../components/ThemeToggle';

const InterviewSelection = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { report, setReport } = useContext(interviewContext);
  const [selectedOption, setSelectedOption] = useState('interview');

  useEffect(() => {
    const fetchReport = async () => {
      if (report && (report._id === interviewId || report.id === interviewId)) return;
      try {
        const data = await getInterviewReportById(interviewId);
        if (data?.interviewReport) {
          setReport(data.interviewReport);
        }
      } catch (err) {
        console.error("Failed to load interview report:", err);
      }
    };
    if (interviewId) fetchReport();
  }, [interviewId, report, setReport]);

  const candidateProfile = report?.candidateProfile || {};
  const jobAnalysis = report?.jobAnalysis || {};
  const skillComparison = report?.skillComparison || [];
  const interviewPlan = report?.interviewPlan || {
    totalQuestions: 10,
    breakdown: [
      { category: "Technical Fundamentals", count: 2 },
      { category: "Project Deep Dive", count: 3 },
      { category: "Role-Specific Skills", count: 2 },
      { category: "Problem Solving", count: 2 },
      { category: "Behavioral", count: 1 }
    ],
    focusAreas: []
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-inter selection:bg-primary/20 selection:text-primary">
      {/* Top Bar */}
      <header className="h-16 flex items-center justify-between px-8 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-space-grotesk">
              OrvynAI Session Intelligence
            </h1>
            <p className="text-[10px] text-slate-400">
              Target: {jobAnalysis.targetRole || report?.title || "Candidate Evaluation"}
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Grid View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Personalized Interview Plan & Skill Diagnostics */}
        <div className="lg:col-span-7 space-y-6">
          {/* Plan Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-xl"
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <Layers size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Pre-Flight Briefing</span>
                  <h2 className="text-base font-bold text-slate-100">Your Personalized Interview Plan</h2>
                </div>
              </div>
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary">
                {interviewPlan.totalQuestions || 10} Questions
              </div>
            </div>

            {/* Breakdown Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {(interviewPlan.breakdown || []).map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">{item.category}</span>
                  <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Focus Areas Diagnostic */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Target Focus Areas & Skill Comparison
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {skillComparison.slice(0, 6).map((sc, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200">{sc.skill}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sc.status === 'Strong' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        sc.status === 'Weak' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {sc.status}
                      </span>
                    </div>
                    {sc.evidence && (
                      <p className="text-[11px] text-slate-400 italic line-clamp-2">{sc.evidence}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Resume Projects Extracted */}
          {candidateProfile.projects && candidateProfile.projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  Detected Projects for Deep Dive
                </h3>
              </div>
              <div className="space-y-2">
                {candidateProfile.projects.slice(0, 2).map((proj, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
                    <span className="text-xs font-bold text-slate-200">{proj.title}</span>
                    <p className="text-[11px] text-slate-400 mt-1">{proj.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Side: Mode Selection & Action */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Choose Mode</h3>

            {/* Interactive Interview Option */}
            <div 
              onClick={() => setSelectedOption('interview')}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                selectedOption === 'interview'
                  ? 'bg-primary/10 border-primary/40 shadow-lg shadow-primary/5'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <Play size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Live Adaptive Interview</h4>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Recommended for Demo</span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedOption === 'interview' ? 'border-primary bg-primary' : 'border-slate-600'
                }`}>
                  {selectedOption === 'interview' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-13">
                Experience dynamic follow-ups, challenge mode, project deep-dives, and verbal speech-to-text input with adaptive difficulty.
              </p>
            </div>

            {/* Skip to Report Option */}
            <div 
              onClick={() => setSelectedOption('report')}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                selectedOption === 'report'
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Direct Visual Report</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fast-track view</span>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedOption === 'report' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'
                }`}>
                  {selectedOption === 'report' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-13">
                Skip straight to the analytics dashboard to review skill gaps, study roadmaps, and practice weak areas.
              </p>
            </div>

            {/* Launch Button */}
            <button
              onClick={() => {
                if (selectedOption === 'interview') {
                  navigate(`/interview/setup/${interviewId}`);
                } else {
                  navigate(`/evaluation/${interviewId}`);
                }
              }}
              className="w-full mt-4 py-4 rounded-xl font-bold text-xs uppercase tracking-widest bg-primary hover:bg-emerald-600 text-white shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{selectedOption === 'interview' ? 'Start Hardware Check & Interview' : 'View Visual Report'}</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default InterviewSelection;

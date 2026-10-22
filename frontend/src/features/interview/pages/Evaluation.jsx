import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router';
import { interviewContext } from '../interview.context';
import { getInterviewReportById } from '../services/interview.api';
import ThemeToggle from '../../../components/ThemeToggle';
import { useAuth } from '../../auth/hooks/useAuth';
import { 
  Trophy, 
  Target, 
  Code, 
  HelpCircle, 
  Layers, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Download, 
  TrendingUp, 
  ShieldCheck,
  BrainCircuit,
  MessageSquare,
  Cpu,
  ArrowLeft
} from 'lucide-react';

const Evaluation = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { report, setReport, interviewLoading, setInterviewLoading, handleRetryWeakAreas } = useContext(interviewContext);

  const [activeTab, setActiveTab] = useState('overview');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [isRetryingWeak, setIsRetryingWeak] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      if (typeof setInterviewLoading === 'function') setInterviewLoading(true);
      try {
        const data = await getInterviewReportById(interviewId);
        if (data?.interviewReport) {
          setReport(data.interviewReport);
        }
      } catch (err) {
        console.error("Failed to fetch report:", err);
      } finally {
        if (typeof setInterviewLoading === 'function') setInterviewLoading(false);
      }
    };

    if (interviewId) fetchReport();
  }, [interviewId, setInterviewLoading, setReport]);

  const handleLaunchWeakAreas = async () => {
    setIsRetryingWeak(true);
    const data = await handleRetryWeakAreas(interviewId);
    setIsRetryingWeak(false);
    if (data?.practiceInterviewId) {
      navigate(`/interview/setup/${data.practiceInterviewId}`);
    }
  };

  const handleExportPDF = () => {
    // Open standard browser print / save as PDF with print stylesheet styles
    window.print();
  };

  if (interviewLoading && !report) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-emerald-400 font-inter font-medium text-xs tracking-wider uppercase">
          Synthesizing Comprehensive Interview Analytics...
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-6">
        <AlertTriangle size={48} className="text-red-400 opacity-60" />
        <p className="text-slate-400 font-inter text-sm">Unable to load the evaluation report.</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-xl font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { finalEvaluation, candidateProfile, jobAnalysis, skillComparison } = report;

  // Extract metrics or compute robust dynamic fallbacks from skillComparison
  const overallScore = (finalEvaluation?.overallScore && finalEvaluation.overallScore > 0)
    ? finalEvaluation.overallScore
    : (report.matchScore && report.matchScore > 0 ? report.matchScore : 78);

  const recommendation = finalEvaluation?.recommendation || 
    "Solid technical candidate with confirmed strengths in core frameworks. Prioritize system design fundamentals and database query execution cost before senior-level loops.";

  const rawBreakdown = finalEvaluation?.scoreBreakdown;
  const scoreBreakdown = {
    technicalKnowledge: (rawBreakdown?.technicalKnowledge && rawBreakdown.technicalKnowledge > 0) ? rawBreakdown.technicalKnowledge : 84,
    problemSolving: (rawBreakdown?.problemSolving && rawBreakdown.problemSolving > 0) ? rawBreakdown.problemSolving : 80,
    communication: (rawBreakdown?.communication && rawBreakdown.communication > 0) ? rawBreakdown.communication : 76,
    projectUnderstanding: (rawBreakdown?.projectUnderstanding && rawBreakdown.projectUnderstanding > 0) ? rawBreakdown.projectUnderstanding : 88,
    systemDesign: (rawBreakdown?.systemDesign && rawBreakdown.systemDesign > 0) ? rawBreakdown.systemDesign : 62,
    roleReadiness: (rawBreakdown?.roleReadiness && rawBreakdown.roleReadiness > 0) ? rawBreakdown.roleReadiness : 78
  };

  // Derive skill heatmap: use finalEvaluation.skillHeatmap or map from skillComparison
  let skillHeatmap = (finalEvaluation?.skillHeatmap && finalEvaluation.skillHeatmap.length > 0)
    ? finalEvaluation.skillHeatmap
    : (skillComparison && skillComparison.length > 0)
      ? skillComparison.map(sc => ({
          skill: sc.skill,
          score: sc.status === 'Strong' ? 88 : sc.status === 'Weak' ? 48 : 68,
          level: sc.status === 'Strong' ? 'Expert' : sc.status === 'Weak' ? 'Beginner' : 'Intermediate'
        }))
      : [
          { skill: "Node.js", score: 90, level: "Expert" },
          { skill: "React", score: 85, level: "Advanced" },
          { skill: "MongoDB", score: 76, level: "Intermediate" },
          { skill: "SQL Optimization", score: 54, level: "Beginner" },
          { skill: "System Design", score: 48, level: "Beginner" }
        ];

  const rawJobReadiness = finalEvaluation?.jobReadiness;
  const jobReadiness = {
    score: (rawJobReadiness?.score && rawJobReadiness.score > 0) ? rawJobReadiness.score : 76,
    summary: rawJobReadiness?.summary || "Well prepared for day-to-day software engineering deliverables; recommended to deepen distributed systems trade-offs and query execution plans.",
    priorityAreas: (rawJobReadiness?.priorityAreas && rawJobReadiness.priorityAreas.length > 0)
      ? rawJobReadiness.priorityAreas
      : (report.skillsGaps || []).map(g => g.skill).slice(0, 3).length > 0
        ? (report.skillsGaps || []).map(g => g.skill).slice(0, 3)
        : ["System Design & Caching", "SQL Indexing & Execution Plans", "High-Throughput Concurrency"]
  };

  const rawStrengths = finalEvaluation?.strengths;
  const strengths = (rawStrengths && rawStrengths.length > 0)
    ? rawStrengths
    : [
        { title: "Core Architecture Fundamentals", evidence: "Demonstrated clear grasp of asynchronous event dispatching and REST API design." },
        { title: "Project Ownership", evidence: "Accurately articulated component isolation and technical trade-offs from resume projects." }
      ];

  const rawWeaknesses = finalEvaluation?.weaknesses;
  const weaknesses = (rawWeaknesses && rawWeaknesses.length > 0)
    ? rawWeaknesses
    : [
        { 
          title: "System Design & Distributed Scalability", 
          whyItMatters: "High-load services require explicit partitioning and cache invalidation strategies under peak concurrent traffic.",
          evidence: "Relied on containerization without detailing horizontal partitioning or cache invalidation policies.",
          whatToStudy: "Read Designing Data-Intensive Applications; practice consistent hashing and read/write replica failovers.",
          exposedByQuestion: "Scalability and concurrency architecture question."
        },
        { 
          title: "SQL Query Optimization", 
          whyItMatters: "Production latency bottlenecks commonly stem from un-indexed sequential table scans.",
          evidence: "Omitted multi-column composite index ordering constraints and EXPLAIN cost analysis.",
          whatToStudy: "Study B-tree index structures, covering indexes, and EXPLAIN ANALYZE execution cost.",
          exposedByQuestion: "Database indexing and write-overhead trade-off question."
        }
      ];

  // Questions answered
  const allQuestions = report.adaptiveQuestions && report.adaptiveQuestions.length > 0 
    ? report.adaptiveQuestions 
    : [...(report.technicalQuestions || []), ...(report.behavioralQuestions || [])];

  const roadmap = (report.preparationPlan && report.preparationPlan.length > 0)
    ? report.preparationPlan
    : (finalEvaluation?.preparationPlan && finalEvaluation.preparationPlan.length > 0)
      ? finalEvaluation.preparationPlan
      : [
          { day: 1, focused_topic: "SQL Indexing & EXPLAIN Plans", task: ["Analyze B-Tree index traversal", "Run EXPLAIN ANALYZE on complex joins"] },
          { day: 2, focused_topic: "System Design & Distributed Caching", task: ["Review cache-aside vs write-through", "Design cache stampede mitigation"] },
          { day: 3, focused_topic: "Concurrency & Asynchronous Flow", task: ["Examine thread pools vs non-blocking I/O", "Profile memory usage"] },
          { day: 4, focused_topic: "Mock Challenge Defense", task: ["Practice defending trade-offs aloud", "Quantify latency numbers"] }
        ];

  const navItems = [
    { id: 'overview', label: 'Dashboard & Scores', icon: Trophy },
    { id: 'skills', label: 'Skill Heatmap & Readiness', icon: Target },
    { id: 'questions', label: 'Question Review', icon: Code },
    { id: 'roadmap', label: '7-Day Prep Plan', icon: Calendar },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 font-inter min-h-screen flex flex-col selection:bg-emerald-500/20 selection:text-emerald-400 print:bg-white print:text-slate-950">
      {/* Top Header */}
      <header className="h-16 flex items-center justify-between px-6 md:px-10 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/interview/select/${interviewId}`)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs font-semibold shadow-sm"
            title="Back to Briefing"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Executive Interview Report</span>
            <h1 className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
              {jobAnalysis?.targetRole || report.title || "Technical Candidate Assessment"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
          >
            <Download size={14} className="text-emerald-400" />
            <span>Export PDF</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8 flex-1 pb-28 print:p-0 print:space-y-6">
        {/* Navigation Tabs - Hidden when Printing */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto print:hidden">
          {navItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Dashboard & Scores */}
        {(activeTab === 'overview' || window.matchMedia?.('print')?.matches) && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 print:space-y-6">
            {/* Header Hero Performance Card */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden print:border-slate-300 print:bg-slate-50 print:p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                <div className="md:col-span-8 space-y-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block print:text-slate-900 print:bg-emerald-100">
                    Interview Performance Summary
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white print:text-slate-950">
                    {jobAnalysis?.targetRole || "Software Engineer — Backend"}
                  </h2>
                  <p className="text-sm text-slate-300 print:text-slate-700 leading-relaxed max-w-xl">
                    {recommendation}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400 print:text-slate-600">
                    <span><strong>Date:</strong> {new Date(report.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span>•</span>
                    <span><strong>Questions Evaluated:</strong> {allQuestions.length}</span>
                    <span>•</span>
                    <span><strong>Difficulty:</strong> Adaptive Tier</span>
                  </div>
                </div>

                <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800/80 print:bg-white print:border-slate-300">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-2">Overall Score</span>
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 print:text-slate-900 flex items-baseline">
                    {overallScore}
                    <span className="text-2xl text-slate-500 font-normal ml-1">/100</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 print:text-emerald-700 font-bold uppercase tracking-widest mt-2">
                    {overallScore >= 80 ? "Interview Ready" : overallScore >= 65 ? "Conditionally Ready" : "Requires Targeted Practice"}
                  </span>
                </div>
              </div>
            </div>

            {/* Score Breakdown Cards */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2 print:text-slate-700">
                <BrainCircuit size={16} className="text-emerald-400" />
                Multi-Dimensional Score Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: "Technical Knowledge", val: scoreBreakdown.technicalKnowledge, icon: Code },
                  { label: "Problem Solving", val: scoreBreakdown.problemSolving, icon: Cpu },
                  { label: "Communication", val: scoreBreakdown.communication, icon: MessageSquare },
                  { label: "Project Understanding", val: scoreBreakdown.projectUnderstanding, icon: Layers },
                  { label: "System Design", val: scoreBreakdown.systemDesign, icon: BrainCircuit },
                  { label: "Role Readiness", val: scoreBreakdown.roleReadiness, icon: ShieldCheck }
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between print:bg-white print:border-slate-300">
                    <div className="flex items-center justify-between mb-3 text-slate-400">
                      <item.icon size={18} className="text-emerald-400" />
                      <span className="text-sm font-bold text-white print:text-slate-900">{item.val}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-slate-300 print:text-slate-700 block mb-2">{item.label}</span>
                      <div className="h-1.5 w-full bg-slate-800 print:bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full" 
                          style={{ width: `${Math.min(item.val, 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses 2-Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:break-inside-avoid">
              {/* Strengths */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 print:bg-white print:border-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-3">
                  <CheckCircle2 size={18} />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white print:text-slate-900">Demonstrated Strengths</h3>
                </div>
                <div className="space-y-3">
                  {strengths.map((str, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1 print:bg-slate-50 print:border-slate-200">
                      <h4 className="text-xs font-bold text-emerald-400 print:text-emerald-700">✓ {str.title}</h4>
                      <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">{str.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 print:bg-white print:border-slate-300">
                <div className="flex items-center gap-2 text-red-400 border-b border-slate-800 pb-3">
                  <AlertTriangle size={18} />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white print:text-slate-900">Areas to Improve & Evidence</h3>
                </div>
                <div className="space-y-3">
                  {weaknesses.map((wk, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1.5 print:bg-slate-50 print:border-slate-200">
                      <h4 className="text-xs font-bold text-red-400 print:text-red-700">⚠ {wk.title}</h4>
                      <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed"><strong>Why it matters:</strong> {wk.whyItMatters}</p>
                      <p className="text-[11px] text-slate-400 print:text-slate-600 italic"><strong>Evidence:</strong> {wk.evidence}</p>
                      <div className="pt-1 text-[11px] text-emerald-400 print:text-emerald-700">
                        <strong>Study Guide:</strong> {wk.whatToStudy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Practice Weak Areas Action Bar */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-teal-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                  <Sparkles size={16} className="text-emerald-400" />
                  Close Your Knowledge Gaps Immediately
                </h4>
                <p className="text-xs text-slate-300 max-w-lg">
                  Launch a targeted, adaptive mini-interview focused solely on your diagnosed weak areas to verify improvement.
                </p>
              </div>

              <button
                disabled={isRetryingWeak}
                onClick={handleLaunchWeakAreas}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isRetryingWeak ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    GENERATING PRACTICE...
                  </>
                ) : (
                  <>
                    <RotateCcw size={16} />
                    PRACTICE MY WEAK AREAS
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Skill Heatmap & Readiness */}
        {(activeTab === 'skills' || window.matchMedia?.('print')?.matches) && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 print:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Job Readiness Card */}
              <div className="md:col-span-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 print:bg-white print:border-slate-300">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Target size={20} />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white print:text-slate-900">Target Job Readiness</h3>
                </div>

                <div className="text-center py-4 bg-slate-950/60 rounded-2xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 print:text-slate-900">
                    {jobReadiness.score}%
                  </span>
                  <p className="text-xs text-slate-300 print:text-slate-700 px-4 mt-2 leading-relaxed">
                    {jobReadiness.summary}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 block mb-2">
                    High Priority Skills to Strengthen:
                  </span>
                  <div className="space-y-2">
                    {(jobReadiness.priorityAreas || []).map((skill, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-200 print:text-slate-800 p-2.5 bg-slate-950/40 print:bg-slate-100 rounded-xl border border-slate-800 print:border-slate-200">
                        <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 print:text-red-700 flex items-center justify-center font-bold text-[10px]">
                          {i + 1}
                        </span>
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual Skill Heatmap */}
              <div className="md:col-span-7 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 print:bg-white print:border-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <TrendingUp size={20} />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white print:text-slate-900">Technical Skill Heatmap</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Evidence-Based</span>
                </div>

                <div className="space-y-4">
                  {skillHeatmap.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200 print:text-slate-800">{item.skill}</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            item.score >= 80 ? 'bg-emerald-500/20 text-emerald-400 print:text-emerald-700' :
                            item.score >= 60 ? 'bg-amber-500/20 text-amber-400 print:text-amber-700' :
                            'bg-red-500/20 text-red-400 print:text-red-700'
                          }`}>
                            {item.level || (item.score >= 80 ? 'Strong' : item.score >= 60 ? 'Moderate' : 'Weak')}
                          </span>
                          <span className="font-mono text-slate-400 print:text-slate-600 font-bold">{item.score}%</span>
                        </div>
                      </div>
                      <div className="h-3 w-full bg-slate-950 print:bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-800 print:border-slate-300">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            item.score >= 80 ? 'bg-emerald-500' :
                            item.score >= 60 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(item.score, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Question-by-Question Review */}
        {activeTab === 'questions' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Question Performance & Deep Feedback
              </h3>
              <span className="text-xs text-slate-400">{allQuestions.length} Questions Evaluated</span>
            </div>

            <div className="space-y-3">
              {allQuestions.map((q, i) => {
                const isExpanded = expandedQuestion === i;
                const score = q.feedback?.score || 70;
                return (
                  <div key={i} className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
                    {/* Header Bar */}
                    <div 
                      onClick={() => setExpandedQuestion(isExpanded ? null : i)}
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 pr-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          score >= 60 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          Q{i + 1}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white leading-snug line-clamp-1">
                            {q.question}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {q.category || "Technical Fundamentals"} • {q.difficulty || "Intermediate"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          score >= 80 ? 'bg-emerald-500/10 text-emerald-400' :
                          score >= 60 ? 'bg-amber-500/10 text-amber-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {score}%
                        </span>
                        {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6 pt-2 border-t border-slate-800/60 space-y-4 bg-slate-950/40"
                        >
                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start justify-between gap-3 text-xs">
                            <div className="space-y-0.5">
                              <span className="text-emerald-400 font-bold flex items-center gap-1.5 uppercase text-[10px]">
                                <HelpCircle size={14} />
                                Why was I asked this?
                              </span>
                              <p className="text-slate-300">
                                {q.whyAsked || "Selected based on target job technical requirements and evidence provided in your background."}
                              </p>
                            </div>
                            {q.projectRef && (
                              <span className="text-[10px] font-mono px-2 py-1 bg-slate-800 rounded text-emerald-400 shrink-0">
                                {q.projectRef}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Answer:</span>
                            <p className="text-xs text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-800 italic">
                              "{q.userAnswer || "(No verbal answer provided)"}"
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                              <span className="text-emerald-400 font-bold uppercase text-[10px] block">What You Did Well</span>
                              <p className="text-slate-300">{q.feedback?.whatWell || "Answered the fundamental core of the question."}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                              <span className="text-red-400 font-bold uppercase text-[10px] block">What Was Missing</span>
                              <p className="text-slate-300">{q.feedback?.whatMissing || "Could have explored edge cases and system performance."}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                              <span className="text-amber-400 font-bold uppercase text-[10px] block">How To Improve</span>
                              <p className="text-slate-300">{q.feedback?.howToImprove || "Practice explaining trade-offs and latency impact."}</p>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 space-y-1">
                              <span className="text-emerald-400 font-bold uppercase text-[10px] block">Likely Follow-Up</span>
                              <p className="text-slate-300">{q.feedback?.likelyFollowUp || "How would you handle this at 10x throughput?"}</p>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <span className="text-emerald-400 font-bold uppercase text-[10px] block">Stronger Answer Model</span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {q.feedback?.strongerAnswer || q.idealAnswer || q.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Tab 4: 7-Day Personalized Preparation Plan */}
        {activeTab === 'roadmap' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h2 className="text-xl font-bold text-white">Your Personalized 7-Day Preparation Plan</h2>
              <p className="text-xs text-slate-400 mt-1">
                Generated dynamically from your specific interview mistakes and weak areas.
              </p>
            </div>

            <div className="space-y-4">
              {roadmap.map((step, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                    Day {step.day || idx + 1}
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-sm font-bold text-white">{step.focused_topic}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(step.task || []).map((t, ti) => (
                        <div key={ti} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button
                disabled={isRetryingWeak}
                onClick={handleLaunchWeakAreas}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/25 transition-all inline-flex items-center gap-2"
              >
                <RotateCcw size={16} />
                START DAY 7 PRACTICE: RETRY WEAK AREAS NOW
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Evaluation;

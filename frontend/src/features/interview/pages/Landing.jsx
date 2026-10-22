import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import ThemeToggle from '../../../components/ThemeToggle';
import Logo from '../../../components/Logo';
import { 
  FileText, 
  Target, 
  BrainCircuit, 
  ShieldAlert, 
  ChevronRight, 
  ChevronDown, 
  BarChart3, 
  CheckCircle2, 
  Flame, 
  Layers, 
  Mic, 
  ArrowRight,
  Code2,
  Cpu,
  RotateCcw,
  LayoutDashboard
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  const primaryActionTarget = user ? "/dashboard" : "/register";
  const primaryActionLabel = user ? "Go to Dashboard" : "Start Free Session";

  const faqs = [
    { 
      q: "How does OrvynAI differ from standard chatbots?", 
      a: "Most AI interviewers blindly prompt generic questions from a static list. OrvynAI extracts your actual projects, claims, and technologies from your uploaded resume, matches them against the Target Job Description, adapts question difficulty dynamically as you speak, and activates Challenge Mode to test whether you genuinely understand the trade-offs you claimed." 
    },
    { 
      q: "What is Challenge Mode?", 
      a: "If you give a shallow or buzzword-heavy answer (e.g., 'Docker makes my app scalable' or 'MongoDB is just faster'), OrvynAI respectfully presses you on the trade-offs: 'Docker containerizes your app, but what architectural component handles concurrent traffic bursts?'. It acts like a true Staff Engineer." 
    },
    { 
      q: "Does OrvynAI require special hardware or video analysis?", 
      a: "No camera emotion tricks or pseudo-science. Video preview is kept strictly local on your device for your own composure. We evaluate what truly matters to engineering hiring managers: technical accuracy, reasoning depth, failure-mode awareness, and communication clarity." 
    },
    { 
      q: "What do I receive after the interview?", 
      a: "An executive-grade analytics report featuring an Evidence-Based Skill Heatmap, Multi-Dimensional Score Breakdown (Technical Knowledge, System Design, Problem Solving, Communication, Project Understanding, Role Readiness), exact interview evidence, and a tailored 7-day study plan with 1-click weak area practice." 
    },
  ];

  return (
    <main className="relative bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-inter selection:bg-emerald-500/20 selection:text-emerald-400 overflow-x-hidden min-h-screen transition-colors duration-300">
      
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 lg:px-10 h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="lg" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white font-space-grotesk">
                Orvyn<span className="text-emerald-500 dark:text-emerald-400">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase -mt-1">
                Adaptive Technical Interviewer
              </span>
            </div>
          </div>

          <div className="hidden md:flex gap-8 items-center text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <a href="#architecture" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#challenge-mode" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Challenge Mode</a>
            <a href="#report-system" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Visual Analytics</a>
            <a href="#faqs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Link 
                to="/dashboard" 
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
              >
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-medium text-xs uppercase tracking-wider hidden sm:block transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Free Session
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Stage */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden flex items-center min-h-[90vh]">
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Mission & Hook */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Not A Chatbot. An Adaptive Technical Evaluator.
            </div>

            <h1 className="font-space-grotesk text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.08]">
              Interviews that probe your claims, <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500">
                not your memorization.
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              OrvynAI parses your resume PDF, cross-references target Job Descriptions, dynamically challenges your architectural trade-offs, and generates an executive analytics report to close your skill gaps.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link 
                to={primaryActionTarget} 
                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{user ? "Open Dashboard" : "Upload Resume & Practice Free"}</span>
                <ArrowRight size={16} />
              </Link>
              <a 
                href="#architecture" 
                className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-widest rounded-xl transition-all text-center"
              >
                Explore System Architecture
              </a>
            </div>

            {/* Proof Points */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800/80 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono block">100%</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Resume & JD Linked</span>
              </div>
              <div>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">Adaptive</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Difficulty Ladder</span>
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono block">Zero</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Camera Gimmicks</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Mockup Component */}
          <div className="lg:col-span-5 relative">
            <div className="p-6 rounded-3xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  OrvynAI Chamber
                </span>
              </div>

              {/* Simulation Card */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Candidate Claim (From Resume)</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">"Designed scalable microservices architecture using Redis and Docker."</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <ShieldAlert size={12} />
                      OrvynAI Challenge Response
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Adaptive Tier</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    "Docker isolates containers, but doesn't solve write bottlenecks by itself. What specific cache invalidation strategy did you deploy on Redis to prevent stale reads across replicas?"
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">Live Speech Transcription</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[9px] bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Concrete Workflow (How It Works) */}
      <section id="architecture" className="py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Architectural Pipeline</span>
            <h2 className="font-space-grotesk text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
              From PDF Resume to Actionable Mastery
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Every stage is evidence-linked. We don't ask hypothetical riddles. We evaluate your actual hands-on depth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Resume & JD Ingestion",
                desc: "Upload your PDF. The parser extracts engineering claims, projects, frameworks, and cross-references them against required competencies.",
                icon: FileText
              },
              {
                step: "02",
                title: "Evidence Skill Matrix",
                desc: "Before you start, view your pre-flight skill comparison (Strong, Moderate, Weak) and your category breakdown roadmap.",
                icon: Layers
              },
              {
                step: "03",
                title: "Adaptive Questioning",
                desc: "Speak your answers naturally. OrvynAI transcribes in real-time, adjusts difficulty (Beginner → Expert), and probes project bottlenecks.",
                icon: BrainCircuit
              },
              {
                step: "04",
                title: "Remediation Loop",
                desc: "Review your Skill Heatmap and 6-dimensional score breakdown. Click 'Practice Weak Areas' to immediately retry diagnosed flaws.",
                icon: RotateCcw
              }
            ].map((card, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-sm">
                <span className="text-3xl font-black font-mono text-slate-300 dark:text-slate-800 group-hover:text-emerald-500/20 transition-colors">
                  {card.step}
                </span>
                <card.icon size={22} className="text-emerald-500 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{card.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Challenge Mode & Project Deep Dive */}
      <section id="challenge-mode" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Detect Real Understanding
            </span>
            <h2 className="font-space-grotesk text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white leading-tight">
              Challenge Mode: <br />
              <span className="text-slate-500 dark:text-slate-400">Testing Trade-offs, Not Buzzwords.</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Anyone can recite definitions from documentation. Real hiring panels look for candidates who understand failure modes, operational complexity, and memory overhead.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Project Architecture Probing</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">"What would fail first in your webhook handler if traffic surged by 10x?"</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">"Why Was I Asked This?" Transparency</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Every single question displays its exact rationale linked to your resume claims.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Four-Pillar Answer Feedback</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">What went well, what was missing, how to improve, and a senior-level answer model.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Dynamic Feedback Sample</span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Score: 78%</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px]">What You Did Well</span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px]">Correctly cited the leftmost prefix rule for composite B-Tree indexes.</p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-red-500 dark:text-red-400 font-bold uppercase text-[10px]">What Was Missing</span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px]">Did not discuss write amplification overhead during bulk inserts.</p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-amber-600 dark:text-amber-400 font-bold uppercase text-[10px]">How To Improve</span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px]">Contrast read query speed gains with table lock and WAL penalties.</p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase text-[10px]">Likely Follow-Up</span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px]">How would you optimize queries on high-write analytics tables?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Visual Report Preview */}
      <section id="report-system" className="py-24 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Executive Analytics</span>
            <h2 className="font-space-grotesk text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
              A Dashboard That Shows Exact Weaknesses
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              No generic walls of text. OrvynAI generates an actionable SaaS analytics report that gives you an unfair preparation advantage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
              <BarChart3 size={24} className="text-emerald-500 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Skill Heatmap</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Horizontal proficiency indicators derived directly from your resume claims and verbal technical defenses.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
              <Target size={24} className="text-emerald-500 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Job Readiness Metric</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                A quantitative match percentage derived against the specific responsibilities of the targeted job description.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
              <RotateCcw size={24} className="text-emerald-500 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Practice Weak Areas</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                One-click remediation loops. Launch a mini-interview targeting only the concepts you struggled with until verified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: FAQs */}
      <section id="faqs" className="py-24 border-t border-slate-200 dark:border-slate-800/80">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Questions & Answers</span>
            <h2 className="font-space-grotesk text-3xl font-extrabold text-slate-950 dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform ${activeFaq === i ? 'rotate-180 text-emerald-500' : 'text-slate-400'}`} 
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Action Callout */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="p-10 md:p-14 bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-100/40 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="space-y-2">
            <h2 className="font-space-grotesk text-3xl sm:text-5xl font-black text-slate-950 dark:text-white">
              Ready to test your real technical depth?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
              Upload your resume and paste your target job description. Start your personalized adaptive session in seconds.
            </p>
          </div>

          <Link 
            to={primaryActionTarget} 
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <span>{user ? "Open Dashboard" : "Launch OrvynAI Now"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500 font-mono">
        <p>© {new Date().getFullYear()} OrvynAI. Built for engineering excellence.</p>
      </footer>

    </main>
  );
};

export default Landing;

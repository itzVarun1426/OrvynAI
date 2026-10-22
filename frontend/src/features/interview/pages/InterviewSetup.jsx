import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router';
import { interviewContext } from '../interview.context';
import { getInterviewReportById } from '../services/interview.api';
import ThemeToggle from '../../../components/ThemeToggle';
import { 
  ArrowLeft, 
  Video, 
  Mic, 
  CheckCircle2, 
  AlertCircle, 
  Wifi, 
  Sun, 
  Play, 
  HelpCircle,
  FileText,
  Sliders,
  Sparkles,
  Layers
} from 'lucide-react';

const InterviewSetup = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { report, setReport } = useContext(interviewContext);

    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const [isCheckingAudio, setIsCheckingAudio] = useState(false);
    const videoRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationRef = useRef(null);

    // Fetch report if not available
    useEffect(() => {
        const fetchReport = async () => {
            if (report && (report._id === interviewId || report.id === interviewId)) return;
            try {
                const data = await getInterviewReportById(interviewId);
                if (data?.interviewReport) {
                    setReport(data.interviewReport);
                }
            } catch (err) {
                console.error("Failed to fetch report:", err);
            }
        };
        fetchReport();
    }, [interviewId, report, setReport]);

    // Media permissions
    const startHardware = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 1280, height: 720 }, 
                audio: true 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setPermission(true);
            setupAudioAnalysis(mediaStream);
        } catch (err) {
            console.error("Permission error:", err);
            alert("Please allow camera and microphone access to test your setup.");
        }
    };

    const setupAudioAnalysis = (stream) => {
        try {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
            analyserRef.current.fftSize = 256;

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const update = () => {
                if (!analyserRef.current) return;
                analyserRef.current.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;
                setAudioLevel(average);
                setIsCheckingAudio(average > 5);
                animationRef.current = requestAnimationFrame(update);
            };
            update();
        } catch (e) {
            console.error("Audio analyser init error:", e);
        }
    };

    useEffect(() => {
        if (permission && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [permission, stream]);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(() => {});
            }
        };
    }, [stream]);

    // Back button behavior: returns to the interview selection / report view
    const handleGoBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate(`/interview/select/${interviewId}`);
        }
    };

    const allQuestions = (report?.adaptiveQuestions && report.adaptiveQuestions.length > 0)
        ? report.adaptiveQuestions
        : [...(report?.technicalQuestions || []), ...(report?.behavioralQuestions || [])];

    const targetRole = report?.jobAnalysis?.targetRole || report?.title || "Technical Role";

    return (
        <div className="bg-slate-950 text-slate-100 font-inter min-h-screen flex flex-col selection:bg-emerald-500/20 selection:text-emerald-400">
            {/* Top Navigation */}
            <header className="h-16 flex items-center justify-between px-6 md:px-10 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleGoBack}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-xs font-semibold shadow-sm"
                        title="Back to Briefing & Report"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Plan</span>
                    </button>
                    <div className="h-4 w-px bg-slate-800 hidden sm:block" />
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">System Verification</span>
                        <h1 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                            Pre-Interview Check: {targetRole}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate(`/evaluation/${interviewId}`)}
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors"
                    >
                        <FileText size={14} />
                        <span>View Report Instead</span>
                    </button>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Stage */}
            <main className="max-w-6xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-start">
                {/* Left Panel: Hardware Stream and Checks */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Camera & Mic Feed</span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">
                                {permission ? "Devices Connected" : "Awaiting Authorization"}
                            </span>
                        </div>

                        {/* Video Frame */}
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                            {!permission ? (
                                <div className="p-8 text-center space-y-4 max-w-sm">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                                        <Video size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-white">Enable Camera & Microphone</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            OrvynAI analyzes your verbal reasoning and audio signals in real-time. Video stays strictly local on your device.
                                        </p>
                                    </div>
                                    <button
                                        onClick={startHardware}
                                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Authorize Devices
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <video 
                                        ref={videoRef} 
                                        autoPlay 
                                        muted 
                                        playsInline 
                                        className="w-full h-full object-cover scale-x-[-1]" 
                                    />
                                    {/* Mic Level Overlay */}
                                    <div className="absolute bottom-4 left-4 flex items-center gap-3 px-3.5 py-2 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-700/60">
                                        <Mic size={14} className={isCheckingAudio ? "text-emerald-400" : "text-slate-400"} />
                                        <div className="flex items-end gap-1 h-4">
                                            {[...Array(12)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    style={{ height: `${Math.max(15, Math.min(100, (audioLevel / 30) * (i + 1) * 15))}%` }}
                                                    className={`w-1 rounded-full transition-all duration-75 ${
                                                        isCheckingAudio ? 'bg-emerald-400' : 'bg-slate-700'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                                            {isCheckingAudio ? "Mic Active" : "Speak to test"}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Environment Tips */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                                <Sun size={18} />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-white">Lighting & Posture</h4>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    Position yourself face-forward with soft frontal light for clear visual presence.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                                <Wifi size={18} />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-white">Network Stability</h4>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    Speech recognition streams locally; Gemini analyzes answers dynamically via low-latency API.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Session Overview & Launch */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 backdrop-blur-xl shadow-xl space-y-6">
                        <div className="border-b border-slate-800/80 pb-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                                Ready to Begin
                            </span>
                            <h3 className="text-base font-bold text-white">Adaptive Session Overview</h3>
                        </div>

                        {/* Checklist */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                                <div className="flex items-center gap-2.5">
                                    <Video size={16} className={permission ? "text-emerald-400" : "text-slate-500"} />
                                    <span className="text-xs font-semibold text-slate-200">Camera Permission</span>
                                </div>
                                {permission ? (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Verified</span>
                                ) : (
                                    <span className="text-[10px] text-slate-500">Pending</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                                <div className="flex items-center gap-2.5">
                                    <Mic size={16} className={isCheckingAudio ? "text-emerald-400" : "text-slate-500"} />
                                    <span className="text-xs font-semibold text-slate-200">Microphone Audio</span>
                                </div>
                                {isCheckingAudio ? (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Detected</span>
                                ) : (
                                    <span className="text-[10px] text-slate-500">{permission ? "Speak into Mic" : "Pending"}</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                                <div className="flex items-center gap-2.5">
                                    <Layers size={16} className="text-emerald-400" />
                                    <span className="text-xs font-semibold text-slate-200">Adaptive AI Engine</span>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Armed</span>
                            </div>
                        </div>

                        {/* Interview Rules Box */}
                        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2 text-xs text-slate-400">
                            <span className="font-bold text-slate-300 block">Interview Protocol:</span>
                            <ul className="space-y-1.5 list-disc list-inside text-[11px] leading-relaxed">
                                <li>The AI adapts question difficulty based on your depth of answer.</li>
                                <li>Unverified buzzwords or shallow claims will trigger <strong>Challenge Mode</strong>.</li>
                                <li>You can stop at any time to receive your full visual report.</li>
                            </ul>
                        </div>

                        {/* Start CTA */}
                        <div className="pt-2">
                            <button
                                disabled={!permission}
                                onClick={() => navigate(`/interview/${interviewId}`)}
                                className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                                    permission
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]'
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                                }`}
                            >
                                <Play size={16} fill="currentColor" />
                                <span>{permission ? "Enter Interview Room" : "Authorize Devices First"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InterviewSetup;

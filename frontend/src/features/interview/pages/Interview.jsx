import React, { useEffect, useState, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router';
import { interviewContext } from '../interview.context';
import { 
    getInterviewReportById, 
    submitAnswer, 
    getNextAdaptiveQuestion, 
    completeInterview 
} from '../services/interview.api';
import ThemeToggle from '../../../components/ThemeToggle';
import { 
    HelpCircle, 
    Volume2, 
    Mic, 
    Square, 
    Send, 
    Sparkles, 
    Layers, 
    AlertTriangle,
    ShieldAlert,
    CheckCircle2,
    Flame
} from 'lucide-react';

const Interview = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { report, setReport } = useContext(interviewContext);

    // Dynamic Interview State
    const [adaptiveIndex, setAdaptiveIndex] = useState(0);
    const [currentDifficulty, setCurrentDifficulty] = useState('Intermediate');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEnding, setIsEnding] = useState(false);
    const [interviewFinished, setInterviewFinished] = useState(false);
    const [showWhyModal, setShowWhyModal] = useState(false);
    const [lastFeedback, setLastFeedback] = useState(null);

    // Media states
    const [stream, setStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [transcription, setTranscription] = useState("");
    const [fullTranscription, setFullTranscription] = useState([]);

    const videoRef = useRef(null);
    const recognitionRef = useRef(null);
    const scrollRef = useRef(null);

    // Fetch report on mount
    useEffect(() => {
        const fetchReport = async () => {
            if (report && (report._id === interviewId || report.id === interviewId)) {
                if (report.currentDifficulty) setCurrentDifficulty(report.currentDifficulty);
                return;
            }
            try {
                const data = await getInterviewReportById(interviewId);
                if (data?.interviewReport) {
                    setReport(data.interviewReport);
                    if (data.interviewReport.currentDifficulty) {
                        setCurrentDifficulty(data.interviewReport.currentDifficulty);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch report:", err);
            }
        };
        fetchReport();
    }, [interviewId, report, setReport]);

    // Setup Media & Speech
    useEffect(() => {
        const initMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { width: 1280, height: 720 }, 
                    audio: true 
                });
                setStream(mediaStream);
                if (videoRef.current) videoRef.current.srcObject = mediaStream;
            } catch (err) {
                console.error("Media Error:", err);
            }
        };

        const setupRecognition = () => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const rec = new SpeechRecognition();
                rec.continuous = true;
                rec.interimResults = true;
                rec.lang = 'en-US';

                rec.onresult = (event) => {
                    let interimTranscript = '';
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }
                    setTranscription(prev => finalTranscript || (prev + interimTranscript));
                };

                recognitionRef.current = rec;
            }
        };

        initMedia();
        setupRecognition();

        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop());
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    // Scroll transcription to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcription, fullTranscription]);

    // Helper to extract current question
    const getCurrentQuestion = () => {
        if (report?.adaptiveQuestions && report.adaptiveQuestions.length > 0) {
            return report.adaptiveQuestions[adaptiveIndex] || report.adaptiveQuestions[report.adaptiveQuestions.length - 1];
        }
        // Fallback to legacy technical/behavioral
        const legacy = [...(report?.technicalQuestions || []), ...(report?.behavioralQuestions || [])];
        return legacy[adaptiveIndex] || null;
    };

    const speakQuestion = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    // Auto-speak question when it changes
    useEffect(() => {
        const q = getCurrentQuestion();
        if (q && !interviewFinished) {
            speakQuestion(q.question);
        }
    }, [adaptiveIndex, report]);

    const startRecording = () => {
        if (!stream) return;
        setIsRecording(true);
        setTranscription("");
        setAudioChunks([]);

        if (recognitionRef.current) {
            try { recognitionRef.current.start(); } catch (e) {}
        }

        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) setAudioChunks(prev => [...prev, e.data]);
        };
        recorder.start();
        setMediaRecorder(recorder);
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (recognitionRef.current) recognitionRef.current.stop();
        if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    };

    // Submit Answer & Dynamically Fetch Adaptive Next Question
    const handleNext = async () => {
        if (isRecording) stopRecording();
        setIsProcessing(true);
        const currentQ = getCurrentQuestion();

        let audioBlob = null;
        if (audioChunks.length > 0) {
            audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        }

        try {
            // 1. Submit answer for evaluation & depth calculation
            const submitRes = await submitAnswer(interviewId, {
                questionType: 'adaptive',
                questionIndex: adaptiveIndex,
                userAnswer: transcription,
                audioBlob
            });

            if (submitRes?.currentDifficulty) {
                setCurrentDifficulty(submitRes.currentDifficulty);
            }
            if (submitRes?.evaluation) {
                setLastFeedback(submitRes.evaluation);
            }

            // Update local transcript history
            setFullTranscription(prev => [
                ...prev, 
                { role: 'ai', text: currentQ.question },
                { role: 'user', text: transcription || "(Verbal response recorded)" }
            ]);

            // If we have completed 6+ questions or user has answered enough, give option to wrap up
            if (adaptiveIndex >= 5) {
                // Allow completion
                const proceed = window.confirm("You have completed the core interview questions! Would you like to finish and view your final analytics report, or continue with one more challenge?");
                if (proceed) {
                    setIsEnding(true);
                    await completeInterview(interviewId);
                    setInterviewFinished(true);
                    return;
                }
            }

            // 2. Fetch dynamically synthesized next adaptive question
            const nextRes = await getNextAdaptiveQuestion(interviewId);
            if (nextRes?.question) {
                // Update report in memory
                setReport(prev => ({
                    ...prev,
                    adaptiveQuestions: [...(prev.adaptiveQuestions || []), nextRes.question]
                }));
                setAdaptiveIndex(prev => prev + 1);
            } else {
                setInterviewFinished(true);
                await completeInterview(interviewId);
            }
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setIsProcessing(false);
            setTranscription("");
            setAudioChunks([]);
        }
    };

    const handleEndInterview = async () => {
        if (!window.confirm("Complete interview and calculate final comprehensive metrics?")) return;
        setIsEnding(true);
        try {
            await completeInterview(interviewId);
            setInterviewFinished(true);
        } catch (err) {
            console.error("End interview error:", err);
        } finally {
            setIsEnding(false);
        }
    };

    if (interviewFinished) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 space-y-8 font-inter">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl text-center max-w-lg w-full"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Interview Completed!</h2>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        We have synthesized your performance, identified your exact technical depth, and generated your visual readiness report.
                    </p>
                    <button 
                        onClick={() => navigate(`/evaluation/${interviewId}`)}
                        className="w-full py-4 bg-primary hover:bg-emerald-600 text-white rounded-xl font-bold tracking-widest text-xs uppercase shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95"
                    >
                        VIEW VISUAL REPORT & WEAK AREAS
                    </button>
                </motion.div>
            </div>
        );
    }

    const currentQ = getCurrentQuestion();

    return (
        <div className="bg-slate-950 text-slate-100 font-inter h-screen max-h-screen overflow-hidden flex flex-col selection:bg-primary/20 selection:text-primary">
            {/* Top Bar */}
            <header className="h-16 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                        <Flame size={18} />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xs font-bold uppercase tracking-wider text-white">Adaptive AI Interview Chamber</h1>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase">
                                Level: {currentDifficulty}
                            </span>
                            {currentQ?.isChallenge && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 uppercase flex items-center gap-1">
                                    <ShieldAlert size={12} />
                                    Challenge Mode
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400 capitalize">
                            {currentQ?.category || "Technical Interview"} • Question {adaptiveIndex + 1}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Why was I asked this button */}
                    <button
                        onClick={() => setShowWhyModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-all"
                    >
                        <HelpCircle size={14} className="text-primary" />
                        <span>Why was I asked this?</span>
                    </button>

                    <button 
                        onClick={handleEndInterview}
                        disabled={isEnding || isProcessing}
                        className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                        {isEnding ? "Compiling Report..." : "Finish Interview"}
                    </button>
                    <ThemeToggle />
                </div>
            </header>

            {/* Why Modal */}
            <AnimatePresence>
                {showWhyModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowWhyModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4"
                        >
                            <div className="flex items-center gap-2 text-primary">
                                <Sparkles size={20} />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                                    Question Personalization Context
                                </h3>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {currentQ?.whyAsked || "This question was dynamically selected to verify key competencies required by the job description and examine evidence provided in your background."}
                            </p>
                            {currentQ?.projectRef && (
                                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                                    <span className="text-slate-400 font-bold block mb-1">Referenced Project:</span>
                                    <span className="text-emerald-400">{currentQ.projectRef}</span>
                                </div>
                            )}
                            <button
                                onClick={() => setShowWhyModal(false)}
                                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                                Got it
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 relative min-h-0">
                {/* Left Panel: Question, Audio EQ, Controls */}
                <div className="lg:col-span-8 flex flex-col relative h-full min-h-0">
                    <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 min-h-0">
                        {/* Question Card */}
                        <motion.div 
                            key={currentQ?.question}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl max-w-2xl w-full mb-8 relative"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                        AI Technical Interviewer
                                    </span>
                                    <button 
                                        onClick={() => speakQuestion(currentQ?.question)}
                                        className="text-slate-400 hover:text-primary transition-colors p-1"
                                        title="Repeat Question"
                                    >
                                        <Volume2 size={16} />
                                    </button>
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono">
                                    Target: {currentQ?.category}
                                </span>
                            </div>

                            <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                                "{currentQ?.question}"
                            </h2>

                            {currentQ?.isChallenge && (
                                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-xs text-amber-300">
                                    <AlertTriangle size={16} className="shrink-0" />
                                    <span>The AI is challenging an assumption or claim from your previous answer. Defend your trade-off!</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Recent Evaluation Feedback Banner */}
                        {lastFeedback && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-2xl w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between mb-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                        {lastFeedback.score}%
                                    </div>
                                    <p className="text-xs text-slate-300 truncate max-w-md">
                                        <strong className="text-white">Previous Score:</strong> {lastFeedback.whatWell}
                                    </p>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Evaluated</span>
                            </motion.div>
                        )}

                        {/* Camera Preview (Floating Picture-in-Picture) */}
                        <motion.div 
                            drag
                            dragConstraints={{ left: -400, right: 400, top: -300, bottom: 300 }}
                            className="w-48 aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 cursor-move absolute bottom-8 right-8 z-40"
                        >
                            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/60 rounded-lg backdrop-blur-md">
                                <div className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
                                <span className="text-[8px] font-bold text-white uppercase tracking-widest">{isRecording ? 'REC' : 'IDLE'}</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Controls Footer */}
                    <div className="h-24 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-center gap-6 px-6 z-50 shrink-0">
                        <motion.button 
                            disabled={isProcessing}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => isRecording ? stopRecording() : startRecording()}
                            className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-xs tracking-widest transition-all ${
                                isRecording 
                                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25' 
                                : 'bg-primary hover:bg-emerald-600 text-white shadow-lg shadow-primary/25'
                            }`}
                        >
                            {isRecording ? <Square size={16} /> : <Mic size={16} />}
                            {isRecording ? 'STOP & PROCESS ANSWER' : 'START RECORDING ANSWER'}
                        </motion.button>

                        <motion.button 
                            disabled={isProcessing || isRecording}
                            whileHover={{ scale: 1.05 }}
                            onClick={handleNext}
                            className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-xs tracking-widest transition-all border ${
                                !isRecording && !isProcessing 
                                    ? 'border-primary text-primary hover:bg-primary/10' 
                                    : 'border-slate-800 text-slate-600 pointer-events-none'
                            }`}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    EVALUATING & ADAPTING...
                                </>
                            ) : (
                                <>
                                    SUBMIT & NEXT ADAPTIVE QUESTION
                                    <Send size={16} />
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Right Panel: Live Transcription Sidebar */}
                <div className="lg:col-span-4 bg-slate-900/70 border-l border-slate-800 flex flex-col h-full shadow-2xl min-h-0">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="font-bold flex items-center gap-2 text-sm text-white">
                            <Sparkles size={16} className="text-primary" />
                            Live Speech Transcription
                        </h2>
                        {isRecording && (
                            <div className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-black rounded uppercase tracking-widest animate-pulse">
                                Listening
                            </div>
                        )}
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                        {fullTranscription.map((chat, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: chat.role === 'ai' ? -10 : 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={i} 
                                className={`flex flex-col ${chat.role === 'ai' ? 'items-start' : 'items-end'}`}
                            >
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                    {chat.role === 'ai' ? 'Interviewer' : 'You'}
                                </span>
                                <div className={`p-4 rounded-2xl text-[13px] leading-relaxed max-w-[90%] ${
                                    chat.role === 'ai' 
                                        ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/60' 
                                        : 'bg-primary/20 text-primary-200 rounded-tr-none border border-primary/30'
                                }`}>
                                    {chat.text}
                                </div>
                            </motion.div>
                        ))}
                        
                        {isRecording && transcription && (
                            <div className="flex flex-col items-end animate-pulse">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Transcribing...</span>
                                <div className="p-4 rounded-2xl bg-primary/10 text-primary text-[13px] leading-relaxed max-w-[90%] rounded-tr-none border border-primary/20 italic">
                                    {transcription}...
                                </div>
                            </div>
                        )}

                        {fullTranscription.length === 0 && !isRecording && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60">
                                <Mic size={40} className="mb-3" />
                                <p className="text-xs font-medium text-center text-slate-400">
                                    Press "Start Recording Answer"<br/>to transcribe your speech in real-time.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-slate-950 border-t border-slate-800">
                        <p className="text-[10px] text-center text-slate-500 font-medium">
                            Powered by Web Speech API & Gemini Adaptive Reasoning
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Interview;

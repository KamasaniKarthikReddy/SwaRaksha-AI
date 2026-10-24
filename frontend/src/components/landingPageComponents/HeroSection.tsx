import { useNavigate } from "react-router-dom";
import BlurFade from "../magicui/blur-fade.tsx";
import { ShieldCheck, Stethoscope, Sparkles, Activity } from "lucide-react";

export function HeroSection() {
    const navigate = useNavigate();

    const handleStartSurvey = () => {
        navigate('/survey');
    };

    const handleConsultation = () => {
        navigate('/consultation');
    };

    return (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute top-48 right-10 w-[300px] h-[300px] bg-teal-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="flex flex-col items-center text-center">
                {/* Cent-style Pill Badge */}
                <BlurFade delay={0.2} duration={0.6}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 shadow-xs mb-6">
                        <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                        <span className="text-xs sm:text-sm font-semibold text-purple-900 tracking-wide">
                            India's Advanced AI Health & Diagnostic Screening
                        </span>
                        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span className="hidden sm:inline-block text-xs font-medium text-purple-700">Early Detection Protocol</span>
                    </div>
                </BlurFade>

                {/* Main Headline */}
                <BlurFade delay={0.3} duration={0.8}>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#111827] tracking-tight leading-[1.12] max-w-4xl">
                        A Paradigm Shift in{' '}
                        <span className="bg-gradient-to-r from-purple-700 via-indigo-700 to-teal-700 bg-clip-text text-transparent">
                            Preventive Healthcare
                        </span>
                    </h1>
                </BlurFade>

                {/* Subtitle */}
                <BlurFade delay={0.5} duration={0.7}>
                    <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl leading-relaxed font-normal">
                        SwaRaksha AI unifies 24/7 symptom triage, machine learning disease risk prediction, OCR medical report analysis, and direct doctor consultations in one seamless platform.
                    </p>
                </BlurFade>

                {/* CTA Buttons */}
                <BlurFade delay={0.7} duration={0.6}>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                        <button
                            onClick={handleStartSurvey}
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#111827] hover:bg-[#1F2937] text-white font-semibold text-base shadow-lg shadow-gray-900/10 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Start Free AI Screening
                        </button>
                        <button
                            onClick={handleConsultation}
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-gray-50 text-[#111827] border border-gray-300 font-semibold text-base shadow-sm transition-all duration-200 hover:border-gray-400"
                        >
                            Online Doctor Consultation
                        </button>
                    </div>
                </BlurFade>

                {/* Trust Features Bar */}
                <BlurFade delay={0.9} duration={0.6}>
                    <div className="mt-14 pt-8 border-t border-gray-200/70 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">200+ Conditions</div>
                                <div className="text-xs text-gray-500">Early symptom analysis</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">Verified Doctors</div>
                                <div className="text-xs text-gray-500">Video consultation ready</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">100% Confidential</div>
                                <div className="text-xs text-gray-500">Secure patient records</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">6 ML Clinical Models</div>
                                <div className="text-xs text-gray-500">Ensemble predictions</div>
                            </div>
                        </div>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
}
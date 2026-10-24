import { Activity, Stethoscope, Brain, ArrowRight, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

const OurSolution = () => {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase tracking-wider mb-4">
                    <HeartPulse className="w-3.5 h-3.5" />
                    Proprietary Preventive Protocol
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight">
                    Next-Generation Clinical Diagnostics
                </h2>
                <p className="mt-4 text-base sm:text-lg text-gray-600 font-normal">
                    Designed to identify potential health risks early, automate clinical workflows, and connect patients with the right medical specialists instantly.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                    <div>
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-6">
                            <Activity className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Smart Health Triage
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Dynamic multi-turn symptom collection powered by AI. Real-time condition evaluation narrowing down potential illnesses through guided questionnaires.
                        </p>
                    </div>
                    <Link
                        to="/survey"
                        className="inline-flex items-center text-sm font-semibold text-purple-700 hover:text-purple-800 gap-1.5 group"
                    >
                        <span>Start symptom check</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Feature 2 */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                    <div>
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-6">
                            <Brain className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            6-Model ML Prediction
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Ensemble machine learning models analyze 130+ clinical features to calculate precise condition probabilities and direct patients to the right specialist.
                        </p>
                    </div>
                    <Link
                        to="/survey"
                        className="inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-800 gap-1.5 group"
                    >
                        <span>View predictive engine</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                    <div>
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                            <Stethoscope className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                            Direct Doctor Consultations
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            Instant appointment booking with verified medical doctors, real-time consultation queues, and high-definition encrypted 1-on-1 video rooms.
                        </p>
                    </div>
                    <Link
                        to="/consultation"
                        className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 gap-1.5 group"
                    >
                        <span>Book consultation</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default OurSolution;

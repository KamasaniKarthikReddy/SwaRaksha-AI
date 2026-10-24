import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles,
    CheckCircle2,
    ShieldCheck,
    ChevronDown,
    Heart,
    TrendingUp,
    Search,
    AlertCircle,
    Check,
    Lock
} from 'lucide-react';


interface CentScreeningHeroProps {
    onBookingSuccess?: (details: { name: string; phone: string; city: string }) => void;
}

export const CentScreeningHero: React.FC<CentScreeningHeroProps> = () => {
    const navigate = useNavigate();

    // Form inputs state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('Mumbai');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [callbackSent, setCallbackSent] = useState(false);
    const [formError, setFormError] = useState('');

    // Countdown Timer (exact 8d 2h 17m like screenshot)
    const [timeLeft, setTimeLeft] = useState({
        days: 8,
        hours: 2,
        minutes: 17,
        seconds: 45
    });

    // Condition filter state
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchCondition, setSearchCondition] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else if (prev.days > 0) {
                    return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) {
            setFormError('Please enter your name and contact phone number');
            return;
        }
        setFormError('');
        setFormSubmitted(true);
        // Save lead locally
        localStorage.setItem('swaraksha_lead', JSON.stringify({ name, phone, city, date: new Date().toISOString() }));
    };

    const handleCallbackRequest = () => {
        if (!phone.trim()) {
            setFormError('Please enter your phone number to receive a call back');
            return;
        }
        setFormError('');
        setCallbackSent(true);
        setTimeout(() => setCallbackSent(false), 5000);
    };

    const conditionsList = [
        { name: 'Hydatid cyst', category: 'Abdominal' },
        { name: 'Lymphangioma', category: 'Oncology' },
        { name: 'Liver metastases', category: 'Oncology' },
        { name: 'Liver Tumors', category: 'Oncology' },
        { name: 'Adrenal lymphoma', category: 'Oncology' },
        { name: 'Knee meniscus tear', category: 'Musculoskeletal' },
        { name: 'Pericardial effusion', category: 'Cardiology' },
        { name: 'Pericardial fat', category: 'Cardiology' },
        { name: 'Cardiomegaly', category: 'Cardiology' },
        { name: 'Aortic aneurysm', category: 'Cardiology' },
        { name: 'Cardiac metastases', category: 'Cardiology' },
        { name: 'Myxoma', category: 'Cardiology' },
        { name: 'Brain Tumors', category: 'Neurology' },
        { name: 'Meningioma', category: 'Neurology' },
        { name: 'Glioma', category: 'Neurology' },
        { name: 'Perivascular dilation', category: 'Neurology' },
        { name: 'Arachnoid cyst', category: 'Neurology' },
        { name: 'Intracranial Cysts', category: 'Neurology' },
        { name: 'Mastoiditis', category: 'Neurology' },
        { name: 'Coronary Plaque Calcification', category: 'Cardiology' },
        { name: 'Non-alcoholic Fatty Liver (NAFLD)', category: 'Abdominal' },
        { name: 'Renal Cell Cysts & Calculi', category: 'Abdominal' },
        { name: 'Thyroid Nodules (TI-RADS)', category: 'Endocrine' },
        { name: 'Osteopenia & Osteoporosis', category: 'Musculoskeletal' },
        { name: 'Pulmonary Emphysema & Nodules', category: 'Pulmonary' },
        { name: 'Visceral Adiposity Syndrome', category: 'Abdominal' },
        { name: 'Cerebral Microbleeds', category: 'Neurology' },
        { name: 'Carotid Intima-Media Thickening', category: 'Cardiology' }
    ];

    const filteredConditions = conditionsList.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchCondition.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Top decorative ambient gradient */}
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-72 right-10 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                {/* LEFT COLUMN: Hero content, Diagnostic Stack, Conditions, How it Works, App */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-12">

                    {/* 1. Main Hero Headline & Subtitle */}
                    <div id="included" className="space-y-4 pt-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-900">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            Next-Generation AI Preventive Protocol
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] leading-[1.12]">
                            India's Most Advanced <br />
                            <span className="text-[#111827]">Full-Body Scan</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl font-normal">
                            Our proprietary CCNM™ protocol combines full-body MRI, CT, Genetics and 100+ biomarkers into a comprehensive health checkup for early detection.
                        </p>
                    </div>

                    {/* 2. Diagnostic Visual Cards Stack (Screenshots 1 & 2) */}
                    <div id="science" className="space-y-8">

                        {/* Visual Card 1: Full-Body MRI */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white group">
                            <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-gray-900">
                                <img
                                    src="/images/mri-scan.jpg"
                                    alt="Siemens Full Body MRI Scanner"
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-600/90 backdrop-blur-md mb-2">
                                        Whole-Body MRI (Brain, Spine & Abdomen)
                                    </span>
                                    <h3 className="text-2xl font-bold">Radiation-Free High-Field MRI</h3>
                                    <p className="text-sm text-gray-200 mt-1 max-w-lg">
                                        Multi-sequence 3D scans detect early tumors, silent brain aneurysms, hepatic lesions, and spinal nerve compressions with zero radiation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Card 2: Calcium Score + Lung CT (Glowing 3D Heart) */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800 bg-[#0A0D14] group">
                            <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                                <img
                                    src="/images/heart-scan.jpg"
                                    alt="3D Holographic Cardiac Angiography"
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14]/90 via-transparent to-transparent" />
                                
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/80 backdrop-blur-md">
                                            <Heart className="w-3.5 h-3.5 fill-white" /> Cardiac & Lung Screening
                                        </span>
                                        <span className="text-xs text-purple-300 font-mono">Agatston CAC Index</span>
                                    </div>
                                    <h3 className="text-2xl font-bold">Calcium Score + Low-Dose Chest CT</h3>
                                    <p className="text-sm text-gray-300 mt-1 max-w-lg">
                                        Identifies subclinical coronary artery calcification to quantify heart attack risks up to 10 years before any symptom appears.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Card 3: DEXA Scan (Exact match to Screenshot 2) */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white group">
                            <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-gray-900">
                                <img
                                    src="/images/dexa-scan.jpg"
                                    alt="DEXA Body Composition and Bone Scanner"
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    {/* Pill Badge matching Screenshot 2 */}
                                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white mb-2">
                                        Body Composition & Bone Health
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold mb-3">DEXA Scan</h3>
                                    
                                    {/* Checklist matching Screenshot 2 */}
                                    <div className="space-y-1.5 text-sm sm:text-base font-medium text-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white shrink-0">
                                                <Check className="w-3 h-3 stroke-[3]" />
                                            </div>
                                            <span>Measures bone density and fracture risk</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white shrink-0">
                                                <Check className="w-3 h-3 stroke-[3]" />
                                            </div>
                                            <span>Assesses fat mass, lean mass, and visceral fat linked to metabolic risk</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Card 4: 100+ Biomarkers & Genetic Mapping */}
                        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-100 shadow-xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                                        Biochemical & Genetics
                                    </span>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-2">100+ Biomarkers & Whole DNA Panel</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Advanced cardiovascular, metabolic, liver, kidney, hormonal, and micronutrient profiles analyzed by AI.
                                    </p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <span className="text-3xl font-extrabold text-purple-900">100+</span>
                                    <span className="block text-xs font-medium text-gray-500">Clinical Markers</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-xs">
                                    <div className="text-gray-500 font-medium">ApoB & Lp(a)</div>
                                    <div className="text-sm font-bold text-purple-900">Deep Lipid Profile</div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-xs">
                                    <div className="text-gray-500 font-medium">HOMA-IR</div>
                                    <div className="text-sm font-bold text-purple-900">Insulin Sensitivity</div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-xs">
                                    <div className="text-gray-500 font-medium">hs-CRP</div>
                                    <div className="text-sm font-bold text-purple-900">Vascular Inflammation</div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-xs">
                                    <div className="text-gray-500 font-medium">Whole Exome</div>
                                    <div className="text-sm font-bold text-purple-900">Genomic Cancer Risk</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* 3. "300+ Conditions. One Scan." Tag Cloud (Screenshot 3) */}
                    <div id="conditions" className="space-y-6 pt-6">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                                300+ Conditions. One Scan.
                            </h2>
                            <p className="mt-2 text-base text-gray-600 max-w-xl">
                                From early silent cancers to vascular aneurysms and metabolic diseases, detect critical health risks long before symptoms manifest.
                            </p>
                        </div>

                        {/* Category Filter Pills & Search */}
                        <div className="flex flex-wrap items-center gap-2">
                            {['All', 'Oncology', 'Cardiology', 'Neurology', 'Abdominal'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-black text-white shadow-sm'
                                            : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                            <div className="relative ml-auto w-full sm:w-48 mt-2 sm:mt-0">
                                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search condition..."
                                    value={searchCondition}
                                    onChange={(e) => setSearchCondition(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full focus:outline-none focus:border-purple-600"
                                />
                            </div>
                        </div>

                        {/* Interactive Pill Cloud */}
                        <div className="flex flex-wrap gap-2.5 pt-2">
                            {filteredConditions.map((item, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-white text-gray-800 border border-gray-200 shadow-2xs hover:border-purple-400 hover:text-purple-900 hover:shadow-xs transition-all cursor-default"
                                >
                                    {item.name}
                                </span>
                            ))}
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                + 270 More Conditions Screened
                            </span>
                        </div>
                    </div>

                    {/* 4. "How it works" Dark Section with Glowing Purple Timeline (Screenshots 3 & 4) */}
                    <div id="how-it-works" className="rounded-3xl bg-[#0D0F18] text-white p-6 sm:p-10 border border-gray-800 shadow-2xl relative overflow-hidden">
                        {/* Background subtle radial glow */}
                        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                        <h2 className="text-3xl font-extrabold tracking-tight mb-8">
                            How it works
                        </h2>

                        {/* Vertical Timeline */}
                        <div className="relative pl-8 sm:pl-10 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-purple-600 before:to-purple-900">

                            {/* DAY 1 */}
                            <div className="relative group">
                                <div className="absolute -left-[27px] sm:-left-[31px] top-1.5 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-purple-950 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                                <div className="bg-white/5 hover:bg-white/8 transition-colors p-5 sm:p-6 rounded-2xl border border-white/10">
                                    <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">
                                        DAY 1
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Get your first cent check</h4>
                                    <ol className="text-sm text-gray-300 space-y-1.5 font-normal list-decimal list-inside">
                                        <li>Register for the scan</li>
                                        <li>Get your blood sample collected from home</li>
                                        <li>Visit center for the remaining tests</li>
                                    </ol>
                                </div>
                            </div>

                            {/* WEEK 1 */}
                            <div className="relative group">
                                <div className="absolute -left-[27px] sm:-left-[31px] top-1.5 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-purple-950 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                                <div className="bg-white/5 hover:bg-white/8 transition-colors p-5 sm:p-6 rounded-2xl border border-white/10">
                                    <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">
                                        WEEK 1
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-1.5">Get your report</h4>
                                    <p className="text-sm text-gray-300">
                                        Get your comprehensive, doctor-explained 360 report on the Cent App.
                                    </p>
                                </div>
                            </div>

                            {/* AFTER 6 MONTHS */}
                            <div className="relative group">
                                <div className="absolute -left-[27px] sm:-left-[31px] top-1.5 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-purple-950 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                                <div className="bg-white/5 hover:bg-white/8 transition-colors p-5 sm:p-6 rounded-2xl border border-white/10">
                                    <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">
                                        AFTER 6 MONTHS
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-1.5">Measure your progress</h4>
                                    <p className="text-sm text-gray-300">
                                        Repeat biomarkers, DEXA, ECG* & Echo* and compare changes over time.
                                    </p>
                                </div>
                            </div>

                            {/* ALL YEAR */}
                            <div className="relative group">
                                <div className="absolute -left-[27px] sm:-left-[31px] top-1.5 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-purple-950 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                                <div className="bg-white/5 hover:bg-white/8 transition-colors p-5 sm:p-6 rounded-2xl border border-white/10">
                                    <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">
                                        ALL YEAR
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-1.5">Consult specialist doctors</h4>
                                    <p className="text-sm text-gray-300">
                                        Get up to 4 free doctor consultations on the Cent App.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 5. Mobile App Feature Showcase (Screenshot 5) */}
                    <div id="app" className="space-y-6 pt-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                                Mobile Experience
                            </span>
                            <h2 className="text-3xl font-extrabold text-[#111827] mt-3">
                                Your health, distilled to one score
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Experience continuous clinical oversight, biometric trending, and direct specialist consultations directly from your smartphone.
                            </p>
                        </div>

                        {/* Phone Mockup Cards Grid (Matching the 5 cards from Screenshot 5) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* Card 1: Score 75 / 100 */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl flex flex-col justify-between">
                                <div className="mb-4">
                                    <h4 className="text-base font-bold text-gray-900">Your health, distilled to one score</h4>
                                </div>

                                {/* Phone interface mockup */}
                                <div className="bg-gradient-to-b from-[#181126] to-[#0A0713] rounded-2xl p-5 text-white shadow-inner border border-purple-900/40">
                                    <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
                                        <span className="font-bold text-white">Cent</span>
                                        <span className="font-mono">9:41 AM</span>
                                    </div>

                                    {/* Circular score */}
                                    <div className="flex flex-col items-center justify-center py-4">
                                        <div className="relative w-28 h-28 rounded-full border-4 border-purple-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                                            <div className="text-center">
                                                <div className="text-3xl font-black tracking-tight text-white">75</div>
                                                <div className="text-[10px] text-purple-300">Out of 100</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-2">Overall Health Score</div>
                                    </div>

                                    {/* Organ pill tags */}
                                    <div className="grid grid-cols-3 gap-1.5 mt-2 text-[11px]">
                                        <div className="bg-white/10 rounded-lg py-1 px-2 text-center">🧠 Brain 24</div>
                                        <div className="bg-white/10 rounded-lg py-1 px-2 text-center text-emerald-300">🫀 Heart 64</div>
                                        <div className="bg-white/10 rounded-lg py-1 px-2 text-center text-emerald-300">🫁 Lungs 90</div>
                                        <div className="bg-white/10 rounded-lg py-1 px-2 text-center">Kidney 54</div>
                                        <div className="bg-white/10 rounded-lg py-1 px-2 text-center text-emerald-300">Liver 90</div>
                                        <div className="bg-white/10 rounded-lg py-1 px-2 text-center text-emerald-300">Metabolic 88</div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Track your progress */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl flex flex-col justify-between">
                                <div className="mb-4">
                                    <h4 className="text-base font-bold text-gray-900">Track your progress. Over time.</h4>
                                </div>

                                <div className="bg-[#120F1D] rounded-2xl p-5 text-white shadow-inner border border-purple-900/30">
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                        <span className="font-bold text-white">Progress</span>
                                        <span className="text-[10px] text-purple-400">Score vs Time</span>
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-3 mb-3 border border-white/5 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-gray-300 font-medium">Heart Health</div>
                                            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                                                <TrendingUp className="w-3.5 h-3.5" /> +5 since 14 Jan
                                            </div>
                                        </div>
                                        <div className="w-16 h-8 flex items-center">
                                            {/* Mini SVG Sparkline */}
                                            <svg className="w-full h-full text-emerald-400" viewBox="0 0 60 25" fill="none">
                                                <path d="M2 20 L15 18 L30 12 L45 15 L58 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                        <div className="bg-white/10 rounded-lg p-2.5 flex items-center justify-between">
                                            <span className="text-gray-300">Next: Followup Blood Test</span>
                                            <span className="text-[10px] bg-purple-600 px-2 py-0.5 rounded-full font-bold">15 Jul</span>
                                        </div>
                                        <div className="bg-white/10 rounded-lg p-2.5 flex items-center justify-between">
                                            <span className="text-gray-300">DEXA Scan Progress</span>
                                            <span className="text-emerald-400 font-bold">72 ▲ 4 pts</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: A plan built around you */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl flex flex-col justify-between">
                                <div className="mb-4">
                                    <h4 className="text-base font-bold text-gray-900">A plan built around you</h4>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-gray-800">
                                    <div className="flex gap-2 mb-3">
                                        <span className="bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full">Daily</span>
                                        <span className="bg-white text-gray-600 text-[11px] font-bold px-3 py-1 rounded-full border border-gray-200">Weekly</span>
                                    </div>

                                    <div className="bg-white rounded-xl p-3 border border-gray-200/80 mb-2.5 shadow-2xs">
                                        <div className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">DIET</div>
                                        <div className="text-xs font-bold text-gray-900 mt-0.5">Eat real, whole foods</div>
                                        <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                                            Focus on whole grains, legumes, vegetables and limit added sugars.
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-xl p-3 border border-gray-200/80 shadow-2xs">
                                        <div className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">SUPPLEMENTS</div>
                                        <div className="text-xs font-bold text-gray-900 mt-0.5">Vitamin D3 & K2 daily</div>
                                        <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                                            Support bone mineral density, immunity, and arterial elasticity.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: 360° health blueprint */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl flex flex-col justify-between">
                                <div className="mb-4">
                                    <h4 className="text-base font-bold text-gray-900">Your 360° health blueprint</h4>
                                </div>

                                <div className="bg-[#100D1C] text-white rounded-2xl p-4 border border-purple-900/30">
                                    <div className="text-xs font-bold text-white mb-1">Reports — Findings by Severity</div>
                                    <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                                        <span>Total findings reviewed: <strong className="text-white">150</strong></span>
                                        <span className="text-emerald-400 font-bold">94% in range</span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-3">
                                        <div className="h-full bg-emerald-400 rounded-full w-[94%]" />
                                    </div>

                                    <div className="space-y-1.5 text-[11px]">
                                        <div className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                                            <span className="flex items-center gap-1.5 text-red-300">
                                                <span className="w-2 h-2 rounded-full bg-red-500" /> 2 Major findings
                                            </span>
                                            <span className="text-gray-400 text-[10px]">Specialist action</span>
                                        </div>
                                        <div className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                                            <span className="flex items-center gap-1.5 text-amber-300">
                                                <span className="w-2 h-2 rounded-full bg-amber-400" /> 6 Minor findings
                                            </span>
                                            <span className="text-gray-400 text-[10px]">Lifestyle track</span>
                                        </div>
                                        <div className="flex items-center justify-between bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                                            <span className="flex items-center gap-1.5 text-emerald-300">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400" /> 141 In healthy range
                                            </span>
                                            <span className="text-emerald-400 text-[10px] font-bold">Optimal</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Card 5: Full Width Doctor Video Consultation (Screenshot 5 bottom right) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xl">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">Doctor consultations through the year</h4>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        Connect with our chief radiologists, cardiologists, and physicians to decode every biomarker and imaging finding.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/consultation')}
                                    className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold hover:bg-purple-100 transition"
                                >
                                    Book Video Call
                                </button>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden bg-gray-900 h-52 sm:h-64 border border-gray-800 flex items-center justify-center">
                                <img
                                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1200&auto=format&fit=crop"
                                    alt="Live Doctor Teleconsultation"
                                    className="w-full h-full object-cover object-top opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Dr. Arvind Sethi, MD Radiologist</span>
                                    <span className="font-mono text-gray-300">00:08:24</span>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                                    <span className="bg-purple-600/90 backdrop-blur-md px-3 py-1 rounded-full font-medium">
                                        Interactive Scan Review
                                    </span>
                                    <span className="text-gray-300">Up to 4 free consultations included</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {/* RIGHT COLUMN: Sticky "Enter your details" Booking Card (Screenshots 1, 2, 3, 4, 5) */}
                <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 z-20">
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-200/80 shadow-2xl relative overflow-hidden backdrop-blur-xs">

                        {/* Top decorative badge */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-extrabold text-[#111827] tracking-tight">
                                Enter your details
                            </h3>
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                <Lock className="w-3 h-3" /> Secure
                            </span>
                        </div>

                        {/* Error Notification */}
                        {formError && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{formError}</span>
                            </div>
                        )}

                        {/* Callback Confirmation Toast */}
                        {callbackSent && (
                            <div className="mb-4 p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-2 animate-fade-in">
                                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>Request received! A clinical counselor will call you within 15 minutes.</span>
                            </div>
                        )}

                        {/* Form Submission Confirmation */}
                        {formSubmitted ? (
                            <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200 text-center space-y-3">
                                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                                    <Check className="w-6 h-6 stroke-[3]" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">Priority Booking Confirmed!</h4>
                                <p className="text-xs text-gray-600">
                                    Thank you, <span className="font-semibold">{name}</span>! Your ₹1,500 promotional discount code <code className="bg-white px-1.5 py-0.5 rounded font-mono text-purple-700 font-bold">CENT1500</code> has been applied.
                                </p>
                                <div className="pt-2">
                                    <button
                                        onClick={() => navigate('/survey')}
                                        className="w-full bg-black text-white font-bold py-3 rounded-xl text-xs hover:bg-gray-800 transition"
                                    >
                                        Proceed to Health Intake Survey →
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleBooking} className="space-y-4">
                                {/* Name Input */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                                        required
                                    />
                                </div>

                                {/* Phone Number Input */}
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
                                        required
                                    />
                                </div>

                                {/* City Select Dropdown (Screenshot 1) */}
                                <div className="relative">
                                    <select
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm appearance-none focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all cursor-pointer"
                                    >
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Bengaluru">Bengaluru</option>
                                        <option value="Delhi NCR">Delhi NCR</option>
                                        <option value="Hyderabad">Hyderabad</option>
                                        <option value="Chennai">Chennai</option>
                                        <option value="Pune">Pune</option>
                                        <option value="Kolkata">Kolkata</option>
                                        <option value="Ahmedabad">Ahmedabad</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>

                                {/* Green Discount Banner (Screenshot 1, 2, 3, 4, 5) */}
                                <div className="rounded-2xl bg-[#F4F8E5] border border-[#B1C266]/70 p-3.5 text-center transition-transform hover:scale-[1.01]">
                                    <div className="text-sm font-extrabold text-[#1F5938] tracking-tight">
                                        Get Flat ₹1,500 OFF on booking
                                    </div>
                                    <div className="text-xs text-gray-600 mt-0.5 font-medium">
                                        Offer ends in{' '}
                                        <span className="font-bold text-gray-900 font-mono">
                                            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                                        </span>
                                    </div>
                                </div>

                                {/* Primary CTA: Solid Black Button "Book Now" */}
                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl bg-black hover:bg-gray-900 text-white font-bold text-base shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Book Now
                                </button>

                                {/* Secondary CTA: Purple Outline Button "Request a call back" */}
                                <button
                                    type="button"
                                    onClick={handleCallbackRequest}
                                    className="w-full py-3.5 rounded-xl bg-white hover:bg-purple-50 text-purple-800 border-2 border-purple-300 font-bold text-base transition-all duration-200"
                                >
                                    Request a call back
                                </button>
                            </form>
                        )}

                        {/* Trust & Accreditations Micro Footer */}
                        <div className="mt-6 pt-5 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Zero-cost rescheduling & free home blood collection</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                <span>NABL & NABH certified premier imaging centers</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default CentScreeningHero;

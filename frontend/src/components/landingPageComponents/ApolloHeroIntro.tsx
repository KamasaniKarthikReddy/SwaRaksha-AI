import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Sparkles,
    ArrowRight,
    FileText,
    Phone,
    MessageCircle,
    FileUp
} from 'lucide-react';

const SLIDES = [
    {
        badge: 'World Health Day 2026',
        headingPart1: 'Listen to your body',
        headingPart2: 'before it gets louder.',
        subheading: "Early detection matters. And it's always smarter when you plan it together.",
        ctaText: 'Get Clarity with Xpert Health Comprehensive today',
        ctaTarget: '/survey',
        image: '/images/apollo_hero_banner.jpg',
        rightHeading: 'Together for',
        rightHighlight: 'HEALTH,',
        rightSub: 'Stand with',
        rightSubHighlight: 'SCIENCE',
        gradient: 'from-[#d9f5f3] via-[#bfebe7] to-[#d6f5f3]'
    },
    {
        badge: 'Advanced Preventive Diagnostics',
        headingPart1: 'Precision DNA &',
        headingPart2: 'Cardiac Risk Screening.',
        subheading: 'Detect hidden cardiovascular, metabolic, and genetic risks before symptoms appear.',
        ctaText: 'Book Cardiac & Vital Health Profile',
        ctaTarget: '/survey',
        image: '/images/apollo_slide_cardiac.jpg',
        rightHeading: 'Powered by',
        rightHighlight: 'SCIENCE,',
        rightSub: 'Guided by',
        rightSubHighlight: 'DATA',
        gradient: 'from-[#daf0fa] via-[#cae9f8] to-[#b3ddf5]'
    },
    {
        badge: 'NABL Certified Laboratories',
        headingPart1: 'Accurate Pathology,',
        headingPart2: 'Right At Your Doorstep.',
        subheading: 'Certified phlebotomists, cold-chain sample transit, and AI-validated same-day results.',
        ctaText: 'Schedule Free Home Sample Pickup',
        ctaTarget: '/consultation',
        image: '/images/apollo_slide_doctor.jpg',
        rightHeading: 'Trusted by',
        rightHighlight: 'MILLIONS,',
        rightSub: 'Delivered with',
        rightSubHighlight: 'CARE',
        gradient: 'from-[#e3f2fd] via-[#d5eefc] to-[#c5e6fa]'
    }
];

const ApolloHeroIntro: React.FC = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const slide = SLIDES[currentSlide];

    return (
        <section className="w-full bg-[#FDFCFE] pt-4 pb-6 selection:bg-[#00877a]/15 selection:text-[#005e55]">
            
            {/* ========================================================
                1. HERO CAROUSEL BANNER (Exact Match to Apollo Reference)
               ======================================================== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`relative rounded-3xl overflow-hidden shadow-md border border-teal-100/80 bg-gradient-to-r ${slide.gradient} transition-all duration-700`}>
                    
                    {/* Previous Button */}
                    <button
                        type="button"
                        onClick={() => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
                        className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all z-20 backdrop-blur-xs cursor-pointer hover:scale-105"
                        aria-label="Previous Slide"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Next Button */}
                    <button
                        type="button"
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
                        className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all z-20 backdrop-blur-xs cursor-pointer hover:scale-105"
                        aria-label="Next Slide"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Slide Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[360px] sm:min-h-[420px] px-6 sm:px-12 lg:px-16 py-8 relative">
                        
                        {/* Left Column: Badge, Headline, Subheadline, Maroon CTA */}
                        <div className="lg:col-span-5 z-10 flex flex-col justify-center text-left">
                            <p className="text-xs sm:text-sm font-bold text-[#00695C] tracking-wide mb-2 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-[#00897B]" />
                                <span>{slide.badge}</span>
                            </p>

                            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#003833] tracking-tight leading-[1.12] mb-3">
                                <span>{slide.headingPart1}</span>
                                <br />
                                <span className="text-[#9B2346]">{slide.headingPart2}</span>
                            </h1>

                            <p className="text-xs sm:text-sm font-semibold text-[#004D40]/85 leading-relaxed max-w-md mb-6">
                                {slide.subheading}
                            </p>

                            <div>
                                <button
                                    onClick={() => navigate(slide.ctaTarget)}
                                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 bg-[#9B2346] hover:bg-[#801735] text-white text-xs sm:text-sm font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                                >
                                    <span>{slide.ctaText}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Center Image Container */}
                        <div className="lg:col-span-4 flex items-center justify-center my-6 lg:my-0 relative">
                            <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                                <img
                                    key={slide.image}
                                    src={slide.image}
                                    alt="Medical Diagnostic Screening"
                                    className="w-full h-full object-cover object-center filter drop-shadow-md rounded-2xl animate-in fade-in zoom-in-95 duration-500 hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-radial from-transparent via-transparent to-teal-900/10 pointer-events-none" />
                            </div>
                        </div>

                        {/* Right Slogan Column */}
                        <div className="lg:col-span-3 flex flex-col justify-center text-left lg:text-right z-10 pl-2 lg:pl-6">
                            <span className="text-sm sm:text-base lg:text-lg font-bold text-[#004D40] tracking-tight leading-tight">
                                {slide.rightHeading}
                            </span>
                            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#00695C] tracking-tight leading-none mb-1">
                                {slide.rightHighlight}
                            </span>
                            <span className="text-sm sm:text-base lg:text-lg font-bold text-[#004D40] tracking-tight leading-tight">
                                {slide.rightSub}
                            </span>
                            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#00796B] tracking-tight leading-none">
                                {slide.rightSubHighlight}
                            </span>
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                        {SLIDES.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    currentSlide === idx ? 'w-6 bg-[#9B2346]' : 'w-2 bg-gray-400/60 hover:bg-gray-600'
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ========================================================
                2. "Need help?" QUICK ACTION CARDS (Exact Match to Reference)
               ======================================================== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-gray-100">
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">
                        Need help?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        
                        {/* Card 1: Have a Prescription? */}
                        <div
                            onClick={() => navigate('/consultation/upload_reports')}
                            className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-200/90 hover:border-[#9B2346]/40 hover:shadow-md transition-all duration-200 bg-white group cursor-pointer"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-xl bg-[#e0f2f1] text-[#00796B] flex items-center justify-center flex-shrink-0 group-hover:bg-[#b2dfdb] transition">
                                    <FileUp className="w-6 h-6 stroke-[2]" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#9B2346] transition">
                                        Have a Prescription?
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Upload and book your tests
                                    </p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#fce4ec] text-gray-400 group-hover:text-[#9B2346] flex items-center justify-center transition flex-shrink-0">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Card 2: Call us to book your tests */}
                        <a
                            href="tel:04069467075"
                            className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-200/90 hover:border-[#9B2346]/40 hover:shadow-md transition-all duration-200 bg-white group cursor-pointer"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-xl bg-[#fce4ec] text-[#ad1457] flex items-center justify-center flex-shrink-0 group-hover:bg-[#f8bbd0] transition">
                                    <Phone className="w-6 h-6 stroke-[2]" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#9B2346] transition">
                                        Call us to book your tests
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Our team of experts will guide you
                                    </p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#fce4ec] text-gray-400 group-hover:text-[#9B2346] flex items-center justify-center transition flex-shrink-0">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </a>

                        {/* Card 3: WhatsApp Booking */}
                        <a
                            href="https://wa.me/9104069467075?text=Hi%20SwaRaksha%20AI%2C%20I%20would%20like%20to%20book%20a%20test%20online."
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-200/90 hover:border-[#2e7d32]/40 hover:shadow-md transition-all duration-200 bg-white group cursor-pointer"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-xl bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center flex-shrink-0 group-hover:bg-[#c8e6c9] transition">
                                    <MessageCircle className="w-6 h-6 fill-current" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#2e7d32] transition">
                                        WhatsApp Booking
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Text us on WhatsApp to book a test
                                    </p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#e8f5e9] text-gray-400 group-hover:text-[#2e7d32] flex items-center justify-center transition flex-shrink-0">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </a>

                    </div>
                </div>
            </div>

            {/* ========================================================
                3. FLOATING ACTION BUTTONS (Bottom Right)
               ======================================================== */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
                <button
                    onClick={() => navigate('/consultation/upload_reports')}
                    className="w-12 h-12 rounded-full bg-white text-[#00796B] shadow-xl border border-teal-100 flex items-center justify-center hover:scale-110 transition duration-200 cursor-pointer"
                    title="Upload Prescription"
                >
                    <FileText className="w-6 h-6 text-[#00796B]" />
                </button>

                <a
                    href="tel:04069467075"
                    className="w-12 h-12 rounded-full bg-[#fce4ec] text-[#c2185b] shadow-xl border border-pink-200 flex items-center justify-center hover:scale-110 transition duration-200 cursor-pointer"
                    title="Call Diagnostic Helpline"
                >
                    <Phone className="w-5 h-5 text-[#c2185b] fill-current" />
                </a>
            </div>
        </section>
    );
};

export default ApolloHeroIntro;

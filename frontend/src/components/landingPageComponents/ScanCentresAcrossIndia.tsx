import React, { useState } from 'react';
import {
    MapPin,
    Phone,
    MessageCircle,
    X,
    ExternalLink,
    Clock,
    CheckCircle2,
    ChevronRight,
    Shield,
    ArrowRight
} from 'lucide-react';
import { indiaMapData } from '../../data/indiaMapData';

interface CityData {
    id: string;
    name: string;
    isLive: boolean;
    pin: { x: number; y: number };
    linePath: string;
    card: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    address: string;
    area: string;
    hours: string;
    phone: string;
    features: string[];
    waitlistCount?: number;
    expectedDate?: string;
    equipment: string[];
}

export const ScanCentresAcrossIndia: React.FC = () => {
    const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
    const [isLocationsModalOpen, setIsLocationsModalOpen] = useState(false);
    const [modalFilter, setModalFilter] = useState<'all' | 'live' | 'upcoming'>('all');
    const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
    const [waitlistSuccessCity, setWaitlistSuccessCity] = useState<string | null>(null);
    const [waitlistEmail, setWaitlistEmail] = useState('');

    // Calibrated city data matching exact screenshot geometry & layout
    const cities: CityData[] = [
        {
            id: 'delhi',
            name: 'Delhi',
            isLive: true,
            pin: { x: 195, y: 205 },
            // Line from pin goes straight UP to y=120, then RIGHT to x=350 to card
            linePath: 'M 195 195 V 120 H 350',
            card: { x: 350, y: 96, w: 140, h: 48 },
            area: 'Vasant Vihar & Defence Colony',
            address: '14 Basant Lok Community Centre, Vasant Vihar, New Delhi 110057',
            hours: 'Mon - Sun: 7:00 AM - 9:00 PM',
            phone: '+91 11 4987 6543',
            equipment: [
                '3.0T High-Field Siemens Magnetom Lumina MRI',
                'Dual-Source 128-Slice Low-Dose CT (Cardiac Agatston Calcium Score)',
                'Hologic Horizon DEXA Bone Density & Visceral Fat Scanner',
                'Preventive Multi-Omics Biomarkers Lab'
            ],
            features: [
                'Zero-wait ambient scanning suites with noise-canceling audio',
                'Same-day radiologist review & doctor teleconsultation',
                'Private valet parking & lounge access'
            ]
        },
        {
            id: 'mumbai',
            name: 'Mumbai',
            isLive: true,
            pin: { x: 122, y: 405 },
            // Line goes left to x=80, up to y=330, then left to card at x=60
            linePath: 'M 114 405 H 80 V 330 H 60',
            card: { x: -85, y: 306, w: 145, h: 48 },
            area: 'Bandra West & Lower Parel',
            address: 'Horizon Medical Tower, Turner Road, Bandra West, Mumbai 400050',
            hours: 'Mon - Sun: 7:00 AM - 9:30 PM',
            phone: '+91 22 6123 4567',
            equipment: [
                '3.0T Wide-Bore Silent MRI (Zero radiation)',
                'Somatom Force Dual-Source Low-Dose CT',
                'Advanced DEXA Whole-Body Composition System',
                'In-house Clinical Genomics & Biomarker Analysis'
            ],
            features: [
                'Dedicated luxury patient hospitality suites',
                'Integrated AI pre-scan diagnostic triage',
                'Direct specialist counseling in person or on Cent app'
            ]
        },
        {
            id: 'pune',
            name: 'Pune',
            isLive: false,
            pin: { x: 144, y: 432 },
            // Line goes straight left to card at x=60
            linePath: 'M 136 432 H 60',
            card: { x: -85, y: 408, w: 145, h: 48 },
            area: 'Koregaon Park',
            address: 'North Main Road, Koregaon Park, Pune 411001',
            hours: 'Opening Q1 2027',
            phone: '+91 20 4890 1234',
            expectedDate: 'March 2027',
            waitlistCount: 1420,
            equipment: [
                '3.0T High-Field MRI Scanner',
                'Ultra Low-Dose Cardiac CAC CT Scanner',
                'DEXA Metabolic & Bone Scanner',
                '100+ Biomarker Automated Analyzer'
            ],
            features: [
                'Priority appointment slots for waitlist members',
                'Flat ₹1,500 promotional pre-launch discount',
                'Complimentary home blood sample pickup'
            ]
        },
        {
            id: 'hyderabad',
            name: 'Hyderabad',
            isLive: false,
            pin: { x: 236, y: 468 },
            // Line goes straight right to card at x=365
            linePath: 'M 244 468 H 365',
            card: { x: 365, y: 444, w: 155, h: 48 },
            area: 'Jubilee Hills & HITEC City',
            address: 'Road No. 36, Jubilee Hills, Hyderabad 500033',
            hours: 'Opening Q1 2027',
            phone: '+91 40 4567 8901',
            expectedDate: 'April 2027',
            waitlistCount: 1180,
            equipment: [
                '3.0T Wide-Bore Silent MRI',
                'Cardiac Calcium Scoring CT',
                'Whole Exome Genomic Sequencing Suite',
                'DEXA Osteo & Visceral Fat Analyzer'
            ],
            features: [
                'Early access registration for Telanganaites',
                'Complimentary clinical geneticist consultation',
                'Zero-interest EMI options for preventive scans'
            ]
        },
        {
            id: 'bangalore',
            name: 'Bangalore',
            isLive: true,
            pin: { x: 198, y: 560 },
            // Line goes straight right to card at x=350
            linePath: 'M 206 560 H 350',
            card: { x: 350, y: 536, w: 155, h: 48 },
            area: 'Indiranagar & Koramangala',
            address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
            hours: 'Mon - Sun: 7:00 AM - 9:00 PM',
            phone: '+91 80 4321 8765',
            equipment: [
                'Siemens 3.0T Magnetom High-Resolution MRI',
                'Somatom Dual-Source Low-Dose Cardiac CT',
                'Horizon DEXA Whole Body Scanner',
                'Next-Gen DNA Sequencing & Biomarkers'
            ],
            features: [
                'Pioneering flagship center with AI diagnostic co-pilot',
                'Instant digital scan playback on the Cent app',
                'Seamless integration with Bangalore premier hospital networks'
            ]
        },
        {
            id: 'chennai',
            name: 'Chennai',
            isLive: false,
            pin: { x: 268, y: 568 },
            // Line goes horizontal left to card at x=80
            linePath: 'M 260 568 H 80',
            card: { x: -65, y: 544, w: 145, h: 48 },
            area: 'Nungambakkam & Alwarpet',
            address: 'Khader Nawaz Khan Road, Nungambakkam, Chennai 600034',
            hours: 'Opening Q1 2027',
            phone: '+91 44 4890 5678',
            expectedDate: 'May 2027',
            waitlistCount: 960,
            equipment: [
                'Radiation-Free 3.0T MRI',
                'Low-Dose High-Speed Cardiac CT',
                'DEXA Bone & Muscle Mass Analysis',
                'Specialized Preventive Cardiology Protocol'
            ],
            features: [
                'Early waitlist pass with complimentary dietary report',
                'NABH accredited certified clinical facility',
                'Doctor-explained bilingual report delivery'
            ]
        }
    ];

    const handleJoinWaitlist = (e: React.FormEvent, cityName: string) => {
        e.preventDefault();
        if (!waitlistEmail.trim()) return;
        setWaitlistSuccessCity(cityName);
        setWaitlistEmail('');
        setTimeout(() => setWaitlistSuccessCity(null), 6000);
    };

    const scrollToBooking = (cityName: string) => {
        setSelectedCity(null);
        setIsLocationsModalOpen(false);
        const bookingElement = document.getElementById('included');
        if (bookingElement) {
            bookingElement.scrollIntoView({ behavior: 'smooth' });
        }
        // Save preference in localStorage
        localStorage.setItem('swaraksha_selected_city', cityName);
    };

    const filteredModalCities = cities.filter(city => {
        if (modalFilter === 'live') return city.isLive;
        if (modalFilter === 'upcoming') return !city.isLive;
        return true;
    });

    return (
        <section
            id="scan-centres"
            className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#F8F6FD] border-t border-purple-100/60 overflow-hidden"
        >
            {/* Ambient subtle light glow */}
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-200/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* LEFT COLUMN: Headings, Subtitle & Outlined CTA */}
                    <div className="lg:col-span-5 space-y-6 z-10">

                        {/* Dark Purple Pill Badge - Exact match to screenshot */}
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#2C114D] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                            EXPANDING TO 3 NEW CITIES
                        </div>

                        {/* Large Headline - Exact match to screenshot */}
                        <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#111827] tracking-tight leading-[1.12]">
                            Scan centres <br />
                            across India
                        </h2>

                        {/* Body paragraph - Exact match to screenshot */}
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md font-normal">
                            Experience zero wait times, ambient lighting, and immediate specialist consultations in a city near you.
                        </p>

                        {/* Outlined Pill Button "View Locations" - Exact match to screenshot */}
                        <div className="pt-2">
                            <button
                                onClick={() => setIsLocationsModalOpen(true)}
                                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-[#581C87] text-[#581C87] hover:bg-[#581C87] hover:text-white font-semibold text-sm transition-all duration-300 shadow-xs hover:shadow-md active:scale-95"
                            >
                                <span>View Locations</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Trust Micro-Metrics */}
                        <div className="pt-6 grid grid-cols-3 gap-4 border-t border-purple-200/50 max-w-md">
                            <div>
                                <div className="text-2xl font-black text-[#2C114D]">3</div>
                                <div className="text-xs text-gray-500 font-medium">Live Scanning Hubs</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-[#581C87]">3</div>
                                <div className="text-xs text-gray-500 font-medium">Coming Soon (Q1)</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-emerald-700">100%</div>
                                <div className="text-xs text-gray-500 font-medium">NABH / NABL Certified</div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Interactive India Dotted Matrix Map */}
                    <div className="lg:col-span-7 relative flex items-center justify-center">

                        {/* SVG Container with Calibrated ViewBox accommodating cards and lines */}
                        <div className="w-full max-w-[680px] relative select-none">
                            <svg
                                viewBox="-95 60 700 660"
                                className="w-full h-auto drop-shadow-sm overflow-visible"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    {/* Dotted Grid Pattern: Soft Lavender Dots */}
                                    <pattern
                                        id="india-dots-grid"
                                        x="0"
                                        y="0"
                                        width="10.5"
                                        height="10.5"
                                        patternUnits="userSpaceOnUse"
                                    >
                                        <circle cx="5.25" cy="5.25" r="1.6" fill="#DDD6FE" />
                                    </pattern>

                                    {/* Mask of India from all state paths */}
                                    <mask id="india-map-mask">
                                        <rect x="-100" y="0" width="800" height="750" fill="black" />
                                        <g fill="white">
                                            {indiaMapData.locations.map((loc) => (
                                                <path key={loc.id} d={loc.path} />
                                            ))}
                                        </g>
                                    </mask>

                                    {/* Subtle card drop shadow */}
                                    <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" />
                                    </filter>

                                    {/* Glow filter for active/hovered pins */}
                                    <filter id="pin-glow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#7C3AED" floodOpacity="0.5" />
                                    </filter>
                                </defs>

                                {/* 1. The Dotted Silhouette of India */}
                                <rect
                                    x="0"
                                    y="0"
                                    width="612"
                                    height="696"
                                    fill="url(#india-dots-grid)"
                                    mask="url(#india-map-mask)"
                                />

                                {/* 2. Connecting Lines */}
                                <g className="connecting-lines pointer-events-none">
                                    {cities.map((city) => {
                                        const isHovered = hoveredCityId === city.id;
                                        return (
                                            <path
                                                key={`line-${city.id}`}
                                                d={city.linePath}
                                                fill="none"
                                                stroke={
                                                    city.isLive
                                                        ? (isHovered ? '#4A1D96' : '#581C87')
                                                        : (isHovered ? '#4B5563' : '#9CA3AF')
                                                }
                                                strokeWidth={city.isLive ? (isHovered ? 2.5 : 1.8) : 1.6}
                                                strokeDasharray={city.isLive ? undefined : '3, 4'}
                                                className="transition-all duration-300"
                                            />
                                        );
                                    })}
                                </g>

                                {/* 3. City Location Pin Markers */}
                                <g className="city-pins">
                                    {cities.map((city) => {
                                        const isHovered = hoveredCityId === city.id;
                                        return (
                                            <g
                                                key={`pin-${city.id}`}
                                                transform={`translate(${city.pin.x}, ${city.pin.y})`}
                                                className="cursor-pointer transition-transform duration-300"
                                                onMouseEnter={() => setHoveredCityId(city.id)}
                                                onMouseLeave={() => setHoveredCityId(null)}
                                                onClick={() => setSelectedCity(city)}
                                            >
                                                {/* Pulse Ripple Circle on Live or Hovered */}
                                                {(city.isLive || isHovered) && (
                                                    <circle
                                                        cx="0"
                                                        cy="-10"
                                                        r={isHovered ? "16" : "12"}
                                                        fill={city.isLive ? "#7C3AED" : "#9CA3AF"}
                                                        opacity={isHovered ? "0.3" : "0.15"}
                                                        className="animate-pulse"
                                                    />
                                                )}

                                                {/* Pin Droplet Geometry */}
                                                <path
                                                    d="M 0 0 C -3.5 -3.5 -6 -7 -6 -10.5 A 6 6 0 1 1 6 -10.5 C 6 -7 3.5 -3.5 0 0 Z"
                                                    fill={city.isLive ? "#581C87" : "#9CA3AF"}
                                                    filter={isHovered ? "url(#pin-glow)" : undefined}
                                                    className="transition-colors duration-200"
                                                />
                                                {/* Inner Center Dot */}
                                                <circle cx="0" cy="-10.5" r="2.2" fill="white" />
                                            </g>
                                        );
                                    })}
                                </g>

                                {/* 4. Floating City Cards (SVG Groups for pixel-perfect line anchoring) */}
                                <g className="city-cards">
                                    {cities.map((city) => {
                                        const isHovered = hoveredCityId === city.id;
                                        const badgeWidth = city.isLive ? 42 : 78;
                                        const badgeHeight = 20;
                                        const badgeX = city.card.x + city.card.w - badgeWidth - 12;
                                        const badgeY = city.card.y + (city.card.h - badgeHeight) / 2;

                                        return (
                                            <g
                                                key={`card-${city.id}`}
                                                className="cursor-pointer transition-transform duration-200"
                                                onMouseEnter={() => setHoveredCityId(city.id)}
                                                onMouseLeave={() => setHoveredCityId(null)}
                                                onClick={() => setSelectedCity(city)}
                                                transform={isHovered ? `scale(1.03) translate(${city.card.x * -0.03}, ${city.card.y * -0.03})` : undefined}
                                            >
                                                {/* Card Background Rect */}
                                                <rect
                                                    x={city.card.x}
                                                    y={city.card.y}
                                                    width={city.card.w}
                                                    height={city.card.h}
                                                    rx="14"
                                                    fill="#FFFFFF"
                                                    filter="url(#card-shadow)"
                                                    stroke={isHovered ? (city.isLive ? "#7C3AED" : "#9CA3AF") : "#F3F4F6"}
                                                    strokeWidth={isHovered ? "1.5" : "1"}
                                                    className="transition-colors duration-200"
                                                />

                                                {/* Left Status Dot */}
                                                <circle
                                                    cx={city.card.x + 18}
                                                    cy={city.card.y + city.card.h / 2}
                                                    r="3.5"
                                                    fill={city.isLive ? "#581C87" : "#9CA3AF"}
                                                />

                                                {/* City Name */}
                                                <text
                                                    x={city.card.x + 28}
                                                    y={city.card.y + city.card.h / 2 + 4.5}
                                                    fill="#111827"
                                                    fontSize="13"
                                                    fontWeight="700"
                                                    fontFamily="system-ui, -apple-system, sans-serif"
                                                >
                                                    {city.name}
                                                </text>

                                                {/* Status Badge Pill */}
                                                <rect
                                                    x={badgeX}
                                                    y={badgeY}
                                                    width={badgeWidth}
                                                    height={badgeHeight}
                                                    rx="10"
                                                    fill={city.isLive ? "#EDE9FE" : "#F3F4F6"}
                                                />
                                                <text
                                                    x={badgeX + badgeWidth / 2}
                                                    y={badgeY + badgeHeight / 2 + 3.5}
                                                    textAnchor="middle"
                                                    fill={city.isLive ? "#581C87" : "#6B7280"}
                                                    fontSize="10"
                                                    fontWeight="600"
                                                    fontFamily="system-ui, -apple-system, sans-serif"
                                                >
                                                    {city.isLive ? "Live" : "Coming Soon"}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </g>
                            </svg>
                        </div>

                    </div>

                </div>
            </div>

            {/* FLOATING ACTION BUTTONS: Phone & Chat in bottom right - Exact match to screenshot */}
            <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
                {/* Phone Call Button */}
                <a
                    href="tel:18001234567"
                    title="Call Clinical Helpline"
                    className="w-12 h-12 rounded-full bg-[#4A4B50] hover:bg-[#323337] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group relative"
                >
                    <Phone className="w-5 h-5 group-hover:animate-bounce" />
                    <span className="absolute right-14 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        1800-SWARAKSHA
                    </span>
                </a>

                {/* Chat Bot Button */}
                <button
                    onClick={() => {
                        const chatLink = document.querySelector('a[href="/consultation/chat_bot"]') as HTMLElement;
                        if (chatLink) chatLink.click();
                        else window.location.href = '/consultation/chat_bot';
                    }}
                    title="Chat with SwaRaksha AI"
                    className="w-12 h-12 rounded-full bg-[#4A4B50] hover:bg-[#323337] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group relative"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="absolute right-14 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        HealthGPT Chat
                    </span>
                </button>
            </div>

            {/* SINGLE CITY DETAIL MODAL (Opens on clicking pin or city card) */}
            {selectedCity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div
                        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedCity(null)}
                            className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Header */}
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                                    selectedCity.isLive
                                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                                }`}
                            >
                                {selectedCity.isLive ? 'Live Diagnostic Centre' : `Coming in ${selectedCity.expectedDate}`}
                            </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                            SwaRaksha {selectedCity.name} Centre
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 font-medium">{selectedCity.area}</p>

                        {/* Address & Hours */}
                        <div className="mt-5 space-y-2.5 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs sm:text-sm">
                            <div className="flex items-start gap-2.5 text-gray-700">
                                <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                                <span>{selectedCity.address}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-700">
                                <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>{selectedCity.hours}</span>
                            </div>
                            {selectedCity.isLive && (
                                <div className="flex items-center gap-2.5 text-gray-700">
                                    <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                                    <span>{selectedCity.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Diagnostic Equipment */}
                        <div className="mt-5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2.5">
                                Scanning Technologies Available
                            </h4>
                            <div className="space-y-2">
                                {selectedCity.equipment.map((eq, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>{eq}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-7 pt-4 border-t border-gray-100">
                            {selectedCity.isLive ? (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => scrollToBooking(selectedCity.name)}
                                        className="flex-1 py-3.5 px-4 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-md"
                                    >
                                        <span>Book Scan in {selectedCity.name}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent('SwaRaksha ' + selectedCity.name + ' ' + selectedCity.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-3.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Get Directions</span>
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {waitlistSuccessCity === selectedCity.name ? (
                                        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-center text-xs font-semibold">
                                            🎉 You are on the priority launch list! We will notify you with your ₹1,500 voucher when booking opens.
                                        </div>
                                    ) : (
                                        <form onSubmit={(e) => handleJoinWaitlist(e, selectedCity.name)} className="space-y-2.5">
                                            <div className="text-xs text-gray-600 font-medium">
                                                Join <strong>{selectedCity.waitlistCount}+</strong> residents for VIP early-bird access & ₹1,500 off voucher:
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="email"
                                                    placeholder="Enter your email or phone"
                                                    value={waitlistEmail}
                                                    onChange={(e) => setWaitlistEmail(e.target.value)}
                                                    className="flex-1 px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-600"
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2.5 rounded-xl bg-[#2C114D] text-white text-xs font-bold hover:bg-[#3D186A] transition whitespace-nowrap"
                                                >
                                                    Join Waitlist
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {/* FULL LOCATIONS DIRECTORY MODAL (Opens on "View Locations" button click) */}
            {isLocationsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div
                        className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-2xl font-extrabold text-[#111827]">
                                    SwaRaksha Scan Centres Directory
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    3 Live Centres across metro hubs & 3 upcoming facilities
                                </p>
                            </div>
                            <button
                                onClick={() => setIsLocationsModalOpen(false)}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 pt-4 pb-2">
                            <button
                                onClick={() => setModalFilter('all')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                                    modalFilter === 'all'
                                        ? 'bg-[#2C114D] text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                All Locations ({cities.length})
                            </button>
                            <button
                                onClick={() => setModalFilter('live')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                                    modalFilter === 'live'
                                        ? 'bg-[#581C87] text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Live Now (3)
                            </button>
                            <button
                                onClick={() => setModalFilter('upcoming')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                                    modalFilter === 'upcoming'
                                        ? 'bg-amber-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Expanding To (3)
                            </button>
                        </div>

                        {/* Cities Grid */}
                        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-1 md:grid-cols-2 gap-4 pr-1">
                            {filteredModalCities.map((city) => (
                                <div
                                    key={city.id}
                                    className="p-5 rounded-2xl border border-gray-100 hover:border-purple-200 bg-gray-50/50 hover:bg-purple-50/20 transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-lg font-bold text-gray-900">{city.name}</h4>
                                            <span
                                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                                                    city.isLive
                                                        ? 'bg-purple-100 text-purple-900'
                                                        : 'bg-amber-100 text-amber-900'
                                                }`}
                                            >
                                                {city.isLive ? 'Live' : 'Coming Soon'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600 font-medium mb-1">{city.area}</div>
                                        <div className="text-xs text-gray-500 leading-snug mb-3">{city.address}</div>

                                        <div className="text-xs text-purple-900 font-semibold mb-2">
                                            Equipped with 3T MRI, Low-Dose CT, DEXA
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between">
                                        <button
                                            onClick={() => {
                                                setIsLocationsModalOpen(false);
                                                setSelectedCity(city);
                                            }}
                                            className="text-xs font-bold text-[#581C87] hover:underline flex items-center gap-1"
                                        >
                                            <span>View Full Details</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>

                                        {city.isLive ? (
                                            <button
                                                onClick={() => scrollToBooking(city.name)}
                                                className="px-3.5 py-1.5 rounded-lg bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
                                            >
                                                Book Scan
                                            </button>
                                        ) : (
                                            <span className="text-[11px] text-gray-500 font-medium">
                                                Opening {city.expectedDate}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-600" />
                                <span>Zero radiation high-field diagnostic imaging standard</span>
                            </div>
                            <div className="font-medium">
                                Need custom corporate screening? <a href="mailto:corporate@swaraksha.ai" className="text-purple-700 underline font-bold">Contact Corporate Team</a>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </section>
    );
};

export default ScanCentresAcrossIndia;

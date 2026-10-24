import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    Search,
    Phone,
    MessageCircle,
    User,
    ChevronDown,
    Download,
    Menu,
    X,
    Activity,
    CheckCircle2
} from "lucide-react";

const CITIES = [
    'Bangalore',
    'Hyderabad',
    'Delhi NCR',
    'Mumbai',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad'
];

export function NavBar() {
    const [selectedCity, setSelectedCity] = useState('Bangalore');
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 bg-white shadow-xs">
            {/* ========================================================
                1. TOP HEADER (Logo, City, Search, Contacts, Profile)
               ======================================================== */}
            <div className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
                    <div className="flex items-center justify-between gap-3 md:gap-6">
                        
                        {/* Logo + Divider + City Selector */}
                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            {/* Apollo Diagnostics Style Brand Logo */}
                            <a href="/" className="flex items-center group">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#9B2346] via-[#D32F2F] to-[#FF6F00] flex items-center justify-center shadow-xs text-white">
                                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                                </div>
                                <div className="ml-2 flex flex-col leading-tight">
                                    <span className="text-lg sm:text-2xl font-black tracking-tight text-[#9B2346]">
                                        Apollo
                                    </span>
                                    <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#00796B] -mt-1">
                                        DIAGNOSTICS
                                    </span>
                                    <span className="text-[8px] sm:text-[9px] text-gray-400 italic -mt-0.5 hidden md:inline">
                                        Expertise. Empowering you.
                                    </span>
                                </div>
                            </a>

                            {/* Vertical divider matching screenshot */}
                            <div className="hidden sm:block h-7 w-[1px] bg-gray-200 mx-1" />

                            {/* Location Selector Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-[#fdf2f4] hover:bg-[#fae5e9] text-gray-800 rounded-lg text-xs sm:text-sm font-semibold transition border border-pink-100"
                                >
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#f8d7dc] flex items-center justify-center text-[#9B2346]">
                                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    </div>
                                    <span className="font-bold text-gray-700">{selectedCity}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                </button>

                                {isCityDropdownOpen && (
                                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl z-50 py-2">
                                        <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Select City
                                        </div>
                                        {CITIES.map((city) => (
                                            <button
                                                key={city}
                                                onClick={() => {
                                                    setSelectedCity(city);
                                                    setIsCityDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 transition flex items-center justify-between ${
                                                    selectedCity === city ? 'text-[#9B2346] font-bold bg-[#fff5f6]' : 'text-gray-700'
                                                }`}
                                            >
                                                <span>{city}</span>
                                                {selectedCity === city && <CheckCircle2 className="w-3.5 h-3.5 text-[#9B2346]" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Search Bar matching screenshot */}
                        <div className="flex-1 max-w-xl relative hidden md:block">
                            <div className="relative flex items-center">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search tests, health packages, symptoms..."
                                    value={searchQuery}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-[#f4f7f6] hover:bg-[#eef3f2] focus:bg-white text-xs sm:text-sm text-gray-800 rounded-lg border border-transparent focus:border-[#00877a] focus:ring-2 focus:ring-[#00877a]/15 outline-none transition"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 text-gray-400 hover:text-gray-600 text-xs"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Search Suggestions */}
                            {isSearchFocused && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 z-50">
                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Popular Tests
                                    </div>
                                    <div className="space-y-1">
                                        {['Xpert Health Comprehensive', 'Complete Blood Count (CBC)', 'Lipid Profile', 'Thyroid Profile Total', 'HbA1c & Diabetes Panel'].map((test) => (
                                            <div
                                                key={test}
                                                onClick={() => navigate('/survey')}
                                                className="px-3 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer text-xs font-semibold text-gray-800 flex items-center justify-between"
                                            >
                                                <span>{test}</span>
                                                <span className="text-[10px] text-emerald-700 font-bold">Book Online ›</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Contact Icons & Home Collection Badge */}
                        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
                            {/* Call Button */}
                            <a
                                href="tel:04069467075"
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#e1f5fe] text-[#0288d1] hover:bg-[#b3e5fc] flex items-center justify-center transition shadow-2xs"
                                title="Call Diagnostic Center"
                            >
                                <Phone className="w-4 h-4 fill-current" />
                            </a>

                            {/* WhatsApp Button */}
                            <a
                                href="https://wa.me/9104069467075?text=Hello%20Apollo%20Diagnostics%2C%20I%20want%20to%20book%20a%20test."
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#e8f5e9] text-[#2e7d32] hover:bg-[#c8e6c9] flex items-center justify-center transition shadow-2xs"
                                title="WhatsApp Booking"
                            >
                                <MessageCircle className="w-4 h-4 fill-current" />
                            </a>

                            {/* Home Collection Badge */}
                            <a
                                href="tel:04069467075"
                                className="hidden lg:flex items-center gap-2 pl-2 pr-3 py-1 bg-[#fce4ec] hover:bg-[#f8bbd0] rounded-full text-[#c2185b] transition shadow-2xs"
                            >
                                <div className="w-6 h-6 rounded-full bg-[#f06292] text-white flex items-center justify-center text-[10px] font-bold">
                                    🏠
                                </div>
                                <div className="flex flex-col text-left leading-tight">
                                    <span className="text-[10px] text-gray-600 font-medium">Home Collection</span>
                                    <span className="text-xs font-black text-[#ad1457]">04069467075</span>
                                </div>
                            </a>

                            {/* User Profile / Patient Login Icon matching screenshot */}
                            <button
                                onClick={() => navigate('/consultation/patient')}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#9B2346] text-white hover:bg-[#801735] flex items-center justify-center transition shadow-2xs"
                                title="Sign In / Patient Account"
                            >
                                <User className="w-4 h-4" />
                            </button>

                            {/* Mobile Hamburger Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================================
                2. SECONDARY SUBNAV BAR (Categories, Booking, Reports)
               ======================================================== */}
            <div className="border-b border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-2 text-xs sm:text-[13px] font-medium text-gray-700 overflow-x-auto no-scrollbar whitespace-nowrap gap-4 sm:gap-7">
                        
                        <div className="flex items-center gap-4 sm:gap-6">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'risks' ? null : 'risks')}
                                className="flex items-center gap-1 hover:text-[#9B2346] transition py-1"
                            >
                                <span>Health Risks</span>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            </button>

                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'conditions' ? null : 'conditions')}
                                className="flex items-center gap-1 hover:text-[#9B2346] transition py-1"
                            >
                                <span>Health Conditions</span>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            </button>

                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'packages' ? null : 'packages')}
                                className="flex items-center gap-1 hover:text-[#9B2346] transition py-1"
                            >
                                <span>Health Check Packages</span>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            </button>

                            <button
                                onClick={() => navigate('/survey')}
                                className="hover:text-[#9B2346] transition py-1"
                            >
                                Book A Test
                            </button>

                            <a
                                href="#centres"
                                className="hover:text-[#9B2346] transition py-1"
                            >
                                Find Nearest Centre
                            </a>

                            <button
                                onClick={() => navigate('/consultation/doctor')}
                                className="hover:text-[#9B2346] transition py-1"
                            >
                                Franchise
                            </button>
                        </div>

                        {/* Download Report Button with Icon */}
                        <button
                            onClick={() => navigate('/consultation/upload_reports')}
                            className="flex items-center gap-1.5 text-gray-800 hover:text-[#9B2346] transition py-1 flex-shrink-0"
                        >
                            <Download className="w-3.5 h-3.5 text-[#9B2346]" />
                            <span className="font-semibold">Download Report</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4 space-y-3 shadow-xl">
                    <button
                        onClick={() => { navigate('/survey'); setIsMenuOpen(false); }}
                        className="w-full text-left py-1 text-sm font-semibold text-gray-800 hover:text-[#9B2346]"
                    >
                        Book A Test
                    </button>
                    <button
                        onClick={() => { navigate('/consultation/upload_reports'); setIsMenuOpen(false); }}
                        className="w-full text-left py-1 text-sm font-semibold text-gray-800 hover:text-[#9B2346]"
                    >
                        Download Report
                    </button>
                    <button
                        onClick={() => { navigate('/consultation/doctor'); setIsMenuOpen(false); }}
                        className="w-full text-left py-1 text-sm font-semibold text-gray-800 hover:text-[#9B2346]"
                    >
                        Doctor Portal / Franchise
                    </button>
                    <button
                        onClick={() => { navigate('/consultation/patient'); setIsMenuOpen(false); }}
                        className="w-full text-left py-1 text-sm font-bold text-[#9B2346]"
                    >
                        Patient Login / Portal
                    </button>
                </div>
            )}
        </header>
    );
}

export default NavBar;
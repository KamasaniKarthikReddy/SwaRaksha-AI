import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { BACKEND_URL } from '../consultation/services/api.ts';
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
    CheckCircle2,
    Mail,
    LogOut,
    Sparkles,
    ArrowRight
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

    // Profile & Gmail Login State
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [gmailInput, setGmailInput] = useState('');
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [user, setUser] = useState<{ role?: string; email?: string; name?: string; phone?: string } | null>(null);

    const profileMenuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Check existing auth token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`${BACKEND_URL}/api/auth/verify`, { token })
                .then(res => {
                    if (res.data && res.data.role !== 'noRole') {
                        setUser(res.data);
                    } else {
                        setUser(null);
                    }
                })
                .catch(() => setUser(null));
        }
    }, []);

    // Click outside handler for profile menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Google Sign In handler
    const handleGoogleLogin = async (credentialResponse: any) => {
        try {
            setIsLoginLoading(true);
            setLoginError(null);
            const { data } = await axios.post(`${BACKEND_URL}/api/auth/generateTokenP`, {
                token: credentialResponse.credential
            });
            if (data.token && data.token !== 'tokenNotGranted') {
                localStorage.setItem('token', data.token);
                setUser({ role: 'patient', email: data.email, name: data.name });
                setIsProfileMenuOpen(false);
                navigate('/consultation/patient');
            } else {
                setLoginError(data.message || 'Login not granted.');
            }
        } catch (e: any) {
            console.error('Google login error:', e);
            setLoginError('Google Sign-In failed. Please try again.');
        } finally {
            setIsLoginLoading(false);
        }
    };

    // Direct Gmail / Email Login handler
    const handleGmailLogin = async (emailToUse?: string) => {
        const email = (emailToUse || gmailInput).trim();
        if (!email || !email.includes('@')) {
            setLoginError('Please enter a valid email address.');
            return;
        }
        try {
            setIsLoginLoading(true);
            setLoginError(null);
            const { data } = await axios.post(`${BACKEND_URL}/api/auth/generateTokenP`, {
                email: email,
                name: email.split('@')[0],
                picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
            });
            if (data.token && data.token !== 'tokenNotGranted') {
                localStorage.setItem('token', data.token);
                setUser({ role: 'patient', email: data.email, name: data.name });
                setIsProfileMenuOpen(false);
                navigate('/consultation/patient');
            } else {
                setLoginError(data.message || 'Login not granted.');
            }
        } catch (e: any) {
            console.error('Gmail login error:', e);
            setLoginError('Failed to continue as mail. Please check connection.');
        } finally {
            setIsLoginLoading(false);
        }
    };

    // Sign out handler
    const handleSignOut = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsProfileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-xs">
            {/* ========================================================
                1. TOP HEADER (SwaRaksha-AI Logo, City, Search, Contacts, Profile)
               ======================================================== */}
            <div className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
                    <div className="flex items-center justify-between gap-3 md:gap-6">
                        
                        {/* SwaRaksha-AI Brand Logo + Divider + City Selector */}
                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                            {/* New SwaRaksha-AI Brand Logo */}
                            <a href="/" className="flex items-center group">
                                <img
                                    src="/logo/swaraksha_ai_logo.png"
                                    alt="SwaRaksha-AI"
                                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl shadow-xs object-contain group-hover:scale-105 transition-transform"
                                />
                                <div className="ml-2.5 flex flex-col leading-tight">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-lg sm:text-2xl font-black tracking-tight text-[#9B2346]">
                                            SwaRaksha
                                        </span>
                                        <span className="text-[11px] sm:text-xs font-black px-1.5 py-0.5 rounded-md bg-[#00796B] text-white">
                                            AI
                                        </span>
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#00796B] -mt-0.5">
                                        DIAGNOSTICS
                                    </span>
                                    <span className="text-[8px] sm:text-[9px] text-gray-400 italic -mt-0.5 hidden md:inline">
                                        Intelligent Care. Empowering you.
                                    </span>
                                </div>
                            </a>

                            {/* Vertical divider */}
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

                        {/* Search Bar */}
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
                                        Popular Diagnostic Tests
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

                        {/* Right Contact Icons, Home Collection & Profile Icon with Gmail Dropdown */}
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
                                href="https://wa.me/9104069467075?text=Hello%20SwaRaksha%20AI%2C%20I%20want%20to%20book%20a%20test."
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

                            {/* ========================================================
                                USER PROFILE ICON & "CONTINUE AS GMAIL" DROPDOWN
                               ======================================================== */}
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition shadow-2xs cursor-pointer ${
                                        user
                                            ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                                            : 'bg-[#9B2346] hover:bg-[#801735] text-white'
                                    }`}
                                    title={user ? `Signed in as ${user.name || user.email}` : "Sign In with Gmail / Account"}
                                >
                                    <User className="w-4 h-4" />
                                </button>

                                {/* Profile / Continue As Gmail Dropdown Modal */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2.5 w-80 sm:w-88 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
                                        
                                        {user ? (
                                            /* State: User Is Already Logged In */
                                            <div>
                                                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#9B2346] to-pink-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                                        {(user.name || user.email || 'P')[0].toUpperCase()}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-bold text-gray-900 truncate">
                                                            {user.name || 'Verified Patient'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {user.email || user.phone || 'patient@swaraksha.org'}
                                                        </p>
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                                                            ● Active Patient Session
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="py-2.5 space-y-1">
                                                    <button
                                                        onClick={() => {
                                                            navigate('/consultation/patient');
                                                            setIsProfileMenuOpen(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-[#f0faf9] hover:text-[#00796B] rounded-lg transition flex items-center justify-between"
                                                    >
                                                        <span>Patient Portal Dashboard</span>
                                                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            navigate('/consultation/upload_reports');
                                                            setIsProfileMenuOpen(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-[#f0faf9] hover:text-[#00796B] rounded-lg transition flex items-center justify-between"
                                                    >
                                                        <span>My Medical Reports</span>
                                                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                                                    </button>
                                                </div>

                                                <div className="pt-2 border-t border-gray-100">
                                                    <button
                                                        onClick={handleSignOut}
                                                        className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                                                    >
                                                        <LogOut className="w-3.5 h-3.5" />
                                                        <span>Sign Out</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* State: User Not Logged In -> "CONTINUE AS GMAIL / MAIL" */
                                            <div>
                                                <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                                                    <div>
                                                        <h3 className="text-sm font-bold text-gray-900">Sign In to SwaRaksha-AI</h3>
                                                        <p className="text-[11px] text-gray-500">Access instant reports & doctor consultation</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setIsProfileMenuOpen(false)}
                                                        className="text-gray-400 hover:text-gray-600 p-1"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {loginError && (
                                                    <div className="mb-2.5 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[11px]">
                                                        {loginError}
                                                    </div>
                                                )}

                                                {/* Google OAuth Login Button */}
                                                <div className="flex justify-center mb-3">
                                                    <GoogleLogin
                                                        onSuccess={handleGoogleLogin}
                                                        onError={() => setLoginError('Google Sign-In failed')}
                                                        theme="outline"
                                                        size="medium"
                                                        shape="pill"
                                                        text="continue_with"
                                                    />
                                                </div>

                                                <div className="flex items-center my-2.5">
                                                    <div className="flex-grow border-t border-gray-200"></div>
                                                    <span className="flex-shrink mx-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                                        or continue with Gmail
                                                    </span>
                                                    <div className="flex-grow border-t border-gray-200"></div>
                                                </div>

                                                {/* Gmail / Email Input Form */}
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handleGmailLogin();
                                                    }}
                                                    className="space-y-2.5"
                                                >
                                                    <div className="relative flex items-center">
                                                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                                                        <input
                                                            type="email"
                                                            placeholder="Enter your Gmail address"
                                                            value={gmailInput}
                                                            onChange={(e) => setGmailInput(e.target.value)}
                                                            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B2346] outline-none"
                                                            autoFocus
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={isLoginLoading || !gmailInput.includes('@')}
                                                        className="w-full py-2 px-3 bg-[#9B2346] hover:bg-[#801735] text-white text-xs font-bold rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                                    >
                                                        {isLoginLoading ? (
                                                            <span>Signing in...</span>
                                                        ) : (
                                                            <>
                                                                <Mail className="w-3.5 h-3.5" />
                                                                <span>Continue as Mail</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </form>

                                                {/* Quick Demo Sign In Button */}
                                                <button
                                                    onClick={() => handleGmailLogin("patient.demo@gmail.com")}
                                                    disabled={isLoginLoading}
                                                    className="w-full mt-2 py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-lg transition border border-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>Quick 1-Click Demo Gmail</span>
                                                </button>

                                                {/* Link to Mobile OTP option */}
                                                <div className="mt-3 pt-2.5 border-t border-gray-100 text-center">
                                                    <button
                                                        onClick={() => {
                                                            setIsProfileMenuOpen(false);
                                                            navigate('/consultation/patient');
                                                        }}
                                                        className="text-[11px] text-[#00796B] font-bold hover:underline"
                                                    >
                                                        📱 Prefer Mobile Number? Login with Mobile OTP ›
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>

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
                                className="hover:text-[#9B2346] transition py-1 font-bold text-emerald-800"
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
                                Doctor Consultation
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
                        Doctor Consultation
                    </button>
                    <button
                        onClick={() => { setIsProfileMenuOpen(true); setIsMenuOpen(false); }}
                        className="w-full text-left py-1 text-sm font-bold text-[#9B2346]"
                    >
                        Sign In as Gmail / Account
                    </button>
                </div>
            )}
        </header>
    );
}

export default NavBar;
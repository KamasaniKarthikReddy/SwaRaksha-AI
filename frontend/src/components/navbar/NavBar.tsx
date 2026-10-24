import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Menu, X, ArrowUpRight } from "lucide-react";

export function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleStartSurvey = () => {
        navigate('/survey');
        setIsMenuOpen(false);
    };

    const handleScrollTo = (id: string) => {
        setIsMenuOpen(false);
        if (location.pathname !== '/') {
            navigate('/#' + id);
            return;
        }
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header
            className={`fixed w-full z-50 top-0 start-0 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
                    : 'bg-white/80 backdrop-blur-xs py-4 border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Brand Logo matching Cent typography */}
                <a href="/" className="flex items-center gap-2 group">
                    <span className="text-3xl font-extrabold tracking-tight text-gray-950 font-poppins group-hover:text-purple-700 transition-colors">
                        Cent
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 tracking-wider uppercase">
                        <Sparkles className="w-2.5 h-2.5" /> SwaRaksha
                    </span>
                </a>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-gray-600">
                    <button
                        onClick={() => handleScrollTo('included')}
                        className="hover:text-black transition-colors"
                    >
                        What's Included
                    </button>
                    <button
                        onClick={() => handleScrollTo('science')}
                        className="hover:text-black transition-colors"
                    >
                        The Science
                    </button>
                    <button
                        onClick={() => handleScrollTo('conditions')}
                        className="hover:text-black transition-colors"
                    >
                        300+ Conditions
                    </button>
                    <button
                        onClick={() => handleScrollTo('how-it-works')}
                        className="hover:text-black transition-colors"
                    >
                        How It Works
                    </button>
                    <button
                        onClick={() => handleScrollTo('app')}
                        className="hover:text-black transition-colors"
                    >
                        Mobile App
                    </button>
                    <a
                        href="/consultation"
                        className="hover:text-black transition-colors"
                    >
                        Consultation
                    </a>
                    <a
                        href="/services"
                        className="hover:text-black transition-colors"
                    >
                        Services
                    </a>
                </nav>

                {/* Right Action Buttons */}
                <div className="hidden lg:flex items-center space-x-6">
                    <a
                        href="/consultation"
                        className="text-sm font-semibold text-gray-700 hover:text-black transition-colors"
                    >
                        Login
                    </a>
                    <button
                        onClick={handleStartSurvey}
                        className="bg-black hover:bg-gray-800 text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
                    >
                        Get Started
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Mobile Hamburger Toggle */}
                <div className="lg:hidden flex items-center gap-3">
                    <button
                        onClick={handleStartSurvey}
                        className="bg-black text-white text-xs font-bold px-4 py-2 rounded-full"
                    >
                        Get Started
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none"
                        aria-label="Toggle Navigation"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-5 space-y-4 shadow-xl">
                    <div className="flex flex-col space-y-3 text-base font-medium text-gray-800">
                        <button
                            onClick={() => handleScrollTo('included')}
                            className="text-left py-1 hover:text-purple-700"
                        >
                            What's Included
                        </button>
                        <button
                            onClick={() => handleScrollTo('science')}
                            className="text-left py-1 hover:text-purple-700"
                        >
                            The Science
                        </button>
                        <button
                            onClick={() => handleScrollTo('conditions')}
                            className="text-left py-1 hover:text-purple-700"
                        >
                            300+ Conditions
                        </button>
                        <button
                            onClick={() => handleScrollTo('how-it-works')}
                            className="text-left py-1 hover:text-purple-700"
                        >
                            How It Works
                        </button>
                        <button
                            onClick={() => handleScrollTo('app')}
                            className="text-left py-1 hover:text-purple-700"
                        >
                            Mobile App
                        </button>
                        <a
                            href="/consultation"
                            className="text-left py-1 hover:text-purple-700"
                        >
                            Doctor Consultation
                        </a>
                        <a
                            href="/services"
                            className="text-left py-1 hover:text-purple-700"
                        >
                            All Services
                        </a>
                        <a
                            href="/consultation"
                            className="text-left py-1 font-semibold text-purple-700"
                        >
                            Login / Patient Portal
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
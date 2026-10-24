import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { BACKEND_URL } from "../services/api.ts";
import DuplicateEmail from '../FlashyMessage/DuplicateEmail';
import PatientLogo from "../../../../public/icon/PatientLogo.tsx";
import { Phone, ShieldCheck, Mail, ArrowRight, RefreshCw, Edit2, Sparkles, AlertCircle } from 'lucide-react';

const PatientLogin = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
    
    // Phone & OTP states
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [patientName, setPatientName] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [demoOtp, setDemoOtp] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    
    // Email states
    const [customEmail, setCustomEmail] = useState('');
    const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
    
    // Status states
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Resend countdown timer
    useEffect(() => {
        let timer: any;
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Send OTP handler
    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            setErrorMessage('Please enter a valid 10-digit mobile number.');
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post(`${BACKEND_URL}/api/auth/send-otp`, {
                phone: cleanPhone
            });

            if (data.success) {
                setIsOtpSent(true);
                setDemoOtp(data.otp);
                setSuccessMessage(data.message || 'OTP sent successfully!');
                setResendCooldown(30);
            } else {
                setErrorMessage(data.message || 'Failed to send OTP.');
            }
        } catch (error: any) {
            console.error('Send OTP error:', error);
            setErrorMessage(error.response?.data?.message || 'Error connecting to OTP service. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Verify OTP handler
    const handleVerifyOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setErrorMessage(null);

        const cleanPhone = phone.replace(/\D/g, '');
        const cleanOtp = otp.trim();

        if (cleanOtp.length < 4) {
            setErrorMessage('Please enter the verification code.');
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post(`${BACKEND_URL}/api/auth/verify-otp`, {
                phone: cleanPhone,
                otp: cleanOtp,
                name: patientName.trim() || undefined
            });

            if (data.token === 'tokenNotGranted') {
                setErrorMessage(data.message || 'Account already registered as a Doctor.');
                return;
            }

            if (data.success && data.token) {
                localStorage.setItem('token', data.token);
                onLoginSuccess();
            } else {
                setErrorMessage(data.message || 'Verification failed. Please try again.');
            }
        } catch (error: any) {
            console.error('Verify OTP error:', error);
            setErrorMessage(error.response?.data?.message || 'Invalid or expired OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Google Login handler
    const handleGoogleLogin = async (credentialResponse: any) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const { data } = await axios.post(
                `${BACKEND_URL}/api/auth/generateTokenP`,
                { token: credentialResponse.credential }
            );
            if (data.token === 'tokenNotGranted') {
                setIsEmailDuplicate(true);
                return;
            }
            localStorage.setItem('token', data.token);
            onLoginSuccess();
        } catch (error) {
            console.error('Google login failed', error);
            setErrorMessage('Google Sign-In failed. Please try another method.');
        } finally {
            setIsLoading(false);
        }
    };

    // Direct / Email Login handler
    const handleDirectLogin = async (emailToUse?: string) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const email = (emailToUse || customEmail || "patient.demo@swaraksha.org").trim();
            const { data } = await axios.post(
                `${BACKEND_URL}/api/auth/generateTokenP`,
                { 
                    email: email,
                    name: email.split('@')[0],
                    picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
                }
            );
            if (data.token === 'tokenNotGranted') {
                setIsEmailDuplicate(true);
                return;
            }
            localStorage.setItem('token', data.token);
            onLoginSuccess();
        } catch (error) {
            console.error('Direct patient login failed', error);
            setErrorMessage('Login failed. Please verify credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen py-8">
            <div className="flex flex-col lg:flex-row items-center bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full mx-4 border border-gray-100">
                <div className="p-8 lg:w-1/2 flex flex-col justify-center w-full">
                    <div className="text-center mb-2">
                        <PatientLogo />
                    </div>
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-1">Patient Sign In</h2>
                    <p className="text-gray-500 text-xs text-center mb-6">
                        Access your patient portal, track symptoms, and connect with certified doctors.
                    </p>

                    {/* Login Method Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => {
                                setLoginMethod('phone');
                                setErrorMessage(null);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                                loginMethod === 'phone'
                                    ? 'bg-white text-emerald-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Mobile OTP</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">Fast</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setLoginMethod('email');
                                setErrorMessage(null);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                                loginMethod === 'email'
                                    ? 'bg-white text-emerald-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email / Google</span>
                        </button>
                    </div>

                    {/* Feedback Messages */}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {successMessage && !errorMessage && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* PHONE & OTP LOGIN SECTION */}
                    {loginMethod === 'phone' && (
                        <div>
                            {!isOtpSent ? (
                                /* Step 1: Enter Phone Number */
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            Mobile Number
                                        </label>
                                        <div className="flex rounded-lg shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 overflow-hidden">
                                            <span className="inline-flex items-center px-3 bg-gray-50 text-gray-600 text-xs font-medium border-r border-gray-300">
                                                🇮🇳 +91
                                            </span>
                                            <input
                                                type="tel"
                                                maxLength={10}
                                                placeholder="Enter 10-digit mobile number"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                                className="flex-1 px-3 py-2.5 text-sm outline-none text-gray-800 font-mono tracking-wider"
                                                autoFocus
                                            />
                                        </div>
                                        <p className="text-[11px] text-gray-400 mt-1">An authentication OTP will be sent to your number.</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || phone.replace(/\D/g, '').length < 10}
                                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Generating OTP...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <span>Get OTP</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                /* Step 2: Enter & Verify OTP */
                                <form onSubmit={handleVerifyOtp} className="space-y-4">
                                    <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-emerald-700" />
                                            <div>
                                                <p className="text-[11px] text-emerald-700 font-medium">OTP Sent to:</p>
                                                <p className="text-xs font-bold text-emerald-900 font-mono">+91 {phone}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsOtpSent(false);
                                                setOtp('');
                                                setDemoOtp(null);
                                                setErrorMessage(null);
                                            }}
                                            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                            Change
                                        </button>
                                    </div>

                                    {/* Instant Demo OTP auto-fill badge */}
                                    {demoOtp && (
                                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-medium">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                                <span>Demo OTP: <strong className="font-mono text-sm tracking-widest text-amber-950">{demoOtp}</strong></span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setOtp(demoOtp)}
                                                className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 text-[11px] font-semibold rounded-md transition"
                                            >
                                                Auto Fill
                                            </button>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                            6-Digit Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            placeholder="••••••"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-center text-lg font-mono tracking-[0.5em] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                            autoFocus
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Patient Name <span className="text-gray-400 text-[10px]">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            value={patientName}
                                            onChange={(e) => setPatientName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || otp.trim().length < 4}
                                        className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Verifying...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4" />
                                                Verify OTP & Sign In
                                            </span>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                                        <span>Didn't receive code?</span>
                                        <button
                                            type="button"
                                            onClick={() => handleSendOtp()}
                                            disabled={resendCooldown > 0 || isLoading}
                                            className="text-emerald-600 font-semibold hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                                        >
                                            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* EMAIL / GOOGLE LOGIN SECTION */}
                    {loginMethod === 'email' && (
                        <div>
                            {/* Google Login Option */}
                            <div className="flex justify-center mb-4">
                                <GoogleLogin
                                    onSuccess={handleGoogleLogin}
                                    onError={() => setErrorMessage('Google Login Failed')}
                                    theme="outline"
                                    size="large"
                                    shape="rectangular"
                                />
                            </div>

                            <div className="flex items-center my-4">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">or sign in directly</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            {/* Quick Demo Sign In Button */}
                            <button
                                onClick={() => handleDirectLogin("patient.demo@swaraksha.org")}
                                disabled={isLoading}
                                className="w-full mb-3 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
                            >
                                <span>⚡</span>
                                <span>{isLoading ? 'Signing In...' : 'Quick Demo Patient Sign In'}</span>
                            </button>

                            {/* Custom Email Sign In */}
                            <div className="flex gap-2 mt-1">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={customEmail}
                                    onChange={(e) => setCustomEmail(e.target.value)}
                                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                                <button
                                    onClick={() => handleDirectLogin()}
                                    disabled={isLoading || !customEmail.includes('@')}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition duration-200 disabled:opacity-50 cursor-pointer"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {isEmailDuplicate && (
                        <div className="mt-4">
                            <DuplicateEmail message="A Doctor Account with This Email Already Exists" />
                        </div>
                    )}
                </div>

                {/* Right Decorative Banner */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#175134] to-[#28a745] items-center justify-center p-12 self-stretch">
                    <div className="text-white text-center">
                        <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
                            <ShieldCheck className="w-10 h-10 text-emerald-200" />
                        </div>
                        <h4 className="mb-4 text-3xl font-bold tracking-tight">Your Health, Our Priority</h4>
                        <p className="text-emerald-50 text-sm leading-relaxed">
                            SwaRaksha AI utilizes advanced artificial intelligence for accurate health assessments, tailored report summaries, and secure real-time doctor consultations.
                        </p>
                        <div className="mt-8 flex flex-col gap-2 text-xs text-emerald-100 text-left bg-black/10 p-4 rounded-xl">
                            <span className="flex items-center gap-2">✓ Instant OTP mobile verification</span>
                            <span className="flex items-center gap-2">✓ AI-assisted triage & symptom collection</span>
                            <span className="flex items-center gap-2">✓ 1-on-1 certified medical consultations</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientLogin;
